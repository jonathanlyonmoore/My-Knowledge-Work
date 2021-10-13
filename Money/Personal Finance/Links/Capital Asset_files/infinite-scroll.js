
$.InfiniteScroll = function(options) {

    //Defaults
    var defaults = {
        page_type : 'article',
        background_fill_enabled: true,
        display_channel : true,
        items_to_load: 1,
        autoplay_videos: true,
        autoload_padding : 250,
        ad_definitions : {},
        //ad_native: false,
        //isAdNativeActive: false,
        ad_native: {
            active: false,
            url: null,
            status: false,
            position: 0
        },
        read_more : 1,
        next_article_buffer: 75,
        ad_timeout : 3000,
        is_canceled : false
    }

    var settings = $.extend({}, defaults, options || {});

//Array will store the articles from which Infinite Scroll will load
    var related_articles = [];

//Tracks article status
    var loadStatusEnum = {
        NEW: 0,
        QUEUED: 1,
        LOADING: 2,
        LOADED: 3,
        FAILED: 4
    };

    var currentArticleHref = "";

//Lock to determine if we can load another article.
    var load_lock = 0;

    var article_listing_obj = $('#infinite-scroll-container');

    var stickyHeight = 0;
    var headerHeight = $('.meganav').outerHeight();
    var navHeight = $('#Nav').outerHeight();

    var autoload_padding = settings.autoload_padding;

    var loading_throbber_HTML = '<div id="autoload_loading" style="text-align:center"><div class="throbber-loader">Loading�</div><div style="margin-top:10px; margin-bottom: 20px;">Loading More Content...</div></div>';
    var load_failed_HTML = '<div id="autoload_loading" style="text-align:center"><div style="margin-top:10px; margin-bottom: 20px;">Could not load more content.</div></div>';

    var ad_infinite_leaderboard = null;
    if(settings.page_type == 'article'){


    }

    var active_article_obj;

    var loadQueue = [];

    var v_param = getParameterByName('v');
    var infini_param = getParameterByName('infini');
    var ato_param = getParameterByName('ato');

    var adtest_param = getParameterByName("adtest");

    var jwp_load_init = false;
    var jwp_loaded = false;
    // This variable holds the refreshDynamicAds function and active_article_obj to be executed when ready
    var refreshDynamicAdsQueue = {};
    var ad_status_q = {};
    var ad_timeout = {};
    // This holds the ad slots per article index and removes them when fetched
    var ad_fetched_q = {};
    var isFirstLoad = false;

    // Tracks the articles in view for loading in ads in view. First one is loaded on page load.
    var articlesInView = {0: true};

    settings.ad_timeout = Number(getParameterByName("ato")) || settings.ad_timeout;

    process_initial_article();
    get_related_articles();

    $(document).on( "jwplayer-load-init", function(){
        jwp_load_init = true;
    });

    $(document).on( "jwplayer-initial-setup", function(e, video_player){
        if( $('#JWPVideo',  related_articles[0].content_obj).length > 0){
            related_articles[0].JWPObj = video_player;
            jwp_loaded = true;
            if(related_articles[0] === active_article_obj || active_article_obj === undefined){
                if (typeof video_player !== 'undefined') {
                    video_player.on('ready', function(){
                        video_player.setMute(true);
                    });
                }
            }
        }
    });

    $(document).on('ready', function () {


        if($('.separator-cta-title .next-title').length > 0){
            $('.separator-cta-title .next-title').text(related_articles[1].pageTitle);
        }

        if (!isFirstLoad) {
            isFirstLoad = true;
            if (!settings.is_canceled) {
                queueNArticles(related_articles, settings.items_to_load);
                loadQueuedItem(loadQueue);
            }
        }

        hook_autoload_window_scroll("#Footer",
            function () {
                queueNArticles(related_articles, settings.items_to_load);
                loadQueuedItem(loadQueue);
            }
        );

        $('#Content').on('click', '.readMore', function(){
            $(this).closest('.hide-more').removeClass('hide-more');
            $(this).parent().find('.heading-breaking-down ~ *').show();
            $(this).remove();

        });

        //Brign up mobile IS menu and darken body
        $('#infinite-scroll-container .title').on('click', function(){
           $(this).closest('#infinite-scroll-container').toggleClass('active');
            $('#Content').toggleClass('inactive');

            //Close main nav if open
            $('.nav-container').removeClass('open');
            $('.nav-container').removeClass('do-search');

            //Scroll to active item:
            if($(this).closest('#infinite-scroll-container').hasClass('active')) {

                if (active_article_obj !== undefined) {
                    if (active_article_obj.i !== undefined) {
                        $('#infinite-scroll-container .infinite-scroll-table-container').stop().scrollTop($(article_listing_obj.find('.item')[active_article_obj.i])[0].offsetTop);
                    }
                }
            }else{
                //Menu is disabled.
            }
        });

        //Make sure mobile header does not conflict with mobile IS nav
        $('.icon-menu-mobile, .icon-search-mobile').on('click', function(){
            $('#infinite-scroll-container').removeClass('active');
            $('#Content').removeClass('inactive');
        });
    });

    var script_whitelist = [
        'script_taxonomy',
        'script_comscore',
        /**
         * Script_optimizely is currently removed from whitelist because all of our experiments are designed with the
         * assumption that the code will only fire once on a given page, and infinite scroll causes the script to fire
         * multiple times on the same page. This is a big problem for any script that modifies the dom or does something
         * like a page redirect. OpX seems good at click tracking even after the DOM is modified so hopefully that
         * won't cause any issues. Re-enabling this will mean adding code to every experiment that has a chance of
         * affecting terms pages so if we need this functionality for a single experiment it would probably be easier
         * to make that change only for the single experiment rather than re-enabling it here. However if we decide
         * to re-enable it then we need to modify all existing experiments.
         */
        //'script_optimizely',
        'script_async_bidder',
        'script_wsod_load',
        'script_wsod',
        'script_dfp_tracking',
        'script_pagefair_ads',
        'script_pagefair_ads_2',
        'script_comscore',
        'script_sp_taggroup_mapping',
        'script_sp_taggroup_seq',
        'script_sp_keyword_sem',
        'script_sp_audience_segment',
        'script-jwp-setup',
        'script-jwp-event-tracking',
        'script-cb-tracker',
        'script-populate-datalayer-node',
        'script_page-view-id',
        'script_real-world-context'
    ];

    var dynamicAds_defaults = {
        adSlotRight: {
            adUnitPath: "",
            domName: 'AdSlot_AF-Right-Multi',
            taxSlotName: 'AF-Right-Multi',
            targeting : {
                Location : 'AF-Right-Multi',
                pos : 'top'
            },
            slotSize: [300, 250],
            isRecoverable: true,
            isWatched : true,
            oxSizes : ["300x250", "300x600", "160x600", "300x1050"],
            amzSizes : {
                desktop: [[300,250], [300,600], [160,600]],
                tablet: [[300,250]],
                phone: [[300,250]]
            },
        },
        adSlotRightRec: {
            adUnitPath: "",
            domName: 'AdSlot_AF-Right-Rectangle',
            taxSlotName: 'AF-Right-Rectangle',
            targeting : {
                Location : 'AF-Right-Rectangle',
                pos : 'top'
            },
            slotSize: [300, 250],
            oxSizes : ["300x250"],
            amzSizes : [[300,250]],
        },
        adSlotInfiniteLeaderboard: {
            adUnitPath: "",
            domName: 'AdSlot_AF-Top-Leaderboard',
            taxSlotName: 'AF-Top-Leaderboard',
            targeting : {
                Location: 'AF-Top-Leaderboard',
                pos : 'top'
            },
            slotSize: [728, 90],
            isRecoverable: true,
            isWatched : true,
            oxSizes : ["728x90", "970x250", "320x50"],
            amzSizes : {
                desktop: [[728 ,90], [970, 250]],
                tablet: [[728 ,90]],
                phone: [[728 ,90], [320,50]]
            }
        },
        adSlotICRectangle: {
            adUnitPath: "",
            domName: 'AdSlot_IC-Rectangle',
            taxSlotName: 'IC-Rectangle',
            targeting : {
                Location: 'IC-Rectangle',
                pos : 'mid'
            },
            slotSize: [300, 250],
            isRecoverable: true,
            isWatched : true,
            oxSizes : ["300x250"],
            amzSizes : [[300,250]],
        },
        adSlotButton1: {
            adUnitPath: "",
            domName : 'AdSlot_BF-Right-Button1',
            taxSlotName: 'BF-Right-Button1',
            targeting: {
                Location: 'BF-Right-Button1'
            },
            slotSize: [[120,60], [120, 90]],
            isRecoverable: true,
        },
        adSlotButton2: {
            adUnitPath: "",
            domName : 'AdSlot_BF-Right-Button2',
            taxSlotName: 'BF-Right-Button2',
            targeting: {
                Location: 'BF-Right-Button2'
            },
            slotSize: [[120,60], [120, 90]],
            isRecoverable: true
        },
        adSlotButton3: {
            adUnitPath: "",
            domName : 'AdSlot_BF-Right-Button3',
            taxSlotName: 'BF-Right-Button3',
            targeting: {
                Location: 'BF-Right-Button3'
            },
            slotSize: [[120,60], [120, 90]],
        },
        adSlotButton4: {
            adUnitPath: "",
            domName : 'AdSlot_BF-Right-Button4',
            taxSlotName: 'BF-Right-Button4',
            targeting: {
                Location: 'BF-Right-Button4'
            },
            slotSize: [[120,60], [120, 90]],
        },
        adSlotRightTextLink1: {
            adUnitPath: "",
            domName : 'AdSlot_AF-Right-Textlink1',
            taxSlotName: 'AF-Right-Textlink1',
            targeting: {
                Location: 'AF-Right-Textlink1'
            },
            slotSize: [[350, 35], [350, 55]]
        },
        adSlotRightTextLink2: {
            adUnitPath: "",
            domName : 'AdSlot_AF-Right-Textlink2',
            taxSlotName: 'AF-Right-Textlink2',
            targeting: {
                Location: 'AF-Right-Textlink2'
            },
            slotSize: [[350, 35], [350, 55]]
        },
        adSlotRightTextLink3: {
            adUnitPath: "",
            domName : 'AdSlot_AF-Right-Textlink3',
            taxSlotName: 'AF-Right-Textlink3',
            targeting: {
                Location: 'AF-Right-Textlink3'
            },
            slotSize: [[350, 35], [350, 55]]
        },
        adSlotRightTextLink4: {
            adUnitPath: "",
            domName : 'AdSlot_AF-Right-Textlink4',
            taxSlotName: 'AF-Right-Textlink4',
            targeting: {
                Location: 'AF-Right-Textlink4'
            },
            slotSize: [[350, 35], [350, 55]]
        },
        adSlotBCTextNote : {
            adUnitPath: "",
            domName : 'AdSlot_BC-TextNote',
            taxSlotName: 'BC-Textnote',
            targeting: {
                Location: 'BC-Textnote'
            },
            slotSize: '',
            isRecoverable: true
        }
    };

    var dynamicAds = $.extend(true, {}, dynamicAds_defaults, settings.ad_definitions || {});

    /*
     * This function handles hooks to window scroll functionality
     * @param {string} element - jQuery Selector for the element that should trigger autoload of the next article.
     * @param {function} callback - function to call once the element has been reached via scrolling
     */


    function loadNextAds(wS, active_article, active_percent) {
        $('.autoload_content').each(function (i, e) {
            var hT = $(e).offset().top,
              hH = $(e).outerHeight();

            // Returns the size of $('.autoload_content') and its position relative to the viewport.
            var href = $(e).data('href');
            if (wS + headerHeight + settings.next_article_buffer > hT && wS + headerHeight < hT + hH) {
                active_article = $(e);
                active_percent = (((wS - headerHeight - navHeight ) - hT) / (hH));

            } else {
                // INV-4692 - added in bounding box check. For all other articles check tosee if they are within the
                // view port
                var boundingBox = $(e).get(0).getBoundingClientRect();

                if (boundingBox.bottom > 0 &&
                  boundingBox.right > 0 &&
                  boundingBox.top < (window.innerHeight || document.documentElement.clientHeight) &&
                  boundingBox.left < (window.innerWidth || document.documentElement.clientWidth)) {
                    // Call load on dynamic ads of the next object.
                    if (!(i in articlesInView)) {
                        var nextArticleID = $(e).attr('data-autoload-id');
                        articlesInView[nextArticleID] = true;
                        callRefreshDynamicAds(nextArticleID);
                    }
                }

                if (settings.background_fill_enabled) {
                    article_listing_obj.find('.item:eq(' + i + ')').children('.bg').css('width', '0%');
                }
            }
        });

        var output = { activeArticle: active_article, activePercent: active_percent };
        return output;
    }

    $(window).on('load', function () {
        if (settings.is_canceled) return;
        var wS = $(window).scrollTop();

        var active_article = null;
        var active_percent = 0;
        loadNextAds(wS, active_article, active_percent);
    });


    function hook_autoload_window_scroll(element, callback) {
        var stickyHeightNav = article_listing_obj.offset().top;

        $(window).on('scroll', function () {
            if (settings.is_canceled) return;
            var wH = $(window).height(),
                wS = $(window).scrollTop();
            var raH = article_listing_obj.outerHeight();
            var raT = article_listing_obj.position().top;
            var footerTop = $('#Footer').offset().top;
            var firstLeaderBoardHeight = $('.ad-leaderboard').outerHeight();

            $('#Header, #Nav, #initial-content .ad-leaderboard,  #Header .free-reports, #infinite-scroll-container, .meganav, .four-a1-spacer').toggleClass("down", (wS > stickyHeight));
           // $('#infinite-scroll-container').toggleClass("down", (wS > firstLeaderBoardHeight));

            //console.log("wS " + wS + "wh " + wH + "raH " + raH + "footerTop " + footerTop + " | " + (wS + wH - raH) + " ");
            article_listing_obj.toggleClass("bottomed", (wS + raH + 61 > footerTop));

            var active_article = null;
            var active_href = null;
            var active_percent = 0;

            var activeValues = loadNextAds(wS, active_article, active_percent);

            if (typeof activeValues !== 'undefined') {
                if (typeof activeValues.activeArticle !== 'undefined') {
                    active_article = activeValues.activeArticle;
                }

                if (typeof activeValues.activePercent !== 'undefined') {
                    active_percent = activeValues.activePercent;
                }
            }

            if (active_article) {
                active_href = $(active_article).data('href');
                var active_autoload_id = $(active_article).data('autoload-id');
                var active_nav_item = $(article_listing_obj.find('.item')[active_autoload_id]);

                for(var i = 0; i < related_articles.length; i++) {
                    if (related_articles[i].href == active_href) {
                        active_article_obj = related_articles[i];
                    }
                }

                //If the suers scrolls into a different article
                if (currentArticleHref.localeCompare(active_href) != 0 && active_href != undefined) {
                    if(active_article_obj !== undefined){
                        currentArticleHref = active_href;
                        active_nav_item.trigger('activeChange', active_nav_item);
                        document.title = active_article_obj.pageTitle;
                        history.replaceState(null, null, active_article_obj.parameterizedHref);


                        //If the user has not viewed this content yet,
                        if(active_article_obj.viewed == false) {

                            //Set this first so that in case of script failure we do not retry.
                            active_article_obj.viewed = true;
                            //If we moved into an article that has not been viewed.
                            executeScripts(active_article_obj.scripts, script_whitelist);
                            gaTracking(active_article_obj);
                            cbTracking(active_article_obj);
                            handleInfiniteJWP(active_article_obj);
                        }
                    }


                    if(settings.page_type == 'article'){
                        if(active_autoload_id > 0){
                            $('#infinite-scroll-container ol').stop().animate({
                                scrollTop:  $(article_listing_obj.find('.item')[active_autoload_id - 1])[0].offsetTop
                            }, 1000);
                        }
                    }else{
                        $('#infinite-scroll-container .infinite-scroll-table-container').stop().animate({
                            scrollTop:  $(article_listing_obj.find('.item')[active_autoload_id])[0].offsetTop
                        }, 1000);
                    }
                }


                //If there is another article
                if(active_article_obj !== undefined && related_articles[active_article_obj.i + 1]){
                    $('#infinite-scroll-container').removeClass("hide-small-nav");
                    var next_article_obj = related_articles[active_article_obj.i + 1];
                    //And that article is loaded and has a video.
                    $('.title-next').html(next_article_obj.pageTitle);

                    if(next_article_obj.loadStatus == loadStatusEnum.LOADED){
                        if($('#JWPVideo', next_article_obj.content_obj).length > 0) {

                            //This will set up the JWPlayer instance
                            function jwp_page_instance(){
                                if (typeof jwplayer === "undefined") {
                                    return;
                                }
                                jwplayer.key = jwplayer_key;
                                executeScripts(next_article_obj.scripts, ['script-jwp-setup']);
                                var playerId = 'JWPVideo-' + next_article_obj.i;
                                $('#JWPVideo', next_article_obj.content_obj).attr('id', playerId).addClass('JWPVideo');
                                JWP_setup_obj.width = '100%';
                                JWP_setup_obj.aspectratio = "16:9";
                                JWP_setup_obj.autostart = false;
                                JWP_setup_obj.sharing.link = "http://www.investopedia.com" + next_article_obj.href;
                                var impUrl = "";
                                impUrl += "infiniteScroll" + encodeURIComponent("=") + 'true' + encodeURIComponent("&");
                                impUrl += "pageInScroll" + encodeURIComponent("=") + (next_article_obj.i + 1);
                                impUrl = "&cust_params=" + impUrl;
                                adTagUrl += impUrl;
                                next_article_obj.JWPObj = jwplayer(playerId).setup(JWP_setup_obj);
                                executeScripts(next_article_obj.scripts, ['script-jwp-event-tracking']);
                                trackJwpEvents(playerId);
                                dataLayer.push({
                                    'event':'newJWPAdded'
                                });
                            }

                            //If the JWP library isnt loading yet we need to run the script to load it
                            if(typeof videoInit === 'undefined' || !videoInit.didStart){
                                //Code to load library is located in script-jwp-load, and we know it exists because there is a video on the page
                                executeScripts(next_article_obj.scripts, ['script-jwp-load']);
                                if (new VideoInit().canRun()) {
                                    jwp_page_instance();
                                } else {
                                    new VideoInit().callBack = jwp_page_instance;
                                }
                            }else{
                                jwp_page_instance();
                            }
                        }

                    }
                }else{
                    $('.title-next').html("");
                    $('#infinite-scroll-container').addClass("hide-small-nav");
                }

                //$('#autoload_nav .item a[href="' + active_href + '"]').parent('div').addClass('active');
                var hasImage = active_nav_item.children('.item-image').length ? 1 : 0;
                active_percent = Math.max(0, active_percent * (100 - (27 * hasImage) ) + (27 * hasImage)) + 6;
                active_percent = active_percent > 95 ? 100 : active_percent;

                //First remove active from all other articles
                article_listing_obj.find('.item.active').removeClass('active');
                active_nav_item.addClass('active');

                if(settings.background_fill_enabled) {
                    active_nav_item.children('.bg').css({
                        background: '#FFFFFF',
                        width: 100 - active_percent + '%'
                    });
                }
            }

            var hT = $(element + ":last").offset().top,
                hH = $(element + ":last").outerHeight();
                sT = $(".separator:last").offset().top;

            if (( wS + $(window).height() >= sT ) || $(window).scrollTop() + $(window).height() == $(document).height()) {
                callback();
            }
        });
    }


function handleInfiniteJWP(active_article_obj){
    for(var i = 0; i < related_articles.length; i++){
        if(related_articles[i].JWPObj != null){
            var thisPlayer = related_articles[i].JWPObj;
            if( active_article_obj.i != i ) {
                if (related_articles[i].i == 0) {
                    if (!related_articles[i].videoApplication) {
                        related_articles[i].videoApplication = typeof videoApplication0 !== 'undefined' ? videoApplication0 : null;
                    }
                }
                if (related_articles[i].videoApplication) {
                    if ((active_article_obj.i - i) === 1) {
                        related_articles[i].videoApplication.onClick_();
                    }
                }
                thisPlayer.pause(true);
            }

            thisPlayer.on('adComplete', function(e) {
                this.pause(true);
            });
        }
    }

    if(active_article_obj.JWPObj == null){
        //Check to make sure if we need to set up JWP object, in case user jumped around using the scroll bar.
        if(jwp_loaded) {
            if ($('#JWPVideo', active_article_obj.content_obj).length > 0) {
                $('#JWPVideo', active_article_obj.content_obj).attr('id', 'JWPVideo-' + active_article_obj.i).addClass('JWPVideo');
                JWP_setup_obj.width = '100%';
                JWP_setup_obj.autostart = false;
                active_article_obj.JWPObj = jwplayer('JWPVideo-' + active_article_obj.i).setup(JWP_setup_obj);
                dataLayer.push({
                    'event': 'newJWPAdded',
                });
            }
        }
    }

    function initIma(active_article_obj) {
        active_article_obj.imaInit = true;
        executeScripts(active_article_obj.scripts, ['script-jwp-ima-sdk']);
        active_article_obj.videoApplication  = new VideoApplication(active_article_obj.i, isAutoPlay, idc_device, adTagUrl);
    }

    //If JWP object setup run it.
    if(active_article_obj.JWPObj != null){
        if(settings.autoplay_videos) {
            if(active_article_obj.JWPObj.getState() != 'playing'){
                active_article_obj.JWPObj.setMute(true);
            }
            if (!active_article_obj.imaInit) {
                initIma(active_article_obj);
            } else {
                active_article_obj.JWPObj.play(true);
            }
        } else {
            if (!active_article_obj.imaInit) {
                initIma(active_article_obj);
            }
        }
    }
}

function executeScripts(scriptsArray, whiteList){
    if(whiteList !== undefined && typeof scriptsArray !== "undefined") {
        scriptsArray.each(function (ii, ee) {
            script_id = $(ee).data('id');
            if (script_id === undefined) {
                script_id = ii;
            }

            if ($.inArray(script_id, whiteList) > -1) {
                if (script_id != 'script_gtm_load' && script_id != 'script_autoload_js') {
                    $('body').append(ee);
                }
            }

        });
    }
}

    /*Pushes events to GTM datalayer for the active article passed in.
    @param active_article_obj object representing the active article
     */
function gaTracking(active_article_obj) {

    if (active_article_obj.i > 0) {
        dataLayer.push({
            'event': 'event-infinite-scroll-pageview'
        });
    }


    dataLayer.push({
        'event': 'event-infinite-scroll-load',
        'eventLabel': active_article_obj.i
    });




    // GA Tracking saving it for later
    // Event Action for PG-Native View End
    //if(settings.ad_native.status && active_article_obj.href != settings.ad_native.url) {
    //    settings.ad_native.status = false
    //    dataLayer.push({
    //        'event': 'event-infinite-scroll-pgnative',
    //        'eventCategory': 'DFP-Native',
    //        'eventAction': 'View End',
    //        'eventLabel': settings.ad_native.creativeName
    //    });
    //}
}

function cbTracking(active_article_obj) {
    if (typeof(pSUPERFLY) !== "undefined") {
        if ("virtualPage" in pSUPERFLY) {
            if ("href" in active_article_obj
                && "pageTitle" in active_article_obj) {
                pSUPERFLY.virtualPage(active_article_obj.href,
                    active_article_obj.pageTitle);
            }
        }
    }
}

function _stickyHelper(active_article_obj, class_target) {
    var c;
    if (active_article_obj.length > 0) {
        active_article_obj = active_article_obj[0];
    }
    if (typeof active_article_obj.getElementsByClassName == "function") {
        c = active_article_obj;
    } else {
        if (active_article_obj.content_obj.length < 1) {
            return null;
        }
        c = active_article_obj.content_obj[0];
    }
    if (c.getElementsByClassName(class_target).length < 1) {
        return null;
    }
    return c;
}

function stickIfSticky(active_article_obj, class_target) {
    var c = _stickyHelper(active_article_obj, class_target);
    if (c === null) {
        return;
    }
    var cO = c.getElementsByClassName(class_target)[0];
    var cData = JSON.parse(cO.getAttribute("data-options"));

    var upper = c.offsetTop;
    if(typeof cData.upper !== 'undefined'){
        upper = cData.upper;
    }

    $(window).scroll(function() {
        var _content_obj = {"slotDiv" : {}, "snapToTopRules" : {
            "upper" : upper,
            "lower" : c.getElementsByClassName("separator")[c.getElementsByClassName("separator").length - 1].offsetTop - cData.adsHeight + active_article_obj.removedHeight - active_article_obj.flexAdjustedHeight,
            "position" : "fixed",
            "top" : cData.toTop,
            "forwardBuffer" : cData.forwardBuffer,
            "stickyPlacementBuffer" : cData.stickyPlacementBuffer,
            "afterPlacementBuffer" : cData.afterPlacementBuffer} };
        _content_obj.slotDiv = cO;
        stickyContent(_content_obj);
    });
}

function stickyContent(content_obj) {
    if (($(window).scrollTop() + content_obj.snapToTopRules["top"]) >= content_obj.snapToTopRules["upper"]
        && ($(window).scrollTop() + content_obj.snapToTopRules["top"] + content_obj.snapToTopRules["forwardBuffer"]) <= content_obj.snapToTopRules["lower"]) {
        content_obj.slotDiv.style.position = content_obj.snapToTopRules["position"];
        content_obj.slotDiv.style.top = content_obj.snapToTopRules["top"]+content_obj.snapToTopRules["stickyPlacementBuffer"]+"px";
    } else if ($(window).scrollTop() >= content_obj.snapToTopRules["upper"]) {
        content_obj.slotDiv.style.position = "absolute";
        content_obj.slotDiv.style.top = content_obj.snapToTopRules["lower"]-content_obj.snapToTopRules["afterPlacementBuffer"]+"px";
    } else {
        content_obj.slotDiv.style.position = "";
        content_obj.slotDiv.style.top = "";
    }
}

function processRoles(roles, e) {
    for (var i = 0; i < roles.length; i++) {
        var divs = $("div[data-role='" + roles[i] + "']", e.content_obj);
        if (roles[i] == "removable") {
            e = _processRoles(divs, e, "removable");
        }
        if (roles[i] == "flex") {
            e = _processRoles(divs, e, "flex");
        }
    }
    return e;
}

function _processRoles(divs, e, rType) {
    for (var i = 0; i < divs.length; i++) {
        var d = JSON.parse(divs[i].dataset.options);
        if (rType == "removable") {
           e = _processRemovable(e, d, divs[i]);
        }
        if (rType == "flex") {
            e = _processFlex(e, d);
        }
    }
    return e;
}

function _processRemovable(e, d, i) {
    if (d.ruleType == "height") {
        if (e.content_obj.outerHeight() < d.minHeight
            || e.content_obj.outerHeight() > d.maxHeight) {
            if (d.removedHeight) {
                e.removedHeight += d.removedHeight;
            } else {
                e.removedHeight += i.clientHeight;
            }
            i.style.display = "none";
        }
    }
    if (d.ruleType == "alt") {
        if (d.isEven != (e.i % 2 > 0)) {
            try {
                i.remove();
            } catch (e) {
                i.style.display = "none";
            }

        }
    }
    return e;
}

function _processFlex(e, d) {
    if (d.ruleType == "height") {
        if (e.content_obj.outerHeight() < d.minHeight
            || e.content_obj.outerHeight() > d.maxHeight) {
            e.flexAdjustedHeight = d.flexHeight - d.originalHeight;
        }
    }
    return e;
}

// This updates the ad_status_q and ad_fetched_q variables
// It adds or removes ad slots per index
function queueUpdate(queue, index, dynamicAd, action) {
    if (!(index in queue)) {
        queue[index] = {};
    }
    if (!dynamicAd[action]) {
        queue[index][dynamicAd.domName] = false;
    } else {
        delete queue[index][dynamicAd.domName];
    }
    return queue;
}

//This pulls the refreshDynamicAds function and associated active_article_obj from queue and executes
function callRefreshDynamicAds(i) {
    var _refreshNextDynamicAds = refreshDynamicAdsQueue[i];
    delete refreshDynamicAdsQueue[i];
    if (typeof _refreshNextDynamicAds !== "undefined") {
        _refreshNextDynamicAds[0].apply(this, [_refreshNextDynamicAds[1]]);
    }
}

function refreshDynamicAds(active_article_obj){

    setInfiniteScrollTargeting(active_article_obj.i + 1);
    // This is used by idc library for the upcoming term targeting
    _nextPageTaxonomy = active_article_obj.pageTaxonomy;
    // This resets simpUrl for the next term
    simpUrl = "";
    executeScripts(active_article_obj.scripts, ['script_page-view-id',
        'script_dynamic-slots']);

    if (!(active_article_obj.href === "#sponsored")) { //this article might have ads
        $.each(dynamicAds, function(i, ad_obj){
            refreshDynamicAd(active_article_obj, ad_obj)
        });
    } else {//this article is sponsored, meaning it is an ad, and will not have other ads
        // Immediately call ads for next article
        $(window).scroll(function() {
            callRefreshDynamicAds(active_article_obj.i + 1);
        });
    }


    if (typeof OBR !== "undefined") {
        OBR.extern.researchWidget();
    }


}

    function refreshDynamicAd(active_article_obj, ad_obj){
        // Modify targeting for the ad.
        var taxonomy = active_article_obj.pageTaxonomy;
        var targeting = {
          url: taxonomy.Path,
          microtags: taxonomy.microtags,
          secondarysubchannel: taxonomy.SecondarySubChannel,
          subchannel: taxonomy.SubChannel,
          leadgentarget: taxonomy.LeadGenTarget,
          pagetitle: active_article_obj.pageTitle,
          timelessness: taxonomy.Timelessness,
        };
        $.extend(ad_obj.targeting, targeting);

        var instanceSlotName =  ad_obj.domName + "-" + active_article_obj.i;
        var adSlotFound = false;
        var aH = active_article_obj.content_obj.outerHeight();
        if( $("#" + ad_obj.domName, active_article_obj.content_obj).length > 0 ) {
                $("#" + ad_obj.domName, active_article_obj.content_obj).attr('id', instanceSlotName);
                    adSlotFound = true;
                }
        //AF-Right-Multi when displayed persistantly
        if(ad_obj.domName == 'AdSlot_AF-Right-Multi' && $('#'+instanceSlotName).length > 0){
            adSlotFound = true;
        }

        var extractAdFromIframe = false;
        var defineOutOfSlot = false;
        if (ad_obj.domName == 'AdSlot_BC-TextNote') {
            defineOutOfSlot = true;
            if (active_article_obj.hasReadMore) {
                adSlotFound = false;
            }
        }

        //Case for AF-Right-Multi being in the fixed sidebar
        var renderOnScroll = true;
        if(ad_obj.domName == 'AdSlot_AF-Right-Multi' &&  settings.page_type == 'article'){
            renderOnScroll = false;
        } else if (articlesInView[active_article_obj.i]) {
            renderOnScroll = false;
        }

        if (ad_obj.domName == "AdSlot_AF-Right-Multi") {
            var inst = $("#" + instanceSlotName);
            if (inst.data("role") === "flex") {
                if (aH < inst.data("options").minHeight) {
                    ad_obj.slotSize = [[300, 250], [300, 100]];
                } else if(aH >= inst.data("options").minHeight && aH <= inst.data("options").maxHeight) {
                    ad_obj.slotSize = [300, 250];
                } else {
                    ad_obj.slotSize = [[300, 600], [300, 250]];
                }
            }
            ad_obj.sizeMapping = {};
        }

        if (ad_obj.domName == "AdSlot_BF-Right-Button1" ||
            ad_obj.domName == "AdSlot_BF-Right-Button2" ||
            ad_obj.domName == "AdSlot_BF-Right-Button3" ||
            ad_obj.domName == "AdSlot_BF-Right-Button4" ||
            ad_obj.domName == "AdSlot_AF-Right-Textlink1" ||
            ad_obj.domName == "AdSlot_AF-Right-Textlink2" ||
            ad_obj.domName == "AdSlot_AF-Right-Textlink3" ||
            ad_obj.domName == "AdSlot_AF-Right-Textlink4") {
            var inst = $("#" + instanceSlotName);
            if (inst.data("role") === "removable") {
                if (aH >= inst.data("options").minHeight && aH <= inst.data("options").maxHeight) {
                    adSlotFound = true;
                } else {
                    adSlotFound = false;
                }
            }
        }


        //Only if the Ad Slot exists: IC-Rectangle might not be in all pages.
        if(adSlotFound) {
            var DynamicAd = new dynamicAd();
            DynamicAd.domName = instanceSlotName;
            DynamicAd.slotSize = ad_obj.slotSize;
            DynamicAd.taxSlotName = ad_obj.taxSlotName;
            DynamicAd.isFrameExtraction = extractAdFromIframe;
            DynamicAd.targeting = ad_obj.targeting;
            DynamicAd.perCentLeadTime = 0.6;
            DynamicAd.isRenderOnScroll = renderOnScroll;
            DynamicAd.hasRendered = false;
            DynamicAd.isDefinedOutOfSlot = defineOutOfSlot;
            DynamicAd.isRecoverable = ad_obj.isRecoverable;
            DynamicAd.isWatched = ad_obj.isWatched ? ad_obj.isWatched : false;
            DynamicAd.amzSizes = ad_obj.amzSizes ? ad_obj.amzSizes : [];

            if(ad_obj.sizeMapping){
                DynamicAd.sizeMapping = ad_obj.sizeMapping;
            }
            if (ad_obj.oxSizes) {
                DynamicAd.oxSizes = ad_obj.oxSizes;
            }


            // Populate ad_fetched_q and ad_status_q; as user scrolls they will be updated
            ad_fetched_q = queueUpdate(ad_fetched_q, active_article_obj.i, DynamicAd, "hasFetched");
            if (DynamicAd.isWatched) {
                ad_status_q = queueUpdate(ad_status_q, active_article_obj.i, DynamicAd, "hasRendered");
            }
            DynamicAd.renderAd(); // Register with OpenX
            $(window).scroll(function() {
                if (gptEnabled === active_article_obj.i) {
                    DynamicAd.renderAd();
                }
                ad_fetched_q = queueUpdate(ad_fetched_q, active_article_obj.i, DynamicAd, "hasFetched");
                if (DynamicAd.isWatched) {
                    ad_status_q = queueUpdate(ad_status_q, active_article_obj.i, DynamicAd, "hasRendered");
                }
                if (Object.keys(ad_fetched_q[active_article_obj.i]).length === 0) {
                    // Now that there are no mores ads for this index to be fetched, refresh ads for next term
                    callRefreshDynamicAds(active_article_obj.i + 1);
                }
            });


        }
    }

    function ExtractAdFromIframe(instanceSlotName){
        var textnote_iframe_id = $("#" + instanceSlotName).find('iframe:first').attr('id');
        //console.log("FRAME ID: " + textnote_iframe_id);
        // WARNING: This function intermittently failing. Need to investigate.
        try {
          LoadFrameContentsIntoParent(textnote_iframe_id, '#' + instanceSlotName);
        } catch(e) {};
    }

    function setInfiniteScrollTargeting(pageNum){
        if (typeof idc_targeting !== "undefined") {
            idc_targeting.pageInScroll = pageNum.toString();
            idc_targeting.infiniteScroll = 'true';
        }
    }

    function generateAdUnitPath (adObject, active_article_obj) {
        var pTaxDfpTarget = "NA/NA";
        var pTaxType = "Homepage";
        var adSlotName = "ad-slot";
        if (isPageTaxonomySet(active_article_obj)) {
            pTaxDfpTarget = active_article_obj.pageTaxonomy.DfpTarget;
            pTaxType = active_article_obj.pageTaxonomy.Type.replace(/\s/g, '');
        }
        if (typeof adObject != "undefined"
            && adObject.hasOwnProperty("taxSlotName")) {
            adSlotName = adObject.taxSlotName;
        }
        return "/8397/INV-NA/" + pTaxDfpTarget + "/" + adSlotName + "/" + pTaxType;
    }

    function isPageTaxonomySet(active_article_obj) {
        if (typeof active_article_obj.pageTaxonomy != "undefined"
            && active_article_obj.pageTaxonomy.hasOwnProperty("DfpTarget")
            && active_article_obj.pageTaxonomy.hasOwnProperty("Type")) {
            return true;
        }
        return false;
    }

//Processes first article for autoload system
    function process_initial_article() {
        var location_path = window.location.pathname;

        //This line is to fix a bug in jQuery 1.7 where scripts inside an element that is wrapped, are reexecuted.
        //Fix was made in jQuery 1.9 https://github.com/jquery/jquery/pull/864
        $('#Content').find('script').remove();
        //Advise upgrading to jQuery 1.9

        $('#Content').wrapInner('<div id="initial-content" class="autoload_content group" data-autoload-id="0" data-href="' + location_path + '"></div>');
        var initialObj = $('#initial-content');
        var page_title = $('.layout-title h1').text().trim();
        var max_title_length = 30;
        var trimmed_title = page_title;
        if(trimmed_title.length > max_title_length){
            var trimmed_title = page_title.substr(0, max_title_length);
            trimmed_title = trimmed_title.substr(0, Math.min(trimmed_title.length, trimmed_title.lastIndexOf(" ")));
            trimmed_title += " ...";
        }

        var item_category = _pageTaxonomy.SubChannel ? _pageTaxonomy.SubChannel : _pageTaxonomy.Channel;

        var initial_item = $('<li class="item initial"></li>');

        initial_item.prepend('<h3 class="item-title"><a href="' + location_path + '">' + trimmed_title + '</a></h3>');
        if(settings.display_channel == true) {
            initial_item.prepend('<div class="item-category">' + item_category + '</div>');
        }
        if( typeof $('#Content').data('thumbnail-src') !== "undefined") {
            if ($('#Content').data('thumbnail-src').length > 0) {
                var thumbnail_image_src = $('#Content').data('thumbnail-src');
                initial_item.prepend('<a href="'+location_path+'" class="item-image" ><img class="item-image-src" src="'+thumbnail_image_src+'" /></a>');
            }
        }
        article_listing_obj.find('ol').prepend(initial_item);
        var active_article_obj = {"content_obj" : initialObj, "removedHeight" :0, "flexAdjustedHeight" : 0}

             active_article_obj.i = 0;
        gaTracking(active_article_obj);
    }

//Populates list of related articles.
//Scrapes the DOM for items in #infinite-scroll-container
    function get_related_articles(indexStartAt) {
        indexStartAt = typeof indexStartAt !== "undefined" ? indexStartAt : 0;
        article_listing_obj.find('.item .item-title a').each(function (i, e) {
            if (i >= indexStartAt) {
                var loadStatus = loadStatusEnum.NEW;
                var content_obj = null;
                var viewStatus = false;
                var pageTitle = $(e).text().trim();
                var pageTaxonomy = null;
                var adsServed = false;
                var removedHeight = 0;
                var flexAdjustedHeight = 0;
                var thisHref = $(e).attr('href');
                var JWPObj = null;

                var parameterizedHref = thisHref;
                if (infini_param.length > 0) {
                    parameterizedHref = updateQueryStringParameter(thisHref, 'layout', 'infini');
                }
                if (v_param.length > 0) {
                    parameterizedHref = updateQueryStringParameter(parameterizedHref, 'v', v_param);
                }
                if (adtest_param.length > 0) {
                    parameterizedHref = updateQueryStringParameter(parameterizedHref, 'adtest', adtest_param);
                }
                if (ato_param.length > 0) {
                    parameterizedHref = updateQueryStringParameter(parameterizedHref, 'ato', settings.ad_timeout);
                }


                if (thisHref.localeCompare(window.location.pathname) == 0) {
                    loadStatus = loadStatusEnum.LOADED;
                    content_obj = $('#initial-content');
                    viewStatus = true;
                    pageTitle = $('.layout-title h1').text().trim();
                    pageTaxonomy = _pageTaxonomy;
                    adsServed = true;

                }

                related_articles.push(
                    {
                        'i': i,
                        'href': thisHref,
                        'pageTitle': pageTitle,
                        'loadStatus': loadStatus,
                        'viewed': viewStatus,
                        'content_obj': content_obj,
                        'pageTaxonomy': pageTaxonomy,
                        'adsServed': adsServed,
                        'removedHeight': removedHeight,
                        'flexAdjustedHeight': flexAdjustedHeight,
                        'JWPObj': JWPObj,
                        'parameterizedHref': parameterizedHref,
                        'hasReadMore': false,
                        'imaInit': i == 0 ? true : false,
                        'videoApplication': null
                    }
                );


                $(e).attr('href', thisHref);

                $(this).parents('.item').prepend('<div class="bg"></div>');
            }
        });
    }


//Handles navigation content from related articles navigation.
    function navigate_autoload_content(e) {
        e.preventDefault();
        var href = $(this).attr('href');
        var load_new_page = true;

/*
        for (var i = 0; i < related_articles.length; i++) {
            var related_article = related_articles[i];
            if (related_article.loadStatus == loadStatusEnum.LOADED &&
                related_article.href.localeCompare(href) == 0 &&
                related_article.content_obj
            ) {
                $("html, body").animate({
                    scrollTop: $('.autoload_content[data-href="' + href + '"]').offset().top - 144
                }, 1000);
                load_new_page = false;
            }
        }
*/


        if (load_new_page) {
            window.location = href; //updateQueryStringParameter(href, 'layout', 'infini');
        }
    }

    //Being passed the list of related articles this functions loads the next.
        function loadNextArticle(related_articles) {
            queueNArticles(related_articles, 1);
            loadQueuedItem(loadQueue);
        }

        function queueNArticles(related_articles, toLoad){
            var num_queued = 0;
            for (var i = 0; num_queued < toLoad && i < related_articles.length && load_lock == 0; i++) {
                if (related_articles[i].loadStatus == loadStatusEnum.NEW) {
                    related_articles[i].loadStatus = loadStatusEnum.QUEUED;
                    loadQueue.push(related_articles[i]);
                    num_queued++;
                }
            }

        }

        /*
            Loads the next item from the loadQueue
         */
        function loadQueuedItem(queue){
            if(queue != undefined) {
                if (queue.length > 0) {
                    var item = queue.shift();
                    var prev_num = item.i - 1;
                    if (typeof ad_timeout[prev_num] === "undefined") {
                        ad_timeout[prev_num] = 0;
                    }
                    if (prev_num > 1) {
                        if ( (Object.keys((ad_status_q[prev_num] || {})).length > 0) && ad_timeout[prev_num] == 0) {
                            queue.unshift(item);
                            pending_load(queue, prev_num);
                            return;
                        }
                    }
                    item.loadStatus = loadStatusEnum.LOADING;
                    before_load(item);
                    load(item);
                }
            }
        }

        function pending_load(queue, i) {
            load_lock = 1;
            var loading_after = $('#Content');
            if(!$('#autoload_loading').length){
                loading_after.append(loading_throbber_HTML);
            }
            if (queue.length > 0) {
                var _loadQueuedItem = loadQueuedItem;
                var _queue = queue;
                var _i = i;
                var _ad_timeout = ad_timeout;
                setTimeout(function() {
                    _ad_timeout[_i] = 1;
                    _loadQueuedItem(_queue);
                }, settings.ad_timeout);
            }
        }

        /*
         Functionality before the ajax call to load the article.
         @param e - related article to be loaded
         */
        function before_load(e) {

            load_lock = 1;
            var loading_after = $('#Content');

            if(!$('#autoload_loading').length){
                loading_after.append(loading_throbber_HTML);
            }
            loading_after.append('<span id="autoload-slot-'+ e.i+'"></span>');

            $(window).scroll();

        }

        /*
         Loads the related article
         @param e - related article to load
         */
        function load(e) {
            requestData = {};
            requestData.layout = "infini";
            if(getParameterByName('v') != ""){
                requestData.v = getParameterByName('v');
            }
            requestData.infini_n = e.i+1;

            $.ajax({
                url: e.href,
                data: requestData,
                success: function (data) {
                    after_load(e, data);
                },
                error: function () {
                    load_error(e);
                }
            });
        }


        /*
         Function after the article load.
         @param e - article that was loaded
         @param data - resposne from the server
         */
        function after_load(e, data) {

            var autoload_content_obj;
            if(e.href == settings.ad_native.url && settings.ad_native.status ) {
                autoload_content_obj = $('<div class="autoload_content autoload_content_sponsored layout-size group hide-more" data-autoload-id="'+ e.i+'" data-href="' + e.href + '"><div id="AdSlot_PG-Native"></div></div>');
            }else {
                autoload_content_obj = $('<div class="autoload_content layout-size group hide-more" data-autoload-id="'+ e.i+'" data-href="' + e.href + '">' + $('#Content', data).html() + '</div>');
            }

            $('.layout-side, .infinite-first-only', autoload_content_obj).remove();
            $('.group.bf-ads', autoload_content_obj).remove();


            //Read More
            if(settings.page_type == 'term' && autoload_content_obj.find('.heading-breaking-down').nextAll('*').not('.ad-incontent-wrap').not('.content-body').not('p:empty').length > settings.read_more){
                    var content_after_breaking_down = autoload_content_obj.find('.heading-breaking-down ~ *').show();
                    //we need to make sure everything after the first breaking down paragraph is hidden.
                    var start_hiding_content = false;
                    content_after_breaking_down.each(function(i, e){

                        if(!start_hiding_content) {
                            if ($(e).is('p') && !$(e).is(':empty')) {
                                start_hiding_content = true;
                            }
                        }else{
                            $(e).hide();
                        }

                    });
                autoload_content_obj.find('.content-box').append('<a class="readMore">Read More +</a>');
                e.hasReadMore = true;
            }
            else
            {
                autoload_content_obj.removeClass('hide-more');
            }


            //AB Testing 1046
            if($('.separator-cta-title .next-title', autoload_content_obj).length > 0){
                if(related_articles.length > e.i + 1){
                    $('.separator-cta-title .next-title', autoload_content_obj).text(related_articles[e.i + 1].pageTitle);
                }else{
                    $('.separator-cta', autoload_content_obj).remove();
                }
            }
            //End AB Testing 1046

            autoload_content_obj.find('script').remove();
           $('#autoload-slot-' + e.i).replaceWith(autoload_content_obj);

            article_listing_obj.removeClass('bottomed');
            article_listing_obj.addClass('initial-load');
            e.content_obj = autoload_content_obj;
            e.loadStatus = loadStatusEnum.LOADED;
            e.pageTitle = autoload_content_obj.find('.layout-title h1', e.content_obj).text().trim();

            // Pull scripts using regex since jQuery 1.10's .filter function is not
            // working reliably in this version. A downside of this method is that it will
            // break with script tags that have hardcoded script tags in them. i.e.
            //
            // <script>document.write('<script></script>');</script>
            //
            // e.scripts = $(data).filter('script');
            var parsedScripts = [];
            data.replace(/<script[\s\S]*?<\/script>/gi, function (match, g1, g2) {
              parsedScripts.push(match);
            });

            e.scripts = $(parsedScripts.join('')).filter('script');

            $(".infinite-scroll-ads-container", e.content_obj).addClass("move-to-sep");

            // We explicitly find the page taxonomy and attach it to the infinite scroll article object
            e.scripts.each(function(ii , ee){
                script_id = $(ee).data('id');
                var script_whitelist = ['script_taxonomy'];
                if($.inArray(script_id, script_whitelist) > -1) {
                  var taxonomyScriptText = $(ee)[0].innerHTML;
                  taxonomyScriptText = taxonomyScriptText.replace('<!--//--><![CDATA[//><!--', '')
                  taxonomyScriptText = taxonomyScriptText.replace('//--><!]]>', '');
                  eval(taxonomyScriptText);

                  var loadedTaxonomy = _pageTaxonomy;
                  e.pageTaxonomy = loadedTaxonomy;
                }
            });
            e = processRoles(['removable', 'flex'], e);

            stickIfSticky(e, "sticky-container");
            if(e.pageTaxonomy != null && e.adsServed == false){
                article_listing_obj.find('.af-right-multi').html('<div id="AdSlot_AF-Right-Multi-'+e.i+'"></div>');
                // add refreshDynamicAds function and article obj to queue for execution when ready
                refreshDynamicAdsQueue[e.i]= [refreshDynamicAds, e];
            }
            e.adsServed = true;

            load_lock = 0;
            $(window).scroll();
            // loadQueuedItem(loadQueue);
            if(loadQueue.length == 0){
                $('#autoload_loading').remove();
            }

            // Trigger a load event and send the scroll item along for the ride.
            $(window).trigger('infiniteScrollItemLoadComplete', e);
        }

        /*
         Handles error loading an article.
         @param e - article that was attempted to be loaded.
         */
        function load_error(e) {
            e.status = loadStatusEnum.FAILED;
            $('#autoload_loading').replaceWith(load_failed_HTML);
        }



    function updateQueryStringParameter(uri, key, value) {
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        }
        else {
            return uri + separator + key + "=" + value;
        }
    }

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    function load_pg_native() {

        var pgNative = new dynamicAd();
        pgNative.domName = "AdSlot_PG-Native";
        pgNative.slotSize = "fluid";
        pgNative.taxSlotName = "PG-Native";
        pgNative.targeting = {Location: "PG-Native"};
        pgNative.renderAd();

        googletag.cmd.push(function () {
            googletag.pubads().addEventListener('impressionViewable', function(event) {
                try {
                    if( event.slot.getSlotElementId().indexOf('AdSlot_PG-Native') > -1 ) {

                        // Add Tracking pixel
                        $('#AdSlot_PG-Native1').append( decodeURIComponent(settings.ad_native.impressionPixel) );

                        // GA Tracking saving it for later
                        //dataLayer.push({
                        //    'event': 'event-infinite-scroll-pgnative',
                        //    'eventCategory': 'DFP-Native',
                        //    'eventAction': 'View Start',
                        //    'eventLabel': settings.ad_native.creativeName
                        //});
                    }
                } catch (e) {}
            });
        });
    }


    // Public function that can be accessed externally
    return {
        injectPGNative: function(data) {
            data.url = '#sponsored';
            data.position = 0;

            // Update options
            settings.ad_native = {
                active: true,
                status: true,
                url: data.url,
                impressionPixel: data.impressionPixel,
                creativeName: data.creativeName
            }

            // Inject Next up
            var sponsored_item = $('<li class="item item-sponsored"></li>');
            sponsored_item.prepend('<h3 class="item-title item-title-sponsored"><a href="' + data.url + '">' + data.title + '</a></h3>');
            sponsored_item.prepend('<span class="sponsored">SPONSORED</span>')
            sponsored_item.insertAfter(article_listing_obj.find('.item').eq(data.position));


            // Add an custom event to the link
            $('.item-title-sponsored a').on('click', function(e){
                e.preventDefault();

                $('html, body').animate({
                    scrollTop: $('.autoload_content_sponsored').offset().top - $('.header').outerHeight() - 50
                }, 500);
            });

            data.position = data.position + 1;

            // Refresh the list
            related_articles = related_articles.slice(0, data.position);
            get_related_articles(data.position);

            // Load next article
            loadQueue = [];
            loadQueue.push(related_articles[data.position]);
            loadQueuedItem(loadQueue);


            // Keep refresh until Second article found
            var tryRemoveArticle = function(){

                if( $('.autoload_content').eq(data.position).attr('data-href') &&
                    $('.autoload_content').eq(data.position).attr('data-href') != data.url ) {

                        $('.autoload_content').eq(data.position).remove();
                        clearInterval(tryRemoveArticleId);
                }
            };
            var tryRemoveArticleId = null;
            tryRemoveArticleId = setInterval(tryRemoveArticle, 100);


            // Keep refresh until PG-Native is available
            var tryLoadPGNative = function(){

                if ($('.autoload_content_sponsored').length) {
                    load_pg_native();
                    clearInterval(tryLoadPGNativeId);
                }
            };
            var tryLoadPGNativeId = null;
            tryLoadPGNativeId = setInterval(tryLoadPGNative, 100);

        }


    };
};



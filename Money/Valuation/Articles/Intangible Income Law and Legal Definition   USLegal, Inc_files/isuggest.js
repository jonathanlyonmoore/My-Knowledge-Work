/**
 * jQuery-Plugin "iSuggest"
 * 
 * @version: 1.2, 01.04.2011
 * 
 * @author: Hemn Chawroka
 *          chavroka@yahoo.com
 *          http://codecanyon.net/user/hemn
 * 
 * @example: $('selector').iSuggest();
 * @example: $('selector').iSuggest({ url: 'http://yoursite.com/results.php', blurClass: 'myBlurredClass', activeClass: 'myActiveClass', searchURL: 'http://www.bing.com/search?setmkt=en-US&q=%s' });
 * 
 */

(function($) {

	// Begin the iSuggest plugin
	$.fn.iSuggest = function(settings) {

		// Settings
		settings = jQuery.extend({
			url: 'php/google_suggestions_results.php', // Suggestions results script.
			suggestsID: 'isuggest', // ID of the suggests container element.
			minLength: '2', // minimum length of search box to show suggestions.
			blurClass: 'fieldBlurred', // Class for when search box has been blured.
			activeClass: 'fieldActive', // Class for when search box has been focused.
			attribute: 'rel', // Search box default text attribute.
			topOffset: 4, // To extra spacing for suggests box from search box.
			onType: null, // Callback function on type time.
			onSelect: null, // Callback function for when a suggest has been selected.
			onChange: null, // Callback function for when a suggest has been changed.
			onSubmit: null, // Callback function for when search box has been submitted.
			onEmpty: null, // Callback function for when search box has been emptied.
			onNoResult: null, //customization khushboo
			targetMode: '', // Search target mode.
			typeDelay: '250', // Type delay.
			searchURL: 'http://google.com/search?q=%s' // Set search query URL. URL with %s in place of query.
		}, settings);

		// loop each element
		return $(this).each(function() {

			// Append search suggests container
			$('body').append("<div id='"+settings.suggestsID+"' class='page search-suggest'></div>");

			// Set variables
			var el = $(this),
			container = $('div#'+settings.suggestsID),
			remover = el.parent('div').find('a'),
			preloader = el.parent('div').find('img'),
			startPos = 0,
			timer = null;
			// Add or get attribute
			if(el.attr(settings.attribute) == undefined) {
				el.attr(settings.attribute, el.val()).addClass(settings.blurClass);
			}

			// Set search box cleaner action
			remover.click(function(){
				el.val('');
				$(this).hide();
				container.hide();
				if($.isFunction(settings.onEmpty)) settings.onEmpty();
			});

			// Set focus action
			el.focus(function() {
				if(el.val() == el.attr(settings.attribute)) {
					el.removeClass(settings.blurClass).addClass(settings.activeClass);
				}

				if(settings.minLength<=el.val().length){
					container.show();
					if ($('#'+settings.suggestsID + '> ul > li').length > 0) {
						container.next('p').show();
					}
				}
			});

			// Set blur action
			el.blur(function() {
				if(el.val() == '') {
					el.val(el.attr(settings.attribute)).removeClass(settings.activeClass).addClass(settings.blurClass);
				}
				setTimeout(function(){ container.hide();container.next('p').hide(); }, '200');
			});

			// Set suggests box Positioner & width adjustment
			function setPos(el){
				var width = el.parents('div.searchbox').outerWidth();
				var height = el.parents('div.searchbox').outerHeight();
				var top = el.parents('div.searchbox').offset().top+settings.topOffset;
				var left = el.parents('div.searchbox').offset().left;
				container.css({'width':(width-30)+'px', 'top':(top+height)+'px', 'left':(left+15)+'px'});

			}

			// Hightlisghts the text into text input from [startPos] up to the end
			function highlightText(d, startPos) {
				if(d.createTextRange) {
					var t = d.createTextRange();
					t.moveStart("character", startPos);
					t.select();
				}
				else if(d.setSelectionRange) {
					d.setSelectionRange(startPos, d.value.length);
				}
			}

			// The resize event handler
			$(window).resize(function(){
				setPos(el);
			});

			// Set p tag's (Press Enter) Positioner & width adjustment customized
			function setPPos(){
				var height = container.outerHeight();
				var top = container.offset().top;
				var left = container.offset().left;
				container.next('p').css({'top':(top+height)+'px', 'left':left+'px'});
			}

			// Set mouseover action
			container.find('ul li a').on('mouseover', function(){
					container.find('ul li a').removeClass('active');
			});



			// Set select callback
			if($.isFunction(settings.onSelect)) container.find('ul li a').on('click', function(){
				el.val($(this).text());
				startPos = $(this).text().length;
				el.trigger('keyup').focus();
				settings.onSelect($(this).text(), this);
				return false;
			});

			// Set keyup action
			el.keyup(function(e){
				var txt = el.val();
				var query = encodeURIComponent(txt);
				var goTo = settings.searchURL.replace('%s', query);
				var index = container.find('ul li a').index($('a.active'));
				var len = container.find('ul li a').length;

				setPos(el);
				clearTimeout(timer);
				container.find('ul li a').removeClass('active');

				if(e.keyCode=='38'){
					if(index<0) {
						var finder = container.find('ul li a:last');						
					} else {
						var finder = container.find('ul li a').eq(index-1);
					}

					finder.addClass('active');
					el.val(finder.text());
					highlightText(e.target, startPos);
					if ($.isFunction(settings.onChange)) settings.onChange(finder.text());
				} else if(e.keyCode=='40'){
					if(index<0 || index==(len-1)) {
						var finder = container.find('ul li a:first');						
					} else {
						var finder = container.find('ul li a').eq(index+1);
					}

					finder.addClass('active');
					el.val(finder.text());
					highlightText(e.target, startPos);
					if ($.isFunction(settings.onChange)) settings.onChange(finder.text());
				} else if(e.keyCode=='13'){
					if($.isFunction(settings.onSubmit)) settings.onSubmit(txt);
					else {
						if(settings.targetMode.toLowerCase()=='_blank') {
							window.open(goTo);
						} else {
							window.location.href = goTo;
						}
					}
				} else {
					if(txt.length==0) {
						remover.hide();
						if($.isFunction(settings.onEmpty)) settings.onEmpty();
					}
					else if(settings.minLength>txt.length) { remover.show(); container.hide(); }
					else {
						remover.show();
						startPos = txt.length;
						if(settings.minLength<=txt.length) timer = setTimeout(function() {
							preloader.show();
							$.get(settings.url, 'q='+query+'&target='+settings.targetMode+'&url='+encodeURIComponent(settings.searchURL), function(res) {
								
								if(res.length>3){
									container.show();
									container.html(res);
									preloader.hide();
									setPPos();
									if ($('#'+settings.suggestsID + '> ul > li').length > 0) {
										container.next('p').show();
									}
								} else {
									preloader.hide();
									container.empty().hide();
									container.next('p').hide();
									//customization khushboo
									if($.isFunction(settings.onNoResult)) settings.onNoResult(query);
								}
							});
						}, settings.typeDelay);

						if($.isFunction(settings.onType)) settings.onType(txt);
					}
				}
			});

		});
		
	};
})(jQuery);
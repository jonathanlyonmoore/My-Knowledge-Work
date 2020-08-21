jQuery(document).ready(function(){

	var topControlIcon = jQuery ('.top-icon-menu, .shadow, .block-cart-header, .top-search, .page, body, .header-button');

	var blockSliderMarker = jQuery('.products-grid, .products-list, .catalog-product-view');
	if(blockSliderMarker.length===0 ) {
			jQuery(".sidebar .block-slider-sidebar").remove();  
	}
	else {
		jQuery(".sidebar .block-slider-sidebar").addClass('block-slider-start');
	}

	jQuery("#main-menu-icon").on("click", function(){
		jQuery(".sf-menu-desktop").slideToggle();
		jQuery(this).toggleClass("active");
		jQuery(this).parents('body').toggleClass('ind');
	});

	jQuery('.sf-menu-desktop').find('li.parent').append('<strong></strong>');
	jQuery('.sf-menu-desktop li.parent strong').on("click", function(){
		if (jQuery(this).attr('class') == 'opened') { jQuery(this).removeClass().parent('li.parent').find('> ul').slideToggle(); } 
			else {
				jQuery(this).addClass('opened').parent('li.parent').find('> ul').slideToggle();
			}
	});

	jQuery('.shadow').on("click", function(){
		jQuery('.sf-menu-desktop').slideUp();
		jQuery('#main-menu-icon').removeClass('active');
		jQuery(this).parents('body').removeClass('ind');
	});

	jQuery("#menu-icon").on("click", function(){
		jQuery(".sf-menu-phone").slideToggle();
		jQuery(this).toggleClass("active");
	});

	jQuery('.sf-menu-phone').find('li.parent').append('<strong></strong>');
	jQuery('.sf-menu-phone li.parent strong').on("click", function(){
		if (jQuery(this).attr('class') == 'opened') { jQuery(this).removeClass().parent('li.parent').find('> ul').slideToggle(); } 
			else {
				jQuery(this).addClass('opened').parent('li.parent').find('> ul').slideToggle();
			}
	});

	jQuery('.swipe-control, .block-cart-header, .top-search').on("click", function(){
		jQuery('.sf-menu-phone').slideUp();
		jQuery('#menu-icon').removeClass('active');
	});
	
	jQuery('.sf-menu-phone2').find('li.parent').append('<strong></strong>');
	jQuery('.sf-menu-phone2 li.parent strong').on("click", function(){
		if (jQuery(this).attr('class') == 'opened') { jQuery(this).removeClass().parent('li.parent').find('> ul').slideToggle(); } 
			else {
				jQuery(this).addClass('opened').parent('li.parent').find('> ul').slideToggle();
			}
	});

		jQuery('.footer .footer-col .f_block > h4').append('<span class="toggle"></span>');
		jQuery('.footer h4').on("click", function(){
			if (jQuery(this).find('span').attr('class') == 'toggle opened') { jQuery(this).find('span').removeClass('opened').parents('.f_block').find('.footer-col-content').slideToggle(); }
			else {
				jQuery(this).find('span').addClass('opened').parents('.f_block').find('.footer-col-content').slideToggle();
			}
		});

		jQuery('.header-button, .switch-show').not('.top-login').on("click", function(e){
			var ul=jQuery(this).find('ul');
			if(ul.is(':hidden'))
			{
				ul.slideDown();
				jQuery(this).addClass('active');
			}
			else
			{
				ul.slideUp();
				jQuery(this).removeClass('active');
				jQuery('.header-button, .switch-show').not(this).removeClass('active');
				jQuery('.header-button, .switch-show').not(this).find('ul').slideUp();
				
			}
			jQuery('.header-button ul li, .switch-show ul li').click(function(e){
				e.stopPropagation(); 
			});
			return false;
		});
		jQuery(document).on('click',function(){ 
				jQuery('.header-button, .switch-show').removeClass('active').find('ul').slideUp();
		});
		jQuery('.block-cart-header, .top-search').on('click',function(){ 
				jQuery('.header-button').removeClass('active').find('ul').slideUp();
		});

		function swipe_animate_true(){
			jQuery('.swipe-control').addClass('active');
			jQuery('.swipe').stop(true).animate({'left':'0'},300);
		}
		function swipe_animate_false(){
			jQuery('.swipe-control').removeClass('active');
			jQuery('.swipe').stop(true).animate({'left':'-237px'},400);
		}
			jQuery('.swipe-control').click(function(){
				swipe_animate_true();
				mini_form_hide();
				if(jQuery(this).parents('body').hasClass('ind')){
					jQuery(this).parents('body').removeClass('ind');
					swipe_animate_false()
					return false
				}
				else{
					jQuery(this).parents('body').addClass('ind');
					swipe_animate_true()
					return false
				}
			})

			jQuery(topControlIcon).not('.page').click(function(){
				swipe_animate_false();
				if(jQuery(this).parents('body').hasClass('ind')){
					jQuery(this).parents('body').removeClass('ind');
					swipe_animate_false();
					return false
				}
		});

			jQuery('.swipe').height(jQuery(window).height());

			jQuery(window).resize(function() {
					jQuery('.swipe').height(jQuery(window).height());
			});

			var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent),
			$flag
				if(isMobile) {
				jQuery('body').removeClass('ps-static');
				jQuery('body').addClass('ps-phone');
				jQuery('.page').click(function(){
						jQuery('body').removeClass('ind');
						swipe_animate_false();
				});

		};
		var isiPhone = (navigator.userAgent.match(/iPhone/i) != null);

		function mini_form_hide(){
			if(!$flag){	return false}		
				jQuery('#search_mini_form').animate({height: 'hide', opacity:0}, 300);		
				jQuery('.top-search').removeClass('active');
			
		}
		function mini_form_show(){
			jQuery('#search_mini_form').animate({height: 'show', opacity:1}, 300);
			jQuery('.top-search').addClass('active');
			jQuery('.form-search .input-text').trigger('focus');
			if (isiPhone) {
				jQuery('#search_mini_form').css({'top':'50px'});
			}
		};
		
		jQuery('.top-search').on("click", function(){
			if ( jQuery('#search_mini_form').css('display') == 'none' ) {
				mini_form_show()
			} else {
				mini_form_hide()
			}
		});

!function($){
 var top_search=$('.top-search')
 $(window).bind('load resize',function(){
	var bodyWidth=$('.container').width()
	if(bodyWidth>=767){    
		if($flag===true)
			$('#search_mini_form').show().css({opacity:1})
		$flag = false;
	}else{    
		if($flag===false&&!top_search.hasClass('active'))
			$('#search_mini_form').hide().css({opacity:0})
		$flag = true;
	}
	})
}(jQuery);
});


(function(doc) {

	var addEvent = 'addEventListener',
			type = 'gesturestart',
			qsa = 'querySelectorAll',
			scales = [1, 1],
			meta = qsa in doc ? doc[qsa]('meta[name=viewport]') : [];

	function fix() {
		meta.content = 'width=device-width,minimum-scale=' + scales[0] + ',maximum-scale=' + scales[1];
		doc.removeEventListener(type, fix, true);
	}

	if ((meta = meta[meta.length - 1]) && addEvent in doc) {
		fix();
		scales = [.25, 1.6];
		doc[addEvent](type, fix, true);
	}

}(document));

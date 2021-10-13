var _CKE_Toolbar_Admin = [
	{ name: 'document', groups: [ 'mode', 'document', 'doctools' ], items: [ 'Source', '-', 'NewPage', 'Preview', '-', 'Templates'] },
	{ name: 'clipboard', groups: [ 'clipboard', 'undo' ], items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
	{ name: 'editing', groups: [ 'selection', 'spellchecker' ], items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] },
	{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ] },
	{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl' ] },
	{ name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
	{ name: 'insert', items: [ 'Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'Iframe' ] },
	{ name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
	{ name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] }
];

var _CKE_Toolbar_User = [
	{ name: 'basicstyles', items : [ 'Bold','Italic','Underline','NumberedList','BulletedList','Image','Flash','RemoveFormat','Link','Unlink','Source'] },
	{ name: 'tools', items : [ 'Styles','Format','Font','FontSize'] }
];

var _CKE_Toolbar_QA = [
	{ name: 'basicstyles', items : [ 'Bold','Italic','Underline','NumberedList','BulletedList','RemoveFormat','Link','Unlink','Image'] }
];

!function ($) {

  $(function(){
	
	/* Code for show tooltip */
	$('.apply-tooltip').tooltip({
        selector: "a[rel=tooltip]"
    });
	
	/* code end */
	
	$('.admin').on('click', function () {
        var ckcss = $.cookie('template')
        var cke = (ckcss == 'collapse in') ? 'collapse' : 'collapse in'
        $.cookie('template', cke, { expires: 365, path: '/' })
    })
	
    $("#admin_search").keypress(function(e)  {
      var term = $("#admin_search").val();
      term = $.trim(term);
      if (e.which == 13 && term != "") {
          $("#search").val(term);
          pagination();
      }
    });
    var scroll_pos
    //$('input, textarea').placeholder();
    $('.modal').on('shown', function () {
        $('input, textarea').blur();
        scroll_pos = $(window).scrollTop();
        $("html, body").animate({ scrollTop: 0 }, "slow");
        disable_scroll();
    })
    $('.modal').on('hidden', function () {
        $(window).scrollTop(scroll_pos);
        enable_scroll();
        $(this).hide();
        $(this).children('form').find('input[type=text], textarea, select').val('');
        $(this).children('form').find('.error').html('');
    })

      $('.modal').on('shown', function () {
          $('.error').html('');
      })

      /*input type file initialization*/
    if ($('.addphoto input[type=file]').length) {
        browse();
    }

    	   /*Initialize fancy box*/
		if ($("a.fancybox-img").length)
		{
		  $("a.fancybox-img").fancybox({
			  padding: 0,
			  openEffect : 'elastic',
			  openSpeed  : 500,
			  closeEffect : 'elastic',
			  closeSpeed  : 500,
			  closeClick : true,
                          helpers:{
                                    title:{
                                       type:'outside',
                                       position:'top'
                                    }
                          }
		  });
		}
		
		
		/*Initialize photo mouse events
		if ($(".p_list_item > .p_list_label_handler").length)
		{
			$(".p_list_item").mouseover(function(){
				$('.p_list_label_handler', this).css({
					width : this.offsetWidth + 'px',
					display : 'block',
					marginTop : this.offsetHeight - $('.p_list_label_handler', this).height() + 'px'
				});
				
			}).mouseout(function(){
				$('.p_list_label_handler', this).css({
					display : 'none'
				});
			});
		}*/
		
		/**$(window).resize(function(){
			if($('#photosViewBasePanel > .row-fluid').width() / 250 >= 3){
				$('#threewideview').css({
					display : ''
				});
				$('#twowideview').css({
					display : 'none'
				});
				
				$('#onewideview').css({
					display : 'none'
				});
				
			}else if($('#photosViewBasePanel > .row-fluid').width() / 250 >= 2){
				$('#threewideview').css({
					display : 'none'
				});
				
				$('#twowideview').css({
					display : ''
				});
				
				$('#onewideview').css({
					display : 'none'
				});
			}else{
				$('#threewideview').css({
					display : 'none'
				});
				
				$('#twowideview').css({
					display : 'none'
				});
				
				$('#onewideview').css({
					display : ''
				});
			}
		}).ready(function(){
			if($('#photosViewBasePanel > .row-fluid').width() / 250 >= 3){
				$('#threewideview').css({
					display : ''
				});
				$('#twowideview').css({
					display : 'none'
				});
				
				$('#onewideview').css({
					display : 'none'
				});
				
			}else if($('#photosViewBasePanel > .row-fluid').width() / 250 >= 2){
				$('#threewideview').css({
					display : 'none'
				});
				
				$('#twowideview').css({
					display : ''
				});
				
				$('#onewideview').css({
					display : 'none'
				});
			}else{
				$('#threewideview').css({
					display : 'none'
				});
				
				$('#twowideview').css({
					display : 'none'
				});
				
				$('#onewideview').css({
					display : ''
				});
			}
		});*/
		
	});
	
	/**redirection controller*/
	if(document.getElementById('redirect_to') != null){
		var _rdhost = window.location.hostname;
		var _rdreferer = document.referrer;
		var _rdcurl = window.location.href;
		var _rdhcompare = _rdreferer.split(_rdhost);
		
		if(_rdcurl.split("/users/")[1] == null){
			$('#redirect_to').val(_rdcurl);
		}else{
			if(_rdhcompare[1] != null){
				$('#redirect_to').val(document.referrer);
			}
		}
	}
	
	/*if($('#name')){
		$('#name').typeahead({
			source: function (query, process) {
				return $.get($('#name').attr('loc'), { query: query }, function (data) {
					eval("var data = "+ data + ";");
					if(data != null && data.options){
						return process(data.options);
					}
				});
			}
		});
	}*/

}(window.jQuery)

$.cookie("base_url", site_url);

$(document).ready(function(){
	if(document.getElementById('qahelppop') != null){
		$('#breadcrumbs div ul').append('<li class="pull-right"><a href="javascript:void(0);" onclick="$(\'#qahelppop\').modal(\'show\')">Need Help?</a></li>');
	
	
		$('#qahelppop').on('hidden', function () {
		  $('.modal-backdrop').remove();
		});
	
	}
});

function disable_scroll()
{
    $("body").css("overflow","hidden");
}

function enable_scroll()
{
    $("body").css("overflow","auto");
}

function browse(){
    $('.addphoto input[type=file]').css({'opacity':'0'});
    $('.addphoto input[type=file]').change(function(){
        var img = $(this).val();
        var value = img.substring(img.lastIndexOf("\\") + 1);
        $(this).prev().prev().val(value);
    });
};

/* Select/ De-select all checkboxes admin index pages*/
function select_all_items()
{
    $(".checkboxes").each(function() {
        $(this).attr("checked", $("#select_all").is(":checked"));
    });
}

/* check if any checkboxe is selected admin index pages*/
function check_for_selected_items()
{
    var flag = false;
    $(".checkboxes").each(function() {
        if ($(this).is(":checked"))
        {
            flag = true;
        }
    });
    return flag;
}

/*admin index Maintenance unpublish*/
function unpublish_items()
{
    var check = check_for_selected_items();
    if (check == false)
    {
        alert('Please select an item first.');
        return false;
    }
    var confirmation = confirm("Are you sure you want to un-publish selected items?");
    if (confirmation)
    {
        $("#action").val('unpublish');
        load_ajax_view();
    }
}

/*admin index Maintenance publish*/
function publish_items()
{
    var check = check_for_selected_items();
    if (check == false)
    {
        alert('Please select an item first.');
        return false;
    }
    var confirmation = confirm("Are you sure you want to publish selected items?");
    if (confirmation)
    {
        $("#action").val('publish');
        load_ajax_view();
    }
}

/* admin index lock items */
/*function lock_items()
{
	var check = check_for_selected_items();
    if (check == false)
    {
        alert('Please select an item first.');
        return false;
    }
    var confirmation = confirm("Are you sure you want to lock selected items?");
    if (confirmation)
    {
        $("#action").val('lock');
        load_ajax_view();
    }
}*/

/* admin index unlock items */
/*function unlock_items()
{
	var check = check_for_selected_items();
    if (check == false)
    {
        alert('Please select an item first.');
        return false;
    }
    var confirmation = confirm("Are you sure you want to Unlock selected items?");
    if (confirmation)
    {
        $("#action").val('unlock');
        load_ajax_view();
    }
}*/



/*admin index Maintenance delete*/
function delete_items()
{
    var check = check_for_selected_items();
    if (check == false)
    {
        alert('Please select an item first.');
        return false;
    }
    var confirmation = confirm("Are you sure you want to delete selected items?");
    if (confirmation)
    {
        $("#action").val('delete');
        load_ajax_view();
    }
}

/*admin index Maintenance add*/
function add_items(uri)
{
	var form_url = window.location.href;
                     form_url = cutUrl(form_url);
	if(uri ==""){
		form_url = form_url+'create/';
	}else{
		form_url = uri;
	}
    
    //window.location.href = "/"+form_url;
    $.ajax({
        url:  form_url,
        data: '',
        type: "POST",
        success: function(response){
            $("#quick-add-response").html(response);
			if ($( 'input.tag' ).length) {				
					$('input.tag').tagedit({
						autocompleteURL: site_url+'qa/questions/tag_autocomplete',
						allowEdit: false,
						allowDelete: false,
						additionalListClass : 'inputmain',
						// return, comma, space, period, semicolon
						breakKeyCodes: [ 13, 44, /* 32,*/ 46, 59 ]
					});
			}
            $('#quickAddModal').modal('show');
        }
    });
    return false;
}


/*admin index Maintenance add*/
function add_editor_items()
{
	
   var form_url = window.location.href;
    form_url = cutUrl(form_url);
    form_url = form_url+'editor/';
    //window.location.href = "/"+form_url;
    $.ajax({
        url:  form_url,
        data: '',
        type: "POST",
        success: function(response){
			$('#quickEditModalEditor').modal('show');
            $("#quick-editor-response").html(response);
           
        }
    });
    return false;
}



/*admin index Maintenance edit*/
function edit_items()
{
    
	var check = check_for_selected_items();
    if (check == false)
    {
        alert('Please select an item first.');
        return false;
    }
    $(".myCheckboxes").each(function() {
        if ($(this).is(":checked"))
        {
            var url = window.location.href;
            url = cutUrl(url);
            url = url+'edit/'+$(this).val();
            $.ajax({
                url:  url,
                data: '',
                type: "POST",
                success: function(response){
                    $("#edit-response").html(response);
					if ($( 'input.tag' ).length) {				
						$('input.tag').tagedit({
							autocompleteURL: site_url+'qa/questions/tag_autocomplete',
							allowEdit: false,
							allowDelete: false,
							additionalListClass : 'inputmain',
							// return, comma, space, period, semicolon
							breakKeyCodes: [ 13, 44, /* 32,*/ 46, 59 ]
						});
					}
                    $('#edit-term-form').attr('action',url);
                    $('#quickEditModal').modal('show');
                }
            });
        }
    });
}

/*admin index term name edit*/
function edit_items_from_link(id, uri)
{
    var url = window.location.href;
    url = cutUrl(url);
    var url = (uri) ? uri : url+'edit/'+id;
    $.ajax({
        url:  url,
        data: '',
        type: "POST",
        success: function(response){
            $("#edit-response").html(response);
            $('#edit-term-form').attr('action', url);
			if ($( 'input.tag' ).length) {				
				$('input.tag').tagedit({
					autocompleteURL: site_url+'qa/questions/tag_autocomplete',
					allowEdit: false,
					allowDelete: false,
					additionalListClass : 'inputmain',
					// return, comma, space, period, semicolon
					breakKeyCodes: [ 13, 44, /* 32,*/ 46, 59 ]
				});
			}
            $('#quickEditModal').modal('show');
        }
    });
}

function get_settings_form(url)
{
    $.ajax({
        url:  url+"/get_settings",
        data: '',
        type: "POST",
        success: function(response){
            $("#setting-response").html(response);
            $('#settingsModal').modal('show');
        }
    });
    //return false;
}

/*admin index Maintenance edit*/
function items_action(module, action, row_id)
{
    if (row_id != "" && action != "" && module != "")
    {
        $.ajax({
            url:  "/admin/"+module+"/"+module+"/maintenance",
            data: 'action='+action+'&select_items='+row_id+'&no-return=response',
            type: "POST",
            success: function(response){
                pagination();
            }
        });
    }
}

function data_ordering(field, order)
{
    if (field != "") {
        $("#sort").val(field);
    }
    if (order != "") {
        $("#order").val(order);
    }
    pagination();
}

function filter_selection(ths)
{   
	var id = $(ths).attr('rel');
    $("#" + id).val($(ths).val());
    $("#page").val(1);
    var form_url = $("#pagination-form").attr('action');
    form_url = form_url.substring(0, form_url.lastIndexOf("/"));	
    $("#pagination-form").attr('action', form_url);
    pagination();
}

function sale_filter_selection(ths)
{   
	var id = $(ths).attr('rel');
    $("#" + id).val($(ths).val());
    $("#page").val(1);
    var form_url = $("#pagination-form").attr('action');
	//alert(form_url);
    //form_url = form_url.substring(0, form_url.lastIndexOf("/"));	
	//alert(form_url); return false;
    $("#pagination-form").attr('action', form_url);
	$("#ajax_pagination").val('0');
    pagination();
}

/*function filter_selection_sale(ths)
{
	var id = $(ths).attr('rel');
    $("#" + id).val($(ths).val());
    $("#page").val(1);
    var form_url = $("#pagination-form").attr('action');
    form_url = form_url.substring(0, form_url.lastIndexOf("/"));
	form_url = form_url.substring(0, form_url.lastIndexOf("/"));
	
	var page_filter = $("#page_filter").val();
	if(page_filter == 'current'){
		form_url = form_url+'/index';
	}else if(page_filter == 'archived'){
		form_url = form_url+'/archives';
	}
    $("#pagination-form").attr('action', form_url);
    pagination();
}*/

function filter_selection_sale(id,val)
{
	var current_page = $("#current_page").val();
	var per_page = $("#per_page").val();
	
	$("#category_filter").val('');
	$("#saletype_filter").val('');
	$("#state_filter").val('');
	$("#city_filter").val('');
	
	$("#" + id).val(val);
	$("#current_page").val(current_page);
	$("#per_page").val(per_page);

    $("#page").val(1);
    var form_url = $("#pagination-form").attr('action');
    form_url = form_url.substring(0, form_url.lastIndexOf("/"));
	form_url = form_url.substring(0, form_url.lastIndexOf("/"));
	
	var page_filter = $("#page_filter").val();	
	if(page_filter == 'current'){
		form_url = form_url+'/index';
	}else if(page_filter == 'archived'){
		form_url = form_url+'/archives';
	}
    $("#pagination-form").attr('action', form_url);
    pagination();
}


function per_page_selection(ths)
{
    $("#per_page").val($(ths).val());
    pagination();
}

function reset_search()
{
    $("#search").val("");
    $("#admin_search").val("");
    pagination();
}

function pagination()
{
    setTimeout(" $('#pagination-form').submit();", 400);
}

function export_data()
{
    var module = "definitions";
    window.location.href = "/admin/"+module+"/"+module+"/export";
}

/*admin index read csv file data*/
function csv_file_data(row_id)
{
    var page_url = window.location.href;
    page_url = cutUrl(page_url);
    $.ajax({
        url:  page_url+"import_view_file_data",
        data: 'select_items='+row_id,
        type: "POST",
        success: function(response){
            $("#ajax-response-file").html(response);
        }
    });

}

function import_file_content()
{
    $("#import_error").html('');
    var key;
    $(".myCheckboxes").each(function() {
        key = $(this).val();
        if ($(this).is(':checked'))
        {
            if ($("#title_"+key).val() == "")
            {
                $(this).addClass('error');
                $("#import_error").html('Title field cannot be blank.');
                return false;
            }
        }
    });

    var page_url = window.location.href;
    page_url = cutUrl(page_url);
    var file_id = $("#file-id").val();
    var publish = 0;
    if ($("#auto-publish").is(':checked'))
    {
        publish = 1;
    }
    setTimeout(" $('#import_data').submit();", 400);
    $('#import_data').ajaxForm({
        dataType: 'json',
        complete: function(xhr) {
            if (xhr.responseText == "success") {
                window.location.href = window.location.href;
            }
        }
    });
}

function delete_file(id)
{
    var msg = confirm("Are you sure, you want to delete this file?");
    if (msg){
        var page_url = window.location.href;
        page_url = cutUrl(page_url);
        $.ajax({
            url:  page_url+"import_delete_file",
            data: 'file_id='+id,
            type: "POST",
            success: function(response){
                window.location.href = window.location.href;
            }
        });
    }
    return false;
}

function expand_all()
{    
    $("#expand").hide();
    $("#collapse").show();
	$(".short-text").hide();
	$(".full-text").show();
}

function collapse_all()
{   
    $("#collapse").hide();
    $("#expand").show();
	$(".short-text").show();
	$(".full-text").hide();
}

function reset_form(form_id, isEditor, search_term)
{
	$(form_id).get(0).reset();
    $('.error').text('');
    if (isEditor) {$(".nicEdit-main").html('');}
	/* Code for disply prefill term in popup box */
	if(search_term != ""){
		$("#request_definition .control-group #title").val(search_term);	
	}
}
/*
function get_settings_form(url)
{
    $.ajax({
        url:  url+"/get_settings",
        data: '',
        type: "POST",
        success: function(response){
            $("#setting-response").html(response);
        }
    });
    return false;
}
*/
function reset_all()
{
    //default
	$("#sort").val("");
    $("#order").val("");
	$("#search").val("");
    $("#current_page").val("");
    $("#per_page").val("");
	$("#admin_search").val("");
	//definition
    $("#author_filter").val("");
	$("#status_filter").val("");	
	$("#category_filter").val("");
	$("#type_filter").val("");
	$("#mode").val("1");
	//listings
	$("#saletype_filter").val("");
	//qa
	$("#filter").val("");
	//searchlog
	$("#module_filter").val("");
	$("#result_filter").val("");
	$("#search_filter").val("");	
    pagination();
}

function view_mode(mode, ths)
{
    $('.admin-mode-btn').removeClass('active');
    $("#messages-quick-add").hide();
    $("#add-msg").text('');
    switch(mode)
    {
        case 1:
            $('.quick-add-form').hide();
            load_ajax_view_mode();
            break;
        case 2:
            $("#add-term-form").get(0).reset();
            var instance = CKEDITOR.instances['content_area_1'];
            if (instance)
            {
                instance.destroy(true);
                $("#add_expand").show();
                $("#add_collapse").hide();
            }
            $('#content_area_1').attr('class', 'form-control quick-add-form-large-input');
            $('.error').text('');
            $('.quick-add-form').show();
            break;
        case 3:
		
            $('.quick-add-form').hide();
            load_ajax_edit_mode();
            break;
        default:
            "";
            break;
    }
}

function load_ajax_view()
{
    setTimeout(" $('#admin-index-form').submit();", 400);
    $('#admin-index-form').ajaxForm({
        dataType: 'json',
        complete: function(xhr) {
            $('#select_all').attr('checked', false);
            select_all_items();
            $("#ajax-response").html(xhr.responseText);
        }
    });
}

function load_ajax_edit_mode()
{
    setTimeout(" $('#edit-mode-form').submit();", 400);
    $('#edit-mode-form').ajaxForm({
        dataType: 'json',
        complete: function(xhr) {
            $("#ajax-response").html(xhr.responseText);
        }
    });
	
	//$('#content_area_1').attr('class', 'span5 quick-add-form-large-input');
}

function load_ajax_view_mode()
{
    setTimeout(" $('#view-mode-form').submit();", 400);
    $('#view-mode-form').ajaxForm({
        dataType: 'json',
        complete: function(xhr) {
            $("#ajax-response").html(xhr.responseText);
        }
    });
}

//get url
function cutUrl(str) {
    var matched = str.match(/([^/]*\/){6}/);
    var url = matched ? matched[0] : str/* or null if you wish */;
    if (!url.match(/\/$/)) {
        url += '/';
    }
    return url;
}

var area2, get_area;
// toggle between textarea and editor
function add_editor() {
	
    $("#expand").hide();
    $("#collapse").show();
    $('.add-editor').each(function(){
        $(this).attr('style', 'height:40px');
        area2 = $(this).attr('id');
		
		CKEDITOR.replace( area2,{
		toolbar :
		[
			{ name: 'basicstyles', items : [ 'Bold','Italic','Underline','NumberedList','BulletedList','Image','RemoveFormat','Link','Unlink','Source'] },
			{ name: 'tools', items : [ 'Styles','Format','Font','FontSize','Maximize' ] }
		],
		width: 400,
		filebrowserImageUploadUrl: '/admin/definitions/definitions/uploadck'
	});
		
		
	});
}

function remove_editor() {
    $("#collapse").hide();
    $("#expand").show();
    $('.add-editor').each(function(){
        $(this).attr('style', 'height:20px');
        area2 = $(this).attr('id');
		var editor_data = CKEDITOR.instances[area2].getData();
		$("#".area2).val(editor_data);
		CKEDITOR.instances[area2].destroy()
    })
}

// js for google place api
var curLocation,currentLocation,playLocation,birthLocation,eventLocation,teamLocation,leagueLocation;
var component_form = {
	'street_number': 'short_name',
	'route': 'long_name',
	'locality': 'long_name',
	'administrative_area_level_1': 'long_name',
	'country': 'long_name',
	'postal_code': 'short_name'
};

 // function for user current location in profile section
function currentLocationInitialize(txtId)
{	
//	currentLocation = new google.maps.places.Autocomplete(document.getElementById(txtId));
//	google.maps.event.addListener(currentLocation, 'place_changed', function() {
//		currentLocationFillInPrepare(txtId);
//	});
}
	
function currentLocationFillInPrepare(txtId)
{
	var place = currentLocation.getPlace();
	locationFillInAddress(txtId,place);
}

function locationFillInAddress(txtId,place)
{	
	//console.log(place);
	var address=new Object();
	
	address.formatted_address = place.formatted_address;	
	address.lat = place.geometry.location.lat();
	address.lng = place.geometry.location.lng();
	
	address.postal_code ="";
	address.country = "";
	address.state = "";
	address.city = "";
	
	for (var j = 0; j < place.address_components.length; j++) {
		var att = place.address_components[j].types[0];
		var val = place.address_components[j].long_name;
		// zip_code
		if(att=='postal_code'){
			address.postal_code=val;
		}
		// country
		if(att=='country'){
			address.country=val;
		}
		// state
		if(att=='administrative_area_level_1'){
			address.state=val;
		}
		// city
		if(att=='locality'){
			address.city = val;
		}
	}
	
	$("."+txtId+" .lat").val(address.lat);
	$("."+txtId+" .lng").val(address.lng);
        
                      $("#event_zip").val(address.postal_code);
	$("#event_country").val(address.country);
                      $("#event_state").val(address.state);
	$("#event_city").val(address.city);
	
	/*address.postal_code= '';
	if(address.postal_code!=""){
		$("#address_div").removeClass('hide');
		$("#address_div").addClass('show');
		$("."+txtId+" .postal_code").val(address.postal_code).attr('readonly',true);
	}else{
		$("."+txtId+" .postal_code").val('').removeAttr('readonly');
	}
	
	if(address.country!=""){
		$("#address_div").removeClass('hide');
		$("#address_div").addClass('show');
		$("."+txtId+" .country").val(address.country).attr('readonly',true);
	}else{
		$("."+txtId+" .country").val('').removeAttr('readonly');
	}
	
	if(address.state!=""){
		$("#address_div").removeClass('hide');
		$("#address_div").addClass('show');
		$("."+txtId+" .state").val(address.state).attr('readonly',true);
	}else{
		$("."+txtId+" .state").val('').removeAttr('readonly');
	}
	
	if(address.city!=""){
		$("#address_div").removeClass('hide');
		$("#address_div").addClass('show');
		$("."+txtId+" .city").val(address.city).attr('readonly',true);
	}else{
		$("."+txtId+" .city").val('').removeAttr('readonly');
	}*/
}


/**
*	Code for show google map using lat. and long.
*/
var geocoder; 
var map; 
var markersArray = [];

function initialize()
{ 	
	geocoder = new google.maps.Geocoder(); 
	//var latlng = new google.maps.LatLng(34.053464, -118.404112);
	var latlng = new google.maps.LatLng(32.3223, -90.1087);
	var mapOptions = { 
		zoom: 8, 
		center: latlng, 
		mapTypeId: google.maps.MapTypeId.ROADMAP
		/*types: ['(cities)'],
		componentRestrictions: {country: "us"}*/
		
	} 
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	
	
} 

function codeAddress() {
	deleteOverlays();	
	var address = document.getElementById('address').value;
	var markersArray = new Array();
	
	if (typeof(geocoder) != "undefined") {
		
		geocoder.geocode( { 'address': address}, function(results, status)
		{ 
			if (status == google.maps.GeocoderStatus.OK) { 
				map.setCenter(results[0].geometry.location); 
				var marker = new google.maps.Marker({ 
					map: map, 
					position: results[0].geometry.location 
				}); 
				markersArray.push(marker);
			} else { 
				//alert('Geocode was not successful for the following reason: ' + status);
				//document.write('Geocode was not successful for the following reason: ' + status);
			} 
		}); 
	}
} 

function deleteOverlays() {
  if (markersArray) {
    for (i in markersArray) {
      markersArray[i].setMap(null);
    }
    markersArray.length = 0;
  }
}

function setMarkers()
{
	setTimeout(function(){
			var lat = $('.lat').val(); 
			var lng = $('.lng').val(); 
			console.log(lat + '  ' + lng);
			var myLatLng = new google.maps.LatLng(lat, lng);
			console.log(myLatLng);
			var marker = new google.maps.Marker({
				position: myLatLng,
				map: map
			});
	}, 500);
	
}

function toggleMap(ths) { 
    if ($(ths).is(':checked')) {
        $("#divMap").hide();
    } else {
         $("#divMap").show();
         getCoordinates();
    }
}


function _artist_list_event_pu(h, loc, items){
	 $.ajax({
        url:  loc,
        data: items,
        type: "POST",
        success: function(response){
           if(response > 0){
				var ga = h.getAttribute('eventa').split("&act=");
				if(h.className == 'publish-small'){
					h.className = 'unpublish-small';
					h.setAttribute('eventa', ga[0] + '&act=' + '1');
				}else if(h.className == 'unpublish-small'){
					h.className = 'publish-small';
					h.setAttribute('eventa', ga[0] + '&act=' + '0');
				}
		   }
        }
    });
}

function _photo_like_processor(_trigger, _reshandler){
	 $.ajax({
        url:  _trigger.getAttribute('_dist'),
        data: '_pid=' + _trigger.getAttribute('_pid') + '&_lutype=' + _trigger.getAttribute('_lutype'),
        type: "POST",
        success: function(response){
           if(response == 1){
				var _addee_rcounter = parseInt(document.getElementById(_reshandler).getAttribute('rcounter'));
				document.getElementById(_reshandler).innerHTML = _addee_rcounter + 1;
				document.getElementById(_reshandler).setAttribute('rcounter', _addee_rcounter + 1);
				_trigger.setAttribute('_lutype', 'unlike');
				_trigger.innerHTML = 'Unlike';
				
		   }else if(response == 2){
				var _addee_rcounter = parseInt(document.getElementById(_reshandler).getAttribute('rcounter'));
				document.getElementById(_reshandler).innerHTML = _addee_rcounter - 1;
				document.getElementById(_reshandler).setAttribute('rcounter', _addee_rcounter - 1);
				_trigger.setAttribute('_lutype', 'like');
				_trigger.innerHTML = 'Like';
		   }
        }
    });
}

function artists_global_pu(act){
	if(check_for_selected_items()){
		var cf = confirm("Are you sure you want to " + act + " the selected artist(s)?");
		if(cf){
			$("#mEventTracker").val(act);
			if($("#mEventTracker").val() != ""){
				$("#admin-index-form").submit();
			}
		}
	}else{
		alert("Please at least 1 Artist!");
	}
}

function photos_global_pu(act, custommsg){
	if(check_for_selected_items()){
		
		if(custommsg != null){
			var cf = confirm(custommsg);
		}else{
			var cf = confirm("Are you sure you want to " + act + " the selected photo(s)?");
		}
		
		
		if(cf){
			$("#mEventTracker").val(act);
			if($("#mEventTracker").val() != ""){
				$("#admin-index-form").submit();
			}
		}
	}else{
		alert("Please at least 1 row!");
	}
}

function albums_global_pu(act){
	if(check_for_selected_items()){
		var cf = confirm("Are you sure you want to " + act + " the selected album(s)?");
		if(cf){
			$("#mEventTracker").val(act);
			if($("#mEventTracker").val() != ""){
				$("#admin-index-form").submit();
			}
		}
	}else{
		alert("Please at least 1 row");
	}
}

function _pop_view_photo(_trigger)
{
	 $.ajax({
        url:  _trigger.href + '?json=1',
        type: "GET",
        success: function(response){
           var _shadow_ = '<div class="-ppshdow-" id="-ppshdow-"></div>';
		   $("body").append(_shadow_);
		   $("#-ppshdow-").css({
				height: document.documentElement.clientHeight + 'px'
		   });
		   
		    var _wrapper_ = '<div class="-pvwrp-" id="-pvwrp-"></div>';
			$("body").append(_wrapper_);
			
			$("body").css({
				overflow: 'hidden'
			});
			
			$("#-pvwrp-").css({
				height: document.documentElement.clientHeight + 'px'
		   }); 
		   
		    var ppclose = '<div class="-ppclose-" id="-ppclose-"><a onclick="return _pop_view_photo_close();">Close</a></div>';
		    var _container_ = '<div class="-pcont-" id="-pcont-"></div>';
		   $("#-pvwrp-").append(ppclose + _container_);
		   
		   $("#-pcont-").html(response);
		   
		   
        }
    });
	
	return false;
}

function _pop_view_photo_close()
{
	$("#-ppshdow-").remove();
	$("#-pvwrp-").remove();
	$("body").css({
		overflow: ''
	});
}

function _report_content(id, type, target, evt)
{
	$.ajax({
        url:  target,
        type: "POST",
		data: 'id=' + id + '&type=' + type,
        success: function(rs){
			if(rs > 0){
				evt.innerHTML = $(evt).attr('on-flag-value');
			}else{
				evt.innerHTML = $(evt).attr('on-unflag-value');
			}
		}
	});
}


/**
* 
*/
function _similarPhotoAction(fl){
			if(fl.value != ""){
				$.getJSON($(fl).attr('data-url') + '?query=' + fl.value, function(data){
					if(data != null && data.length > 0){
						$('#suggestions-container').html('<ul id="autocomplete-handler" class="A_similarPhotosList"></ul>');
						for(var i in data){
							if(document.getElementById('ss_as_'+ data[i].id) == null){
								$('#autocomplete-handler').append('<li id="ss_rs_'+ data[i].id +'" itn="'+ data[i].id +'"><div class="AS_SmallThumbN"><img src="'+ $(fl).attr('base-url') + 'uploads/photos/' + data[i].src +'"/></div><div class="AS_PName"><a href="'+ $(fl).attr('base-url') + data[i].url +'" target="_blank">'+ data[i].name +'</a></div><a href="javascript:void(0);" class="AS_PRemove" onclick="return _aus_onA_evt(\''+ data[i].id +'\', this);">add</a></li>');
							}
						}
						
						$('#suggestions-container').css({
							display : 'block'
						});
						
					}else{
						$('#suggestions-container').html("");
						$('#suggestions-container').css({
							display : 'none'
						});
					}
				});
			}else{
				$('#suggestions-container').html("");
				$('#suggestions-container').css({
					display : 'none'
				});
			}
}

function _aus_onA_evt(id, tt)
{
	if(document.getElementById('ss_rs_'+id) != null && $(tt).html() == 'add'){
		$(tt).html('x');
		var _ccfrm = $("#ss_rs_" + id).html();
		_ccfrm += '<input type="hidden" name="ssphotos[]" value="'+ id +'"/>';
		$('#A_S_ADDED_H').append('<li id="ss_as_'+ id +'">'+ _ccfrm +'</li>');
		$("#ss_rs_" + id).remove();
	}else if(document.getElementById('ss_as_'+id) != null && $(tt).html() == 'x'){
		$("#ss_as_" + id).remove();
	}
}

if(__STAR_PATH__ != null){
	$('.indivphotorating').jRating({
		type:'big',
		length : 10,
		decimalLength : 1,
		smallStarsPath: __STAR_PATH__,
		bigStarsPath: __STAR_PATH__,
		phpPath: __RATE_SAVER__,
		isDisabled : (__RATE_FALSE__ != null) ? __RATE_FALSE__ : false,
	});
}


	function show_m_q_modal(pid, bid)
	{
		$('#quickAddDescription #m-q-photo-id').val(pid);
		$('#quickAddDescription #m-q-base-id').val(bid);
		$('#quickAddDescription #m-q-description').val("");
		$('#quickAddDescription').modal('show');
	}
	
	function m_q_add_desc(uri)
	{	
		
		$('#quickAddDescription').find("button").attr('disabled', 'disabled');
		
		$.ajax({
			type : 'POST',
			url : uri,
			data : $('#m_q_add_desc').serialize(),
			success : function(rs){
				eval("var toObject = "+ rs + ";");
				if(toObject.status == 'success'){
					$('#quickAddDescription').modal('hide');
					window.location.href = window.location.href;
					return false;
					$('#' + $('#quickAddDescription #m-q-base-id').val()).html(toObject.desc);
					$('#quickAddDescription').modal('hide');
				}else{
					alert('Unable to saved description, please try to re-submit the form again.');
				}
				$('#quickAddDescription').find("button").removeAttr('disabled');
			}
		});
		
		return false;
	}

					function quickPU(btn)
					{
						$.ajax({
							type : 'POST',
							url : $(btn).attr('url'),
							data : $(btn).attr('eventa') + $(btn).attr('val'),
							success : function(rs){
								if(rs == 1){
									btn.className = "fa fa-check-circle fa-fw";
									$(btn).attr('val', 0);
									$(btn).attr('title', 'Click to unpublish');
								}else if(rs == 0){
									btn.className = "fa fa-times-circle fa-fw";
									$(btn).attr('val', 1);
									$(btn).attr('title', 'Click to publish');
								}
							}
						});
					}

	/**
	* Allow acordion in modal
	*/
	$(document).on('click', 'a.accordion-toggle', function(e) {
		$(e.target).parent().siblings('.accordion-body').on('hidden', function(e) {
			e.stopPropagation();
		});
	});
	
	/**
	* Quick New, a single photo add form
	*/
	
	var _QNew = {
		get_form : function(l){
			$.ajax({
				type : 'POST',
				url : l,
				success : function(rs){
					if(rs != ""){
						$('#PhotoquickNew .modal-body .row-fluid .span12').html(rs);
						$('#PhotoquickNew').modal('show');
					}
				}
			});
			
			return false;
		}
	};
	
	
		$(".see-more").on('click', function(e)  { 
			$(this).closest('td').hide();
			$(this).closest('td').next('td').show();
		});
		
		$(".see-less").on('click', function(e)  {			
			$(this).parent().prev('td').show();						  
			$(this).parent().hide();
		});

function to_slug(txt){
		var _uri = txt
        .toLowerCase()
		.replace(/(<([^>]+)>)/ig,"")
        .replace(/ /g,'-')
        .replace(/[^\w-]+/g,'')
        ;
		
		_uri = _uri.replace('--', '-');
		if(_uri.substring(0, 1) == '-'){
			_uri = _uri.substring(1, _uri.length);
		}
		
		if(_uri.substring(_uri.length - 1, _uri.length) == '-'){
			_uri = _uri.substring(0, _uri.length - 1);
		}
		return _uri;
}


$('table tr td a.tooltipActive').tooltip();

function file_verifyImageFileType(id)
{
    var filename = $(id).val().split('\\').pop();
    var extension = filename.split('.').pop().toLowerCase();

    if (extension == 'jpg' || extension == 'jpeg' || extension == 'png' || extension == 'gif')
    {
        $(id+'-filename').html(filename);
        $('#temp-button').addClass('hidden');
        $('#submit-button').removeClass('hidden');
    }
    else
    {
        $(id+'-filename').html('<span class="error">'+filename+'</span>' );
        $('#submit-button').addClass('hidden');
        $('#temp-button').removeClass('hidden');
        alert('Incorrect file format. Please select a JPG, JPEG, PNG or GIF file.');
    }
}

function file_verifyCsvFileType(id)
{
    var filename = $(id).val().split('\\').pop();
    var extension = filename.split('.').pop().toLowerCase();

    if (extension == 'csv')
    {
        $(id+'-filename').html(filename);
        $(id+'-temp').addClass('hidden');
        $(id+'-submit').removeClass('hidden');
    }
    else
    {
        $(id+'-filename').html('<span class="error">'+filename+'</span>' );
        $(id+'-submit').addClass('hidden');
        $(id+'-temp').removeClass('hidden');
        alert('Incorrect file format. Please select a CSV file.');
    }
}

function admin_expandCollapse(obj)
{
    var _sptclass = obj.className.split('fa-chevron-down');

    if(_sptclass[1] != null){
        $(obj).parents('td').find('.data_summary').css({
            display : 'none'
        });
        $(obj).parents('td').find('.data_full').css({
            display : 'inline'
        });
        obj.className = obj.className.replace('fa-chevron-down', 'fa-chevron-up');
        
    }else{
        $(obj).parents('td').find('.data_summary').css({
            display : 'inline'
        });
        
        $(obj).parents('td').find('.data_full').css({
            display : 'none'
        });
        
        obj.className = obj.className.replace('fa-chevron-up', 'fa-chevron-down');
    }
}

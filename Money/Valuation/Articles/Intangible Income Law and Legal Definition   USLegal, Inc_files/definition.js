/*
 *
 * Textarea Maxlength Setter JQuery Plugin
 * Version 1.0
 *
 * Copyright (c) 2008 Viral Patel
 * website : http://viralpatel.net/blogs
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
$.fn.maxlength = function(){

    $("textarea[maxlength]").keypress(function(event){
        var key = event.which;
        
        //all keys including return.
        if(key >= 33 || key == 13) {
            var maxLength = $(this).attr("maxlength");
            var length = this.value.length;
            if(length >= maxLength) {

                event.preventDefault();
            }
        }
    });
}

$(document).ready(function() {
    //Set maxlength of all the textarea (call plugin)
    $("#meta_description").maxlength();
   
   $.validator.addMethod("editor_text", function(value) {
        var val = value.text();
        return value != "";
    }, 'This field is required');

    $("#add_category_icon").on('click', function(){
       $("#add_category_div").show();
    });

    $("#add_category_btn").on('click', function(){
        var category = $("#add_category").val();
        if (category == "") {
            $("#add_category_error").html("This field is required.");
            return false;
        }
        var option = "";
        var form_id = "#" + $('#add_category_btn').closest('form').attr('id');
        $(form_id + ' > #category > option').each(function() {
            option = this.text;
            if (category.toLowerCase() == option.toLowerCase())
            {
                $("#add_category_error").html("This category already exist.");
                return false;
            }
        });
        $.ajax({
             url:  "/admin/definitions/definitions/add_category",
             data: "name="+category,
             type: "POST",
             dataType: "json",
             success: function(response){
                if (response.type == "success")
                {
                    option = "<option value="+response.id+">"+response.name+"</option>";
                    $(".cat-dd").append(option);
                    $(form_id + ' #category > option[value="'+response.id+'"]').attr("selected", "selected");
                    $("#add_category_div").hide();
                    $("#add_category").val('');
                    $("#add_category_error").html("");
                }
                else if (response.type == "error")
                {
                    $("#add_category_error").html(response.msg);
                }
             }
        });
    });

    if ($(".edit-category").length)
    {
        $(".edit-category").on('click', function() {
            $(".edit-div").hide();
            $(".edit-span").show();
            var id = $(this).attr('rel');
            $("#span_"+id).hide();
            $("#form_div_"+id).show();
            $("#form_"+id+" #name").focus();
        })
    }
})

/* check if any checkboxe is selected admin index pages*/
function select_one(element)
{
    var flag = false;
    $(".myCheckboxes").attr("checked",false);
    $(element).attr("checked", true);
}

/*
* function used to set redirect url for login popup before adding a definition
* @param: url  
*/
function set_url(url) {
	$("#redirect_to").val(url);
}


$(window).load(function(e){
	/*
	* function used to set redirect url for login popup before adding a definition
	*/
	/*$("#search_term").keypress(function(e)  {
		var term = $("#search_term").val();
		term = $.trim(term);
		if (e.which == 13 && term != "") {
			$("#search-form").submit();	
		}
	});*/
	
	$(".see-more").on('click', function(e)  {
		$(this).closest('td').hide();
		$(this).closest('td').next('td').show();
	});
	
	$(".see-less").on('click', function(e)  {
		$(this).parent().prev('td').show();						  
		$(this).parent().hide();							  
	});

});

function submission(id) {
	$.ajax({
			url:  "/admin/definitions/definitions/get_definition",
			data: 'id=' + id,
			type: "POST",			
			success: function(response){
                $("#submission_edit_response").html(response);
			}
		});	
}

function define_term(id) {
    $.ajax({
        url:  "/admin/definitions/definitions/get_definition",
        data: 'term_id=' + id,
        type: "POST",
        success: function(response){
            $("#submission_edit_response").html(response);
        }
    });
}

function delete_submission(id, def_id, ths) {
	var confirmation = confirm('Are you sure you want to delete this submission?');
	if (confirmation) {
		$.ajax({
            url:  "/admin/definitions/definitions/delete_submission",
            data: 'id='+id+'&def_id='+def_id,
            type: "POST",
            success: function(response){
                if (response == "success") {
                    $(ths).parent().parent().remove();
                    $("#set_class").removeClass('alert-error');
                    $("#set_class").addClass('alert-success');
                    $("#success_msg").text("Deleted submission with id: #"+id);
                    $("#messages").show();
                } else if (response == "error") {
                    $("#set_class").removeClass('alert-success');
                    $("#set_class").addClass('alert-error');
                    $("#success_msg").text("Currently published definition cannot be deleted.");
                    $("#messages").show();
                } else {
                    $("#set_class").removeClass('alert-success');
                    $("#set_class").addClass('alert-error');
                    $("#success_msg").text(response);
                    $("#messages").show();
                }
            }
        });
	}
}

function submit_admin_edits() {    	
	
	area2 = "area1";
	var instance = CKEDITOR.instances[area2].getData();
	$("#editorcontent").val(instance);
	//return false;
	//$("#editorcontent").val($('.cke_wysiwyg_frame').contents().find('.cke_editable').html());
	
	setTimeout(" $('#submission_modal').submit();", 400);									
	$('#submission_modal').ajaxForm({	
		dataType: 'json',
        success: process_submission_edit
  	});
}

function process_submission_edit(data, statusText, xhr, $form)
{  
	if (data.type == "error") {
        var errors = $.parseJSON(data.error);
        var i = 0;
        $(".error").html('');
        $.each(errors, function (key, val)
        {
            if (key == 'content')
            {
                $("#content_error").html(val);
            }
            if (key == 'photo')
            {
                $("#photo_error").html(val);
            }

        });
    }
    if (data.type == "success" || data.type == "noDataAdded" ) {
        window.location.href = window.location.href;
    }		
}
//set title
function set_modal_title(text, id, ths)
{
    $('#'+id).html(text);
}
//request definition form submissions
function submit_definition_form(form_id, field_id, ths) {
	
	
	$("#editorcontent").val($('.cke_wysiwyg_frame').contents().find('.cke_editable').html());
	$(form_id + " #msg").html("");
    var title_id = "";
    if (field_id != "editor")
    {
        var title_val = $(field_id).val();
        if ($.trim(title_val) == "") {return false;}
        title_id = field_id;
        if ($(ths).attr('name') == 'btnSubmitClose')
        {
            $("#request_btn_type").val("1");
        }
    }
    else
    {
        if (form_id  == "#edit_definition") {
            //var content = $(form_id + " .nicEdit-main").text();
			var content = $("#editorcontent").val();
            if (content != "")
            {
                //$("#area2").html($(form_id + " .nicEdit-main").html());
				$("#area2").html($("#editorcontent").val());
            }
            else {
                $("#editor").html("This field is required");
                return false;
            }
            title_id = field_id;
        }
        else if (form_id  == "#submit_definition") {
            $("#submit_definition").validate()
            if ($("#submit_definition").valid())
            {
                //var content = $(form_id + " .nicEdit-main").text();
				var content = $("#editorcontent").val();;
                if (content != "")
                {
                    //$("#area1").html($(form_id + " .nicEdit-main").html());
					$("#area1").html($("#editorcontent").val());
                }
                else {
                    $("#submit-editor-error").html("This field is required");
                    return false;
                }
                if ($(ths).attr('name') == 'btnSubmitClose')
                {
                    $("#submit_btn_type").val("1");
                }
            }
            else
            {
                return false;
            }
        }

    }
    setTimeout("$('"+form_id+"').submit();", 400);
    $(form_id).ajaxForm({
        dataType: 'json',
        success: process_submission
    });
}

function process_submission(data, statusText, xhr, $form) {

	var redirect = "";
	if (data.btn_type && data.btn_type == '1') {
		if (data.redirect) {
			redirect = data.redirect;
		} 
		else {
			redirect = window.location.href;
		}		
	}
    if (data.type == "error") {
        var errors = $.parseJSON(data.error);
        var i = 0;
        $(".error").html('');
        $.each(errors, function (key, val)
        {

            if (i == 0)
            {
                $(data.form_id + " #"+key).focus();
            }
            i++;
            $(data.form_id + " #"+key).addClass('error');
            //parent -> find required for photo case
            $(data.form_id + " #"+key).parent().find("span.error").text(val);
        });
		return true
    }
    if (data.type == "success" || data.type == "edit success") {
         if (data.btn_type === '0')
         {
             var msg = '<div class="alert alert-success">' +
                 '<button type="button" class="close" data-dismiss="alert">×</button>'+data.msg+'</div>';
             $(data.form_id + " #msg").html(msg);
			 //form reset code
             $(data.form_id).get(0).reset();
             $('.error').text('');
             if (data.form_id == "#submit_definition" || data.form_id == "#edit_definition")
             {
                 $(".nicEdit-main").html('');
             }			 
			 //form reset code
			 return true
         }
         else
         {			 
			window.location.href = redirect;          
         }
    }
	if (data.type == "error" && data.btn_type === '1') 
	{
		window.location.href = redirect;
	}
	if (data.type == "warning" && data.btn_type === '1') 
	{
		window.location.href = redirect;
	}
}

//open edit definition, define term and submit definition form for front end
function open_edit_form(url) {
    var data = '';
    if (url != '')
    {
        //data = 'url=' + url;
        data = {url:url};
    }
    $.ajax({
        url:  "/definitions/get_form",
        data: data,
        type: "POST",
        success: function(response){
            if (url != '')
            {
                $("#fill_response").html(response);
                $("#edit_modal_title").html($("#term_title").val());
            }
            else
            {
                $("#submit_definition_response").html(response);
            }
        }
    });
}


//open add definition form
function open_add_form() {
    $.ajax({
        url:  "admin/definitions/definitions/get_form",
        data: '',
        type: "POST",
        success: function(response){
            $("#quick-add-response").html(response);
        }
    });
}

function save_add_form(ths)
{
    area2 = "content_area_1";
	var instance = CKEDITOR.instances[area2];
	if(instance)
	{
		$("#"+area2).val(instance.getData());
	}
	
    setTimeout(" $('#add-term-form').submit();", 400);
    $('#add-term-form').ajaxForm({
        target: '#add-msg',
        complete: function(xhr) {
            var response = xhr.responseText;
            var check_success = response.substring(0, 7);
            if ($.trim(check_success) == "success") {
                $("#add-term-form").get(0).reset();
                $('.error').text('');
                $('#add-msg').html('');
                if ($(ths).val() == 'close') {
                    $('.quick-add-form').hide();
                }
                $('#messages-quick-add').show();
                $('#add-msg').html('Added definition item.');

                /*Check view to reload*/
                if ($("#mode").val() == '1')
                {
                    if ($(ths).val() == 'close') {
                        $('.admin-mode-btn').removeClass('active');
                        $("#view-btn").addClass('active');
                    }
                    $("#view-mode").val('1');
                    setTimeout(" $('#edit-mode-form').submit();", 400);
                    $('#edit-mode-form').ajaxForm({
                        dataType: 'json',
                        complete: function(xhr) {
                            $("#ajax-response").html(xhr.responseText);
                        }
                    });
                }
                if ($("#mode").val() == '3')
                {
                    if ($(ths).val() == 'close') {
                        $('.admin-mode-btn').removeClass('active');
                        $("#edit-btn").addClass('active');
                    }
                    $("#view-mode").val('3');
                    setTimeout(" $('#view-mode-form').submit();", 400);
                    $('#view-mode-form').ajaxForm({
                        dataType: 'json',
                        complete: function(xhr) {
                            $("#ajax-response").html(xhr.responseText);
                        }
                    });
                }
                /*Check view to reload*/
                if (instance)
                {
                    //instance.ne.removeInstance(area2);
					instance.destroy();
                }
                $("#"+area2).val('');
            }
            else
            {
                $("#error").html(xhr.responseText);
            }
        }
    });
}

function save_edit_form_article()
{
	$("#editorcontent").val($('.cke_wysiwyg_frame').contents().find('.cke_editable').html());
    setTimeout(" $('#edit-term-form').submit();", 400);
    $('#edit-term-form').ajaxForm({
        dataType: 'json',
        success: process_edit_submit
    });
}

function save_edit_form()
{
	//$("#editorcontent").val($('.cke_wysiwyg_frame').contents().find('.cke_editable').html());	
	area2 = "edit-area2";
	var instance = CKEDITOR.instances[area2].getData();
	//alert(instance);
	if(instance)
	{
		$("#editorcontent").val(instance);
	}
    setTimeout(" $('#edit-term-form').submit();", 400);
    $('#edit-term-form').ajaxForm({
        dataType: 'json',
        success: process_edit_submit
    });
}

/* Function is used for submit search term form */
function save_searchterm_form()
{
    setTimeout(" $('#edit-term-form').submit();", 400);
    $('#edit-term-form').ajaxForm({
        dataType: 'json',
        success: process_edit_submit
    });
}




function process_edit_submit(data, statusText, xhr, $form) {
    if (data.type == "success")
    {
        $('#quickEditModal').modal('hide');
        if (data.redirect)
        {
            window.location.href = window.location.href;
        }
        else
        {
            $("#action").val('new');
            load_ajax_view();
        }
    }
    else if (data.type == "warning")
    {
        window.location.href = window.location.href;
    }
    else  if (data.type == "error")
    {
        var errors = $.parseJSON(data.error);
        var i = 0;
        $(".error").html('');
        $.each(errors, function (key, val)
        {
            if (i == 0)
            {
                $("#edit-term-form #"+key).focus();
            }
            i++;
            $("#edit-term-form #"+key).addClass('error');
            //parent -> find required for photo case
            $("#edit-term-form #"+key).parent().find("span.error").text(val);
        });
    }

}

function save_new_form()
{
    $("#add-new-form").validate()
    if ($("#add-new-form").valid())
    {      
		//$("#editorcontent").val($('.cke_wysiwyg_frame').contents().find('.cke_editable').html());		
		area2 = "area3";
		var instance = CKEDITOR.instances[area2].getData();
		$("#editorcontent").val(instance);
		
        setTimeout(" $('#add-new-form').submit();", 400);
        $('#add-new-form').ajaxForm({
            dataType: 'json',
            success: process_new_submit
        });
    }

}

function save_new_form_article()
{     
	$("#add-new-form").validate()
    if ($("#add-new-form").valid())
    {
		$("#editorcontent").val($('.cke_wysiwyg_frame').contents().find('.cke_editable').html());
        setTimeout(" $('#add-new-form').submit();", 400);
        $('#add-new-form').ajaxForm({
            dataType: 'json',
            success: process_new_submit
        });
    }

}


/* Function for the validate add new question form */
/*function save_new_form_question()
{
	
	$("#add-new-form").validate();	
    if ($("#add-new-form").valid())
    {
		
		$("#editorcontent").val($('.cke_wysiwyg_frame').contents().find('.cke_editable').html());
        setTimeout(" $('#add-new-form').submit();", 400);
        $('#add-new-form').ajaxForm({
            dataType: 'json',
            success: process_new_submit
					
        });
    }
}*/



function process_new_submit(data, statusText, xhr, $form)
{
	
    if (data.type == "success")
    {
        $('#quickAddModal').modal('hide');
        $('#add-msg').text(data.msg)
        $('#messages-quick-add').show();
        $("#action").val('new');
        load_ajax_view();
    }
    else if (data.type == "warning")
    {
        window.location.href = window.location.href;
    }
    else  if (data.type == "error")
    {
        errors = $.parseJSON(data.error);
        var i = 0;
        $(".error").html('');
        $.each(errors, function (key, val)
        {
            if (i == 0)
            {
                $("#add-new-form #"+key).focus();
            }
            i++;
            $("#add-new-form #"+key).addClass('error');
            $("#add-new-form #"+key).next('label').remove();
            $("#add-new-form #"+key).parent().find("span.error").text(val);
        });
    }

}

/*admin index term name edit*/
function admin_edit_from_link(id, url)
{
    url = url+'edit/'+id;
    $.ajax({
        url:  url,
        data: '',
        type: "POST",
        success: function(response){
            $("#edit-response").html(response);
            $('#edit-term-form').attr('action', url);
            $('#quickEditModal').modal('show');
        }
    });
}


function submit_edit_mode_form(form_id)
{

    setTimeout(" $('#"+form_id+"').submit();", 400);
    $('#'+form_id).ajaxForm({
        dataType: 'json',
        //success: process_edit_submit
        complete: function(xhr) {

        }
    });
}

/*admin index term name edit*/
function edit_mode_row_save(row_id)
{

    var data = "";
    var val = "";
	/*var editor_data = CKEDITOR.instances["content_area_"+row_id].getData();
	$("#content_area_"+row_id).val(editor_data);*/
	
	area2 = "content_area_"+row_id;
	var instance = CKEDITOR.instances[area2];
	
	if(instance)
	{
		$("#"+area2).val(instance.getData());
	}
	
    $("#"+row_id).find('input, select, textarea').each(function(){
        val = $(this).val();		
        if (data == "")
        {
            data = $(this).attr('name')+"="+val;
        }
        else
        {
            if ($(this).attr('name') == 'content')
            {
                val = encodeURIComponent($(this).val());				
            }
           		data += "&"+$(this).attr('name')+"="+val;
        }
    });
    var url = $("#edit-form").attr('action');
    url = url+"/"+row_id;
    $.ajax({
        url:  url,
        data: data,
        type: "POST",
        dataType: "json",
        success: function(response){            
			if (response.type == 'success')
            {
                $("#view-mode").val('3');
                setTimeout(" $('#view-mode-form').submit();", 400);
                $('#view-mode-form').ajaxForm({
                    dataType: 'json',
                    complete: function(xhr) {
                        $("#ajax-response").html(xhr.responseText);
                    }
                });
                $("#messages-quick-add").show();
                $("#add-msg").text('Updated definition item #'+row_id);
            }
			
			if (response.type == 'warning')
            {
                $("#titleError_"+row_id).show();
            }
			
			
			
			
        }
    });
}

function add_modify_photo(photo, id)
{
    $("#upload_id").val(id);
    $("#modify_term_id").val(id);
    $("#filename").val(photo);
    if (photo != null)
    {
        $("#remove_btn").show();
        if ($(".addphoto").hasClass('no-img-div'))
        {
            $(".addphoto").removeClass('no-img-div');
            $(".addphoto").addClass('float-right');
        }
        $("#current-photo").show();
        var img = $("#img_src").val()+photo;
        $("#current-photo").attr('src', img);
    }
    else
    {
        $("#remove_btn").hide();
        if ($(".addphoto").hasClass('float-right'))
        {
            $(".addphoto").removeClass('float-right');
            $(".addphoto").addClass('no-img-div');
        }
        $("#current-photo").hide();
    }
}



function save_photo_form()
{
    setTimeout(" $('#add_modify_photo').submit();", 400);
    $('#add_modify_photo').ajaxForm({
        dataType: 'json',
        //success: process_edit_submit
        success: save_photo_success
    });
}

function save_photo_success(data, statusText, xhr, $form)
{
    if (data.type == "success")
    {
        $("#photo"+data.id).val(data.photo_saved);
        $("#photo_name"+data.id).val(data.photo_original);
        $("#add_modify_photo").get(0).reset();
        $('#photoModifyModal').modal('hide');
		var modify_term_id = $('#modify_term_id').val();
		//alert(modify_term_id);
		edit_mode_row_save(modify_term_id);
    }
    else if (data.type == "error")
    {
        $(".error").html(data.error);
    }
}

function toggle_editor()
{
    var instance = CKEDITOR.instances['content_area_1'];
    if (instance)
    {
        instance.destroy(true);
        $("#add_expand").show();
        $("#add_collapse").hide();
    }
    else
    {
        /*new nicEditor({buttonList : ['bold','italic','underline','ol','ul','link','unlink','upload',
            'removeformat','hr','xhtml','fontSize','fontFormat'],maxHeight : 150}).panelInstance(area2);*/
        CKEDITOR.replace('content_area_1' ,{
		toolbar :
		[
			{ name: 'basicstyles', items : [ 'Bold','Italic','Underline','NumberedList','BulletedList','Image','RemoveFormat','Link','Unlink','Source'] },
			{ name: 'tools', items : [ 'Styles','Format','Font','FontSize','Maximize' ] }
		],
		height: 100,
		filebrowserImageUploadUrl: 'admin/definitions/definitions/uploadck'
	});
        $("#add_expand").hide();
        $("#add_collapse").show();
    }
}

function remove_image(id, type)
{
    var cnfrm = confirm("Are you sure you want to remove image?\nThis action cannot be undone.");
    if (cnfrm)
    {
        var form_id = "";
        switch (type) {
            case '1':
                $("#remove_btn").hide();
                $("#current-photo").hide();
                $(".addphoto").removeClass('float-right');
                $(".addphoto").addClass('no-img-div');
                setTimeout("$('#remove_image').submit();", 400);
                $('#remove_image').ajaxForm({
                });
                $("#view-mode").val('3');
                form_id = "#view-mode-form";
                break;
            case '2':
                $("#current_img").remove();
                $.ajax({
                    url:  "/admin/definitions/definitions/remove_image",
                    data: "term_id="+id+"&type="+type,
                    type: "POST",
                    dataType: "json",
                    success: function(response){
                    }
                });
                $("#view-mode").val('1');
                form_id = "#edit-mode-form";
                break;
            case '3':
                $("#is_remove").val('1');
                $("#submission_current_img").remove();
                break;
			case '4':
                $.ajax({
                    url:  "/admin/definitions/definitions/remove_image",
                    data: "term_id="+id+"&type="+type,
                    type: "POST",
                    dataType: "json",
                    success: function(response){
                    }
                });
                break;
        }

        if (type == '1' || type == '2')
        {
            setTimeout(" $('"+form_id+"').submit();", 400);
            $(form_id).ajaxForm({
                dataType: 'json',
                complete: function(xhr) {
                    $("#ajax-response").html(xhr.responseText);
                }
            });
        }
    }
}

function auto_fill_from_title(element)
{
    var title = $(element).val();
    if (title != "")
    {
        title = title.replace(/\s{2,}/g,' ');
        var page_title = title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
        $("#page_title").val(page_title);
        var url = title.charAt(0).toLowerCase() + title.slice(1).toLowerCase().replace(/\s/g,'-');
        $('#url').val(url);
        var keyword = $("#settings_meta_keyword").val();
        keyword = keyword.replace(/##TERM##/g, title);
        $("#meta_keyword").val(keyword);
    }
}

function add_category()
{
    if ($("#modal_category").val() == "")
    {
        $("#modal_cat_error").html("This field is required.");
        return false;
    }
    setTimeout("$('#category_form').submit();", 400);
    $('#category_form').ajaxForm({
        dataType: 'json',
        success:  process_add_category
    });
}

function process_add_category(data, statusText, xhr, $form)
{
    if (data.type == 'success')
    {
        var option = "<option value="+data.id+" >"+data.name+"</option>";
        $(".cat-dd").append(option);
        $('#add-term-form #category > option[value="'+data.id+'"]').attr("selected", "selected");
        $("#category_form").get(0).reset();
        $('#categoryModal').modal('hide');
        $("#modal_cat_error").html('');
    }
    if (data.type == 'error')
    {
        $("#modal_cat_error").html(data.msg);
    }
}

function close_quick_form()
{
    $("#add-term-form").get(0).reset();
    $('.error').text('');
    $('#add-msg').html('');
    $('.quick-add-form').hide();
}

function delete_category(id)
{
    $.ajax({
        url:  "/admin/definitions/definitions/manage_category/3/"+id,
        data: "",
        type: "POST",
        dataType: "json",
        success: function(response){
            if (response.type == 'success')
            {
                $('#add-msg').html(response.msg);
                $('#add-msg').parent('div').removeClass('alert alert-error');
                $('#add-msg').parent('div').addClass('alert alert-success');
                $('#messages-quick-add').show();
                load_category_by_ajax();
            }
            else if (response.type == 'error')
            {
                $('#add-msg').html(response.msg);
                $('#add-msg').parent('div').removeClass('alert alert-success');
                $('#add-msg').parent('div').addClass('alert alert-error');
                $('#messages-quick-add').show();
            }

        }
    });
}

function add_category_modal(form_id, category, element)
{
    var category = $(category).val();
    if (category == "") {
        $("#add_category_error").html("This field is required.");
        return false;
    }
    $.ajax({
        url:  "/admin/definitions/definitions/manage_category/1",
        data: "name="+category,
        type: "POST",
        dataType: "json",
        success: function(response){
            if (response.type == "success")
            {
                load_category_by_ajax();
                if ($(element).attr('name') == 'btnSubmitClose')
                {
                    $("#addCategoryModal").modal('hide');
                }
                else
                {
                    reset_category_form(form_id);
                    $('#success_msg').html('Category added successfully');
                }
            }
            else if (response.type == "error")
            {
                $("#add_category_error").html(response.msg);
            }
        }
    });
}

function reset_category_form(form_id)
{
    $(form_id).get(0).reset();
    $('.error').html('');
    $('.success').html('');
}

function default_category(id)
{
    $.ajax({
        url:  "/admin/definitions/definitions/manage_category/4/"+id,
        data: "",
        type: "POST",
        dataType: "json",
        success: function(response){
            if (response.type == 'success')
            {
                load_category_by_ajax();
            }
            else if (response.type == 'error')
            {
                $('#add-msg').html(response.msg);
                $('#add-msg').parent('div').removeClass('alert alert-success');
                $('#add-msg').parent('div').addClass('alert alert-error');
                $('#messages-quick-add').show();
            }

        }
    });
}

function edit_category(id)
{
    var form_id = '#form_'+id;
    if ($(form_id +" #name").val() == "")
    {
        $(form_id +" #name").focus();
        $(form_id +" #name").addClass('error');
        $(form_id).children('.error').html('This field is required.');
        return false;
    }
    setTimeout(" $('"+form_id+"').submit();", 400);
    $(form_id).ajaxForm({
        dataType: 'json',
        complete: function(xhr) {
            var response = xhr.responseText;
            if (response == "success")
            {
                load_category_by_ajax()
            }
            else
            {
                $(form_id).children('.error').html(response);
                return false;
            }
        }
    });
}

function set_default_category()
{
    var flag = false;
    var id = "";
    $(".myCheckboxes").each(function() {
        if ($(this).is(":checked"))
        {
            flag = true;
            id = $(this).val();
            default_category(id);
        }
    });
    if (flag == false)
    {
        alert('Please select a category first.');
    }
}

function close_category_edit(id)
{
    $("#span_"+id).show();
    $("#form_div_"+id).hide();
}

function load_category_by_ajax()
{
    $.ajax({
        url:  "/admin/definitions/definitions/ajax_category",
        data: "",
        type: "POST",
        success: function(response){
            $("#ajax-response").html(response);
        }
    });
}

function validate_advance()
{
	var search_term = $("#search_term").val();	
	if(search_term == "")
	{
		$(".error").show();
		return false;
	}else
	{
		return true;
	}
}

function admin_search()
{
    var term = $("#admin_search").val();
    term = $.trim(term);
    if (term != "") {
        $("#search").val(term);
        pagination();
    }
}


/**
 * Created with JetBrains PhpStorm.
 * User: khushboo
 * Date: 2/14/13
 * Time: 10:37 AM
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function(){
    setInterval(function(){
        var width = $('div.container').outerWidth();
        var height = $('div.container').outerHeight();
        $('div.overlay').css({ 'width':width+'px', 'height':height+'px', opacity:'0.6' });
        $('div.overlay img').css({ 'margin-top':((height-64)/2)+'px' });
    }, '10');

    function get_search_results(q){
        $('div.overlay').show();
        $.get('new_search_results', 'q='+encodeURIComponent(q), function(response){
            $('div#search_preview').html(response);
            $('div.overlay').hide();
        });
    }

    /*function select_search_results(q, element){
        $('div.overlay').show();
        $.get('new_search_results', 'q='+encodeURIComponent(q)+'&insert=1', function(response){
           // window.location.href = ""+$(element).attr('rel');
        });
    }*/

    function call_did_you_mean(q) {
        $.get('definitions/spell_checker', 'q='+encodeURIComponent(q), function(response){
            if (response != "")
            {
                $('div#search_preview').html(response);
                $('div.overlay').hide();
            }
        });
    }

    // Set the iSuggest
    $('#q').iSuggest({
        url: 'new_search_suggestions',
        searchURL: 'new_search?q=%s',
        suggestsID: 'isuggest',
        topOffset: 0,
        onType: function(query){
            //get_search_results(query);
        },
        onChange: function(query){
            //get_search_results(query);
        },
        onSelect: function(query, element){
            var correction = $(element).text();
            var post_data = 'searched_term='+encodeURIComponent(query)+'&corrected_term='+encodeURIComponent(correction)+'&result=1';
            $.get('definitions/insert_corrected_search', post_data, function(response){
            });
            window.location.href = ""+$(element).attr('rel');
        },
        onSubmit: function(query){
           get_search_results(query);
           $("#q").blur();
        },
        onEmpty: function(){
            get_search_results('');
        },
        onNoResult: function(query) {
            //call_spell_as_you_type(query);
            call_did_you_mean(query);
        }
    });
	
	
	//if enter key is pressed insert data for search log
    $("#q").on('keyup', function(e){
        var term = $(this).val();
        if(e.keyCode == '13')
        {
            setTimeout(function() {
                var div_text = $("#search_preview").text();
                if (div_text == "No result found")
                {
                    insert_corrected_search(term, '', '0');
                    call_did_you_mean(term)
                }
                else
                {
                    var a_text = $("#search_preview").children('a').text();
                    insert_corrected_search(term, a_text, '1');
                }
            }, 200);

        }
    })
	
	
	// Set the iSuggest for right column
    $('#q1').iSuggest({
        url: 'new_search_suggestions',
        searchURL: 'new_search?q=%s',
        suggestsID: 'isuggest',
        topOffset: 0,
        onType: function(query){
            //get_search_results(query);
        },
        onChange: function(query){
            //get_search_results(query);
        },
        onSelect: function(query, element){
            var correction = $(element).text();
            var post_data = 'searched_term='+encodeURIComponent(query)+'&corrected_term='+encodeURIComponent(correction)+'&result=1';
            $.get('definitions/insert_corrected_search', post_data, function(response){
            });
            window.location.href = ""+$(element).attr('rel');
        },
        onSubmit: function(query){
           get_search_results(query);
           $("#q1").blur();
        },
        onEmpty: function(){
            get_search_results('');
        },
        onNoResult: function(query) {
            //call_spell_as_you_type(query);
            call_did_you_mean(query);
        }
    });
	
	//if enter key is pressed insert data for search log
    $("#q1").on('keyup', function(e){
        var term = $(this).val();
        if(e.keyCode == '13')
        {
            setTimeout(function() {
                var div_text = $("#search_preview").text();
                if (div_text == "No result found")
                {
                    insert_corrected_search(term, '', '0');
                    call_did_you_mean(term)
                }
                else
                {
                    var a_text = $("#search_preview").children('a').text();
                    insert_corrected_search(term, a_text, '1');
                }
            }, 200);

        }
    })
	
	
    // Set the iSuggest for right column for question page.
    $('#q2').iSuggest({
        url: 'qa/questions/new_search_suggestions',
        searchURL: 'qa/questions/search?q=%s',
        suggestsID: 'isuggest',
        topOffset: 0,
        onType: function(query){
            //get_search_results(query);
        },
        onChange: function(query){
            //get_search_results(query);
        },
        /*onSelect: function(query, element){
            var correction = $(element).text();
            var post_data = 'searched_term='+encodeURIComponent(query)+'&corrected_term='+encodeURIComponent(correction)+'&result=1';
            $.get('definitions/insert_corrected_search', post_data, function(response){
            });
            window.location.href = ""+$(element).attr('rel');
        },*/
        onSubmit: function(query){
           //get_search_results_questions(query);
           //$("#q2").blur();
        },
        onEmpty: function(){
           // get_search_results_questions('');
        },
        onNoResult: function(query) {
            //call_spell_as_you_type(query);
            //call_did_you_mean(query);
        }
    });
	
	
	//if enter key is pressed insert data for search log	
    $("#q2").on('keyup', function(e){
        var term = $(this).val();
        if(e.keyCode == '13')
        {
            setTimeout(function() {
                var div_text = $("#search_preview").text();
                if (div_text == "No result found")
                {
                    //insert_corrected_search(term, '', '0');
                    //call_did_you_mean(term)
                }
                else
                {
                    var a_text = $("#search_preview").children('a').text();
                    //insert_corrected_search(term, a_text, '1');
                }
            }, 200);

        }
    })
	
	
	
// Set the iSuggest for right column for question page.
    $('#s-search').iSuggest({
        url: $('#s-search').data('rel'), 
        searchURL: 'articles/search?q=%s',
        suggestsID: 'isuggest',
        topOffset: 0,
        onType: function(query){
            //get_search_results(query);
        },
        onChange: function(query){
            //get_search_results(query);
        },
        /*onSelect: function(query, element){
            var correction = $(element).text();
            var post_data = 'searched_term='+encodeURIComponent(query)+'&corrected_term='+encodeURIComponent(correction)+'&result=1';
            $.get('definitions/insert_corrected_search', post_data, function(response){
            });
            window.location.href = ""+$(element).attr('rel');
        },*/
        onSubmit: function(query){
           //get_search_results_questions(query);
           //$("#q2").blur();
        },
        onEmpty: function(){
           // get_search_results_questions('');
        },
        onNoResult: function(query) {
            //call_spell_as_you_type(query);
            //call_did_you_mean(query);
        }
    });
	
	
	//if enter key is pressed insert data for search log	
    $("#s-search").on('keyup', function(e){
        var term = $(this).val();
        if(e.keyCode == '13')
        {
            setTimeout(function() {
                var div_text = $("#search_preview").text();
                if (div_text == "No result found")
                {
                    //insert_corrected_search(term, '', '0');
                    //call_did_you_mean(term)
                }
                else
                {
                    var a_text = $("#search_preview").children('a').text();
                    //insert_corrected_search(term, a_text, '1');
                }
            }, 200);

        }
    })	

    // Set the iSuggest for right column for encyclopedia page.
    $('#q3').iSuggest({
        url: 'encyclopedia/new_search_suggestions',
        searchURL: 'encyclopedia/search?q=%s',
        suggestsID: 'isuggest',
        topOffset: 0,
        onType: function(query){
            //get_search_results(query);
        },
        onChange: function(query){
            //get_search_results(query);
        },
        /*onSelect: function(query, element){
            var correction = $(element).text();
            var post_data = 'searched_term='+encodeURIComponent(query)+'&corrected_term='+encodeURIComponent(correction)+'&result=1';
            $.get('definitions/insert_corrected_search', post_data, function(response){
            });
            window.location.href = ""+$(element).attr('rel');
        },*/
        onSubmit: function(query){
           //get_search_results_questions(query);
           //$("#q2").blur();
        },
        onEmpty: function(){
           // get_search_results_questions('');
        },
        onNoResult: function(query) {
            //call_spell_as_you_type(query);
            //call_did_you_mean(query);
        }
    });
	
	
	//if enter key is pressed insert data for search log	
    $("#q3").on('keyup', function(e){
        var term = $(this).val();
        if(e.keyCode == '13')
        {
            setTimeout(function() {
                var div_text = $("#search_preview").text();
                if (div_text == "No result found")
                {
                    //insert_corrected_search(term, '', '0');
                    //call_did_you_mean(term)
                }
                else
                {
                    var a_text = $("#search_preview").children('a').text();
                    //insert_corrected_search(term, a_text, '1');
                }
            }, 200);

        }
    })
	
	

    
});

//ajax request to insert search log data
function insert_corrected_search(term, correction, result) {
    var post_data = 'searched_term='+encodeURIComponent(term)+'&corrected_term='+encodeURIComponent(correction)+'&result='+result;
    $.get('definitions/insert_corrected_search', post_data, function(response){
    });
}


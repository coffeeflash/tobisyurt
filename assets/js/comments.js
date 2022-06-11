$(function(){
  //on document ready

  console.log("lalalal")

  $.ajax({
    url: 'http://localhost:8080/api/comments?post=' + $('#comments-title').text(),
    type: 'GET',
    // data: {
    //         postTitle: $('.post-title').text()
    //       },
    success: function(r){
      // $("#loading-spinner").animate({opacity: '0'}, 500);
      $('.comments').empty();
      $('.comments').append(r);
      console.log(r)
    },
    error: function(){ console.log("upsss.....");}
  });



	// Open/close details of a deal
	$('.row h4').click(function(){
		var $deal = $(this).parent();
		if ($deal.hasClass('active')) {
			// close details
			$deal.removeClass('active');

			$deal.find('.deal-details').slideUp();
		} else {
			// show details
			$deal.addClass('active');
			var dealId = $deal.attr('id').replace('deal-', '');
			console.log("Deal " + dealId + " has been clicked.");


			$.ajax({
				url: 'ajax.php',
				type: 'POST',
				data: {
								id: dealId,
								other: "blabla"
							},
				success: function(data){
					// $("#loading-spinner").animate({opacity: '0'}, 500);
					$('.deal-details').empty().append(data);


				},
				error: function(){ console.log("upsss.....");}
			});

			$deal.find('.deal-details').slideDown();
		}
	});



	//FOLLLOWING ENABLES THE PATTERN-ATTRIBUTE ON TEXTAREAS
	var errorMessage = "Please match the requested format.";

	    $( this ).find( "textarea" ).on( "input change propertychange", function() {

	        var pattern = $( this ).attr( "pattern" );

	        if(typeof pattern !== typeof undefined && pattern !== false)
	        {
	            var patternRegex = new RegExp( "^" + pattern.replace(/^\^|\$$/g, '') + "$", "g" );

	            hasError = !$( this ).val().match( patternRegex );

	            if ( typeof this.setCustomValidity === "function")
	            {
	                this.setCustomValidity( hasError ? errorMessage : "" );
	            }
	            else
	            {
	                $( this ).toggleClass( "error", !!hasError );
	                $( this ).toggleClass( "ok", !hasError );

	                if ( hasError )
	                {
	                    $( this ).attr( "title", errorMessage );
	                }
	                else
	                {
	                    $( this ).removeAttr( "title" );
	                }
	            }
	        }

	    });

});

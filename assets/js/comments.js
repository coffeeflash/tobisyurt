
function toHexString(byteArr) {
    return byteArr.map((byte) => {
      if (byte < 0) {
        byte = -((byte ^ 0xff) + 1); //converting 2s complement to a decimal number
      }
      //add padding at the start to ensure it's always 2 characters long otherwise '01' will be '1'
      return byte.toString(16).padStart(2, '0');
  })
}

function bytesToHexString (bytes){
  return bytes.map(b => b.toString(16).padStart(2, '0')).join('')           // convert bytes to hex string
}

async function recursiveHash (msgUint8) {
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)        // hash the message
      const hashArray = Array.from(new Uint8Array(hashBuffer))                   // convert buffer to byte array
      const hashHex = bytesToHexString(hashArray)
      return hashHex;
}

function checkNBytes(digestHex, numZeroBytes){
      for (let i = 0; i < numZeroBytes*2; i++) {
        if (digestHex[i] != 0) return true;         // search further hashes...
      }
      return false;
}

async function searchHash(quizContent){
  let digestHex = ""
  let nonce = null
      do{
//        nonce = new Uint8Array(16)
//        crypto.getRandomValues(nonce);
	nonce = crypto.randomUUID();
        //console.log(nonce)
//        let msgUint8 = new TextEncoder().encode(quizContent) // encode as (utf-8) Uint8Array
	let nonceAndMsg = new TextEncoder().encode(nonce + quizContent)
//        let nonceAndMsg = new Uint8Array(nonce.length + msgUint8.length);
//        nonceAndMsg.set(nonce);
//        nonceAndMsg.set(msgUint8, nonce.length);
        digestHex = await recursiveHash(nonceAndMsg);
        //console.log(digestHex);

      }while (checkNBytes(digestHex, 2))
      console.log("VALID HASH: " + digestHex)

      return nonce
}

$(function(){
  //on document ready

  console.log("lalalal")

  $.ajax({
    //url: 'http://localhost:8080/api/comments?post=' + $('#comments-title').text(),
    url: 'http://localhost:8080/api/quiz',
    type: 'GET',
    // data: {
    //         postTitle: $('.post-title').text()
    //       },
    success: async function(r){
      // $("#loading-spinner").animate({opacity: '0'}, 500);
      $('.comments').empty();
      $('.comments').append(r);
      //console.log(toHexString(r));
      console.log(r)
      console.log(new TextEncoder().encode(r))
      console.log(toHexString(Array.from(r).map(letter => letter.charCodeAt(0))))
      const validNonce = await searchHash(r)
      console.log("VALID NONCE: " + validNonce)
      console.log("Valid NONCE to string: " + validNonce)

     $.ajax({
    //url: 'http://localhost:8080/api/comments?post=' + $('#comments-title').text(),
    url: 'http://localhost:8080/api/solution?nonce=' + validNonce,
    type: 'POST',
    // data: {
    //         postTitle: $('.post-title').text()
    //       },
    success: function(r){
      // $("#loading-spinner").animate({opacity: '0'}, 500);
      //$('.comments').empty();
      //$('.comments').append(r);
      //console.log(toHexString(r));
      console.log("ok")
      
    },
    error: function(){ console.log("upsss.....");}
  });


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

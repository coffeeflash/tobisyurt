
const baseUrl = 'http://localhost:8080'
let loading = false

setUp()

function setUp(){
  $.ajax({
    url: baseUrl + '/api/comments?source=' + $('#comments-title').text(),
    type: 'GET',
    success: function(comments){
      $('#comments-section').empty().append(
        '<h2>Comments - Section</h2>'+
        '<div class="comments"></div>'+
        '<div id="addComment">'+
        '  <button type="button" onclick="addComment()"> Add a comment </button>'+
        '</div>'
      )

      $('.comments').empty()
      comments.forEach(comment => {
        $('.comments').append(
          '<h3>' + comment.user +
            '<span style="color:rgb(128,128,128);font-size:0.8rem;"> (' + new Date(comment.date).toLocaleString() + ')</span>'+
          '</h3>'+
          '<p>' + comment.comment + '</p>'
        )
      })
    },
    error: function(){ console.log("upsss.....");}
  })
}

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
  const hashArray = Array.from(new Uint8Array(hashBuffer))                  // convert buffer to byte array
  const hashHex = bytesToHexString(hashArray)
  return hashHex;
}

function checkNBytes(digestHex, numZeroBytes){
  for (let i = 0; i < numZeroBytes*2; i++) {
    if (digestHex[i] != 0) return true;                                     // search further hashes...
  }
  return false;
}

async function searchHash(quizContent, securityLevel){
  let digestHex = ""
  let nonce = 0
    do{
      nonce++
	    let nonceAndMsg = new TextEncoder().encode(nonce + quizContent)
      digestHex = await recursiveHash(nonceAndMsg);
    }while (checkNBytes(digestHex, securityLevel))
    console.log("VALID HASH: " + digestHex)
    return nonce
}

function addComment(){
  console.log("adding a comment started.")
  $('#addComment').empty().append(
    '<h1>Add your comment:</h1>'+
      '<p style="color:rgb(128,128,128);font-size:2rem;" id="loading"></p>'+
    '<form onsubmit="sendComment()"'+
      '<label for="name">Name:</label><br>'+
      '<input id="name" name="name" value="your name"><br>'+
      '<label for="text-comment">Comment:</label><br>'+
      '<textarea id="text-comment" name="text-comment" rows="4" cols="50">'+
      ' Please, put your comment here.'+
      '</textarea><br><br>'+
      '<input type="submit" value="Submit">'+
    '</form>'
  )
  $('form').submit(function(event){
    event.preventDefault();
  });
}

function sendComment(){
    $.ajax({
    //url: 'http://localhost:8080/api/comments?post=' + $('#comments-title').text(),
    url: baseUrl + '/api/quiz',
    type: 'GET',
    // data: {
    //         postTitle: $('.post-title').text()
    //       },
    success: async function(quiz){
      // $("#loading-spinner").animate({opacity: '0'}, 500);
      recursiveWait();
      console.log(quiz)
      console.log(new TextEncoder().encode(quiz.content))
      console.log(toHexString(Array.from(quiz.content).map(letter => letter.charCodeAt(0))))
      const validNonce = await searchHash(quiz.content, quiz.securityLevel)
      console.log("VALID NONCE: " + validNonce)
      let that = this
      $.ajax({
        url: baseUrl + '/api/comment',
        contentType: "application/json",
        type: 'POST',
        data: JSON.stringify({
                source: $('#comments-title').text(),
                user: $('#name').val(),
                comment: $('#text-comment').val(),
                quizId: quiz.content,
                quizSolution: validNonce
              }),
        success: function(){
          console.log("ok, loading all comments again...")
          loading = false
          setUp()
        },
        error: function(){ console.log("upsss..... 1");}
      });
    },

    error: function(){ console.log("upsss..... 2");}
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let loadicons = ['|','/','-','\\']
let i = 0

async function recursiveWait() {
 let loadico = loadicons[i++%4]
 $('#loading').empty().append(loadico + "    " + loadico + "    " + loadico)
 loading = true
 console.log("waiting...")
 await delay(200)
 if(loading) await recursiveWait()
 else i = 0
}

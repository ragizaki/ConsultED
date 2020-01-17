//links
//http://eloquentjavascript.net/09_regexp.html
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

var counter = 0;
var getUrl;
var messages = [], //array that hold the record of each string in chat
  lastUserMessage = "", //keeps track of the most recent input string from the user
  botMessage = "", //var keeps track of what the chatbot is going to say
  botName = 'John', //name of the chatbot
  talking = true; //when false the speach function doesn't work

//edit this function to change what the chatbot says
function updateUI (responseMessage, counter){
  // lastUserMessage = document.getElementById("chatbox").value;
  //messages.push(lastUserMessage);
  // lastUserMessage = messages[0];

  botMessage = (JSON.parse(responseMessage))["results"][0]["faq"]["answer"];
  getUrl = (JSON.parse(responseMessage))["results"][0]["externalUrl"];
  console.log(getUrl);
  //botMessage = "Humza Rocks" + " <a href = \""+getUrl+"\">"+"Learn More"+"</a>"
  messages.push("<b>" + botName +":</b> "+ botMessage );
  console.log(botMessage);
  console.log(messages);
  //document.getElementById("chatlog" + counter).innerHTML = messages[messages.length - counter];
}



function chatbotResponse() {
  talking = true;
  //botMessage = "Welcome to ConsultEd, I am John. I will get back to you in a few!"; //the default message
  
  //Open connection with API -> HTTP, etc
  //POST lastUserMessage -> query
  //GET  search results -> botMessage

  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  const url = "https://api.genesysappliedresearch.com/v2/knowledge/knowledgebases/696d5496-e26a-4185-a607-f29cc03204b6/search"; // site that doesn't send Access-Control-*
  var response = '';
  
  fetch(proxyurl + url, {
    method: "POST",
    headers: {
        'Accept': 'application/json',
                  'Content-Type': ' application/json',
                  'organizationid': '525cd0c1-ad46-4bf1-8f68-f80d2e0ccfd7',
      'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJvcmdJZCI6IjUyNWNkMGMxLWFkNDYtNGJmMS04ZjY4LWY4MGQyZTBjY2ZkNyIsImV4cCI6MTU3MTU4NjI4MiwiaWF0IjoxNTcxNTgyNjgyfQ.A903B74Q6DiGXNkGys6JW2Ve6JYVjx8yAdEBu19td7c'
              },
  body: JSON.stringify({query: lastUserMessage, pageSize:1, pageNumber: 1, sortOrder: "string", sortBy: "string", languageCode: "en-US", documentType: "Faq"})
  }).then(response => response.text())
  .then(contents => { counter++; updateUI(contents, counter); console.log(JSON.parse(contents));  response = contents;})
  .catch(() => console.log("Can't access " + url + " response. Blocked by browser?"))
                                                                                                                                              
  
}


function newEntry() {
  //if the message from the user isn't empty then run 
  if (document.getElementById("chatbox").value != "") {
    //pulls the value from the chatbox ands sets it to lastUserMessage
    lastUserMessage = document.getElementById("chatbox").value;
    messages.push(lastUserMessage);
    //sets the chat box to be clear
    document.getElementById("chatbox").value = "";
    //adds the value of the chatbox to the array messages
  
    chatbotResponse();

    for (var i = 1; i < 8; i++) {
      if (messages[messages.length - i])
        document.getElementById("chatlog" + i).innerHTML = messages[messages.length - i];
    }
    //add the chatbot's name and message to the array messages
    //messages.push("<b>" + botName + ":</b> " + botMessage);
    // says the message using the text to speech function written below
    Speech(botMessage);
    //outputs the last few array elements of messages to html
    
  }
}

//text to Speech
//https://developers.google.com/web/updates/2014/01/Web-apps-that-talk-Introduction-to-the-Speech-Synthesis-API
function Speech (say) {
  if ('speechSynthesis' in window && talking) {
    var utterance = new SpeechSynthesisUtterance(say);
    speechSynthesis.speak(utterance);
  }
}

//runs the keypress() function when a key is pressed
document.onkeypress = keyPress;
//if the key pressed is 'enter' runs the function newEntry()
function keyPress(e) {
  var x = e || window.event;
  var key = (x.keyCode || x.which);
  if (key == 13 || key == 3) {
    //runs this function when enter is pressed
    newEntry();
  }
  if (key == 38) {
    console.log('hi')
      //document.getElementById("chatbox").value = lastUserMessage;
  }
}

//clears the placeholder text ion the chatbox
//this function is set to run when the users brings focus to the chatbox, by clicking on it
function placeHolder() {
  document.getElementById("chatbox").placeholder = "";
}

'use strict'

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';
recognition.continuous = true;
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let speechbttn = document.querySelector('button');
speechbttn.addEventListener('click', () => {
    if(speechbttn.innerHTML.indexOf("Start Recording") > -1){
        speechbttn.style.backgroundColor='#4cae4c'
        speechbttn.innerHTML= "Stop Recording"
        speechbttn.title = "click to stop recording"
        recognition.start();
    }else if(speechbttn.innerHTML.indexOf("Stop Recording") > -1){
        speechbttn.style.backgroundColor='red'
        speechbttn.innerHTML= "Start Recording"
        speechbttn.title = "click to stop recording"
        console.log("Speech detection ended");
        recognition.stop();
    }
    
});

recognition.addEventListener('speechstart', () => {
    console.log('Speech has been detected.');
});
  
recognition.addEventListener('result', (e) => {
    console.log('Result has been detected.');

    let last = e.results.length - 1;
    let text = e.results[last][0].transcript;
    let ipadd = '';
    $.getJSON("https://api.ipify.org?format=json", function(data) { 
            ipadd = data.ip;
            let speechdata = {
              user: ipadd,
              speechData: text
            }
            fetch('/speechDetection', {method: 'POST', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
              body: JSON.stringify(speechdata)}).then(function(response) {
              if(response.ok) {
                return;
              }
              throw new Error('Request failed.');
            })
            .catch(function(error) {
              console.log(error);
            });
        }) 
});

recognition.addEventListener('speechend', () => {
    recognition.stop();
});
  
recognition.addEventListener('error', (e) => {
    console.log(e);
});

  
'use strict'

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';
recognition.continuous = true;
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let speechbttn = document.querySelector('button');
speechbttn.addEventListener('click', () => {
    if(speechbttn.innerHTML=== "Start Recording"){
        speechbttn.style.backgroundColor='#4cae4c'
        speechbttn.innerHTML= "Stop Recording"
        recognition.start();
    }else if(speechbttn.innerHTML=== "Stop Recording"){
        speechbttn.style.backgroundColor='red'
        speechbttn.innerHTML= "Start Recording"
        console.log("Speech detection ended");
        recognition.stop();
    }
    
});

window.onload = (event) => {
    try{
        var ifr_window = document.getElementsByTagName("iframe")[0].contentWindow;
        console.log(ifr_window.world);
    }catch(e){
        console.log(e)
    }
  };

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

  
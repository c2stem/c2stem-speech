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

recognition.addEventListener('speechstart', () => {
    console.log('Speech has been detected.');
});
  
recognition.addEventListener('result', (e) => {
    console.log('Result has been detected.');

    let last = e.results.length - 1;
    let text = e.results[last][0].transcript;
    let ipadd = '';
    console.log(text);
    console.log('Confidence: ' + e.results[0][0].confidence);
 
});

recognition.addEventListener('speechend', () => {
    recognition.stop();
});
  
recognition.addEventListener('error', (e) => {
//   outputBot.textContent = 'Error: ' + e.error;
    console.log(e);
});
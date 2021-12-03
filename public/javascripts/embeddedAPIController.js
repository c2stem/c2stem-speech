// Embedded API
var last_saved = ''
var interval = null;

const localUser = new LocalUser();

// AUTOSAVE
// start/stop autosave timer on radio toggle
$('#autosave').change(function() {
    
    if($(this).prop('checked')){
        interval = setInterval(autosave, 10000);
    }else{
        clearInterval(interval);
    }
  })

// autosave to cloud when requested
async function autosave(){
    const xml = await api.getProjectXML();
    saveToCloud(xml);
}

document.getElementById('save_interval').innerHTML= last_saved;

// IFRAME LOADER
const containers = Array.prototype.slice.call(document.getElementsByClassName("build-environment"));
const envs = containers
   .map(cntr => new IframeLoader(cntr));

var ifr_window = document.getElementById("iframe-id");

// IMPORT from local and cloud
var importFile= '';
const fileSelector = document.getElementById('file-upload');
fileSelector.addEventListener('change', (event) => {
  importFile = event.target.files[0];
});

const importBttn = document.getElementById('importBttn');
importBttn.addEventListener('click', ()=> {
    const reader = new FileReader();
    reader.addEventListener('load', event => {
    api.import("saved_project",event.target.result)
    });
    reader.readAsText(importFile);
})

async function importFromCloud(){
    const response = await fetch('/getProject');
    var data = await response.json();
    console.log(JSON.parse(data.data));

    var projectNames = data.data.map( function(data) {
        if( data.project){
            var project = data.project;
            var app = project.split("app=")[0]
            var projectname = app.split("name=")[0]
            return projectname;
        }
    });
    const modaljs = document.getElementById("modaljs");
    var list = document.createElement("ui");
    for (var i in projectNames){
        var anchor = document.createElement("a");
        anchor.href = "#";
        anchor.innerText = projectNames[i];
      
        var elem = document.createElement("li");
        elem.appendChild(anchor);
        list.appendChild(elem);
    }
    $('#importCloud').modal('show');
}
 
// SAVE to local and cloud
const saveBttn = document.getElementById('saveButton');

async function saveProject(innertext) {
  const xml = await api.getProjectXML();
  save_type = innertext;
  try {
    saveBttn.innerText = 'Processing...'
    if(save_type.indexOf("Save to local") > -1){
        await saveToLocal(xml);
    }else if(save_type.indexOf("Save to Cloud") > -1){
        await saveToCloud(xml);
    }
      saveBttn.innerText = 'Save'
  } catch (err) {
      console.log(err);
        saveBttn.innerText = 'Retrying...'
      setTimeout(saveProject, 500);
  }
}

async function saveToLocal(projectXML) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:attachment/xml,' + encodeURI(projectXML));
  element.setAttribute('download', "Saved_Project");
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  
}
//  Testing efficient ways to save project
async function saveToCloud(projectXML) {
    const projectName = 'exampleP'
    api.saveToCloud(projectName);
    username = localUser.getStoredUser("netsblox-user");
    project = localUser.getStoredProjectName(username);
    await sleep(5000);
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    last_saved = "Last Saved : "+dateTime;
    document.getElementById('save_interval').innerHTML = last_saved;
    api.publishProject(projectName, true);
    if(! project){
        localUser.storeProjectName(username, projectName);
    }   
}

// Listening to Netsblox actions
function getActions() {
    api.addActionListener(action => {
        console.log(`applied action: ${JSON.stringify(action)}`)
      });
}

async function loggedIn(api){
    const embed_api = api;
    const user = await api.getUsername();
    if(user){
        localUser.storeUser('netsblox-user', user);
        return true;
    }else{
        await sleep(20000);
        loggedIn(embed_api);
    }
    return false;
}

async function intializeAPI() {
    try {
        api = new EmbeddedNetsBloxAPI(ifr_window);

        try {
            const isUser = await loggedIn(api)
            if (isUser){
                if (!document.getElementById("logout")){
                    createLogoutBttn();
                }
                getActions();
            }
        } catch (error) {
            console.log("is user error"+error)
            intializeAPI()
        }
    } catch (error) {
        console.log("api error" +error);
        intializeAPI()
    }  
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createLogoutBttn(){
    const buttn_grp = document.getElementById("bttngrp");
    var logout_bttn = document.createElement('BUTTON');
    logout_bttn.id = "logout";
    logout_bttn.className = "btn btn-lg btn-dark";
    logout_bttn.innerHTML = "Logout";
    buttn_grp.appendChild(logout_bttn);

    logout_bttn.addEventListener('click', ()=> {
        localUser.removeUser('netsblox-user');
        ifr_window.src = `https://login.c2stem.org/index.html?redirect=https://physdev.c2stem.org`;
    })
}

ifr_window.onload = () => {

    if(localUser.getStoredUser("netsblox-user")){
        if (!document.getElementById("logout")){
            createLogoutBttn();
        }
    }else if (document.getElementById("logout")){
        btn = document.getElementById("logout");
        btn.parentNode.removeChild(btn)
    }
}

window.onload = (event) => {
    try{
        intializeAPI();
    }catch(e){
        console.log(e)
    }
  };


// Embedded API

// importing project
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
 
// saving project
const saveBttn = document.getElementById('save');
saveBttn.addEventListener('click', () => {
  saveProject()
});

async function saveProject() {
  const xml = await api.getProjectXML();
  try {
    saveBttn.innerText = 'Processing...'
      await save(xml);
      saveBttn.innerText = 'Save'
  } catch (err) {
    saveBttn.innerText = 'Retrying...'
      setTimeout(saveProject, 500);
  }
}

async function save(projectXML) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:attachment/xml,' + encodeURI(projectXML));
  element.setAttribute('download', "Saved_Project");

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
  
}

// listening to actions
function getActions() {
    api.addActionListener(action => {
        console.log(`applied action: ${JSON.stringify(action)}`)
      });
}

window.onload = (event) => {
    try{
        var ifr_window = document.getElementById("iframe-id");

        api = new EmbeddedNetsBloxAPI(ifr_window);

        getActions();

    }catch(e){
        console.log(e)
    }
  };
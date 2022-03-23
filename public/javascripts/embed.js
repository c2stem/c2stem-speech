document.domain = "c2stem.org";

if (!window.localStorage.getItem("currentProject")) {
  window.localStorage.setItem("currentproject", "Spice-water-runoff");
}

function updateIframe(name) {
  let slothSrc =
      "https://physdev.c2stem.org/?action=present&Username=naveed&ProjectName=template&embedMode&noExitWarning&noRun",
    spiceSrc =
      "https://physdev.c2stem.org/?action=present&Username=naveed&ProjectName=spice-template&embedMode&noExitWarning&noRun";

  try {
    var iframe = document.getElementById("iframe_id");
    if (name == "1D sloth") {
      iframe.setAttribute("src", slothSrc);
      window.localStorage.setItem("currentproject", "1D sloth");
    } else if (name == "Spice-water-runoff") {
      iframe.setAttribute("src", spiceSrc);
      window.localStorage.setItem("currentproject", "spice-water-runoff");
    }
  } catch (error) {
    alert(error.message);
  }
}

function openCode() {
  var currentproject = window.localStorage.getItem("currentproject");
  if (currentproject == "1D sloth") {
    window.open(
      "https://physdev.c2stem.org/?action=present&Username=naveed&ProjectName=template&noExitWarning&noRun",
      "_blank"
    );
  } else if (currentproject == "Spice-water-runoff") {
    window.open(
      "https://physdev.c2stem.org/?action=present&Username=naveed&ProjectName=spice-template&embedMode&noExitWarning&noRun",
      "_blank"
    );
  }
}

function runProject(event) {
  try {
    var iframe = document.getElementById("iframe_id"),
      world = iframe.contentWindow.world,
      ide = world.children[0];
    if (event.shiftKey) {
      ide.toggleFastTracking();
    } else {
      ide.stage.threads.pauseCustomHatBlocks = false;
      ide.runScripts();
      if (ide.embedOverlay) {
        ide.embedOverlay.destroy();
        ide.embedPlayButton.destroy();
      }
    }
    world.worldCanvas.focus();
    refreshFlagButton(ide);
    refreshPauseButton(ide);
  } catch (error) {
    alert(error.message);
  }
}

function refreshFlagButton(ide) {
  var button = document.querySelector(".start-button");
  if (ide.stage.isFastTracked) {
    button.classList.replace("fa-flag", "fa-bolt");
  } else {
    button.classList.replace("fa-bolt", "fa-flag");
  }
}

function togglePauseProject() {
  try {
    var iframe = document.getElementById("iframe_id"),
      world = iframe.contentWindow.world,
      ide = world.children[0];
    ide.togglePauseResume();
    refreshPauseButton(ide);
  } catch (error) {
    alert(error.message);
  }
}

function refreshPauseButton(ide) {
  var button = document.querySelector(".pause-button");
  if (ide.stage.threads.isPaused()) {
    button.classList.replace("fa-pause", "fa-play");
  } else {
    button.classList.replace("fa-play", "fa-pause");
  }
}

function stopProject() {
  try {
    var iframe = document.getElementById("iframe_id"),
      ide = iframe.contentWindow.world.children[0];
    ide.stopAllScripts();
    if (ide.embedOverlay) {
      ide.embedOverlay.destroy();
      ide.embedPlayButton.destroy();
    }
    refreshPauseButton(ide);
  } catch (error) {
    alert(error.message);
  }
}

let authBtton = document.getElementById("auth");
authBtton.addEventListener("click", () => {
  if (authBtton.innerHTML.indexOf("Login") > -1) {
    authBtton.innerHTML = "LogOut";
    login();
  } else if (authBtton.innerHTML.indexOf("LogOut") > -1) {
    authBtton.innerHTML = "Login";
    logout();
  }
});

function login() {
  var username = "naveed";
  var password = "naveed";
  var serverUrl = "https://physdev.c2stem.org";
  var request = new XMLHttpRequest();
  request.open("POST", serverUrl + "/api", true);
  request.withCredentials = true;
  var data = {
    __u: username,
    __h: hex_sha512(password),
  };
  return this._requestPromise(request, data);
}

function _requestPromise(request, data) {
  return new Promise(function (resolve, reject) {
    // stringifying undefined => undefined
    if (data) {
      request.setRequestHeader(
        "Content-Type",
        "application/json; charset=utf-8"
      );
    }
    request.send(JSON.stringify(data));
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status >= 200 && request.status < 300) {
          resolve(request);
        } else {
          var err = new Error(
            request.statusText || "Unsuccessful Xhr response"
          );
          err.request = request;
          reject(err);
        }
      }
    };
  });
}

function logout() {
  var serverUrl = "https://physdev.c2stem.org";
  var request = new XMLHttpRequest();
  request.open("POST", serverUrl + "/api/logout", true);
  request.withCredentials = true;
  return this._requestPromise(request);
}

function isloggedIn() {
  try {
    var iframe = document.getElementById("iframe_id"),
      ide = iframe.contentWindow.world.children[0];
    if (ide.cloud.username) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    alert(error.message);
  }
}

function getData() {
  try {
    var dhButtn = document.getElementById('designHistory');
    var iframe = document.getElementById("iframe_id"),
      ide = iframe.contentWindow.world.children[0];
    var gb = ide.globalVariables;
    var designHistory = gb.getVar("design history");
    var dhContents = designHistory.contents;
    if(!(document.getElementById("closeTable"))){
        createCloseBttn();
    }
    dhButtn.innerHTML = "Refresh Table";
    drawTable(dhContents);
  } catch (error) {
    alert(error.message);
  }
}

google.charts.load("current", { packages: ["table"] });

function drawTable(contents) {
  var data = new google.visualization.DataTable();
  var dhHeaders = contents[0].contents;

  for (let i = 0; i < dhHeaders.length; i++) {
    if( i==0 || i==3 || i==4 || i==5){
        data.addColumn("number", dhHeaders[i]);
    }else{
        data.addColumn("string", dhHeaders[i]);
    }
  }
  for (let j = 1; j < contents.length; j++) {
    data.addRow(contents[j].asArray());
  }
  var table = new google.visualization.Table(document.getElementById("table"));

  table.draw(data, { showRowNumber: true, width: "100%", height: "100%" });
}

function createCloseBttn(){
    var dhButtn = document.getElementById('designHistory');
    const buttngrp = document.getElementById("bttngrp");
    var closebttn = document.createElement('BUTTON');
    closebttn.id = "closeTable";
    closebttn.className = "btn btn-outline-dark";
    closebttn.innerHTML = "Close Table";
    buttngrp.appendChild(closebttn);
    var tabDiv = document.getElementById("table")

    var clickHandler = function(){
        tabDiv.removeChild(tabDiv.firstChild);
        dhButtn.innerHTML="Get Design History"
        closebttn.removeEventListener('click', clickHandler, false);
        closebttn.parentNode.removeChild(closebttn);
    }
    closebttn.addEventListener('click', clickHandler, false)
}
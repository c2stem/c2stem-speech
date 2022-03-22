document.domain = "c2stem.org";

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

let authBtton = document.getElementById("auth")
authBtton.addEventListener('click', () => {
    if(authBtton.innerHTML.indexOf("Login") > -1){
        authBtton.innerHTML = "LogOut"
        login()
    }else if(authBtton.innerHTML.indexOf("LogOut") > -1){
        authBtton.innerHTML = "Login"
        logout()
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
    request.open('POST', serverUrl + '/api/logout', true);
    request.withCredentials = true;
    return this._requestPromise(request);
}

function isloggedIn() {
  try {
    var iframe = document.getElementById("iframe_id"),
      ide = iframe.contentWindow.world.children[0];
    if(ide.cloud.username){
        return true;
    }else{
        return false;
    }
  } catch (error) {
    alert(error.message);
  }
}

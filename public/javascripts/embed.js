
document.domain = "c2stem.org"

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

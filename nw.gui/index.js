'use strict';
const electron = require('@electron/remote')

class window {
  constructor() {
  }
  get() { return this; }
  focus() {
    var window = electron.getCurrentWindow();
    window.focus();
  }
  closeDevTools() {
    var window = electron.getCurrentWindow();
    window.webContents.closeDevTools();
  }
  showDevTools() {
    var window = electron.getCurrentWindow();
    window.webContents.openDevTools();
  }
  isDevToolsOpen() {
    var window = electron.getCurrentWindow();
    return window.webContents.isDevToolsOpened();
  }
    moveBy(x, y) {
    let [x1, y1] = [x || 0, y || 0]
    var window = electron.getCurrentWindow();
    let [x2, y2] = window.getPosition();
    window.setPosition(x2+x1, y2+y1);
  }
  resizeBy(w, h) {
    let [w1, h1] = [w || 0, h || 0]
    var window = electron.getCurrentWindow();
    let [w2, h2] = window.getSize();
    window.setSize(w2+w1, h2+h1);
  }
  moveTo(x, y) {
    let [x1, y1] = [x || 0, y || 0]
    var window = electron.getCurrentWindow();
    window.setPosition(x1, y1);
  }
  enterFullscreen() {
    var window = electron.getCurrentWindow();
    window.setFullScreen(true);
  }
  leaveFullscreen() {
    var window = electron.getCurrentWindow();
    window.setFullScreen(false);
  }
  //minimize
  //blur
  //restore
  on(name, callback) {
    electron.getCurrentWindow().on(name, (e) => {
      callback(e);
    })
  }
}
window.prototype.get = function() {
  return this;
}

class screen {
  constructor() {

  }
  Init() {
  }
  on(name, callback) {
    //displayAdded
    //displayRemoved
    //displayBoundsChanged
  }
}
screen.prototype.Init = function() {}

class menu {
  constructor(name, options) {
  }
  createMacBuiltin(name, options) {
    return new menu();
  }
}
module.exports = {
  Window: window,
  Screen: screen,
  Menu: menu
}
module.exports.Screen.Init = function() {

}
module.exports.Screen.on = function(name, callback) {

}
module.exports.Window.get = function() {
  return new window;
}

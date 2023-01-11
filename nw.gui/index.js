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
    var window = electron.getCurrentWindow();
    let [x1, y1] = window.getPosition();
    window.setPosition(x1+x, y1+y);
  }
  resizeBy(w, h) {
    var window = electron.getCurrentWindow();
    let [w1, h1] = window.getSize();
    window.setSize(w1+w, h1+h);
  }
  moveTo(x, y) {
    var window = electron.getCurrentWindow();
    window.setPosition(x, y);
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
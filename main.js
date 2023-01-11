'use strict';
// Modules to control application life and create native browser window
const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
require('@electron/remote/main').initialize();
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const process = require("process");
const log = require('electron-log');
log.initialize({ preload: true });

let install = false;
//Common paths used throughout the application for consistency/changes
global.mypaths = {};
global.mypaths.app = {};
//armori.app/
global.mypaths.app.package = getPackagePath();
//armori.app/Content/Resources/app/
global.mypaths.app.app = app.getAppPath();
//armori.app/Content/Resources/app/game
global.mypaths.app.game = path.join(global.mypaths.app.app, 'game');
global.mypaths.app.installer = path.join(global.mypaths.app.app, 'installer');
global.mypaths.app.fixes = path.join(global.mypaths.app.app, 'fixes');
//gamefiles
global.mypaths.game = {}
//armori.app/Content/Resources/app/game/js
global.mypaths.game.js = path.join(global.mypaths.app.game, 'js');
global.mypaths.game.libs = path.join(global.mypaths.game.js, 'libs');
Object.freeze(global.mypaths);
log.info(global.mypaths);


async function main() {
  //Add chromium switches from nwjs
  addChromiumSwitches();
  log.info(process.argv);
  //if game files exist then run the game later
  if (await fse.pathExists(path.join(global.mypaths.game.js, 'main.js'))) {
    install = false;
    app.setName("OMORI");
  } else {
    install = true;
    app.setName("armori installer");
  }

  // Quit when all windows are closed
  app.on('window-all-closed', function () {
    app.quit();
  });

  await app.whenReady();
  await createWindow();
  //app.whenReady().then(async () => {
  //  await createWindow();
  //})
}

function getSteamKey() {
  let steamkey = process.argv[1];
  //If testing use environment variable version
  if (!steamkey) steamkey = process.env.DEV_OMORI_STEAMKEY;
  return steamkey;
}

async function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 640,
    height: 480,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      plugins: true,
      spellcheck: false,
      // v8CacheOptions:"none",
      additionalArguments: ["steamkey=" + getSteamKey(), "install=" + install, "root"],
      /// nodeIntegrationInSubFrames: true,
      preload: path.join(global.mypaths.app.app, 'preload.js'),
    }
  });

  addRefreshShortcut();

  require("@electron/remote/main").enable(mainWindow.webContents);
  //run installer
  if (install) {
    await mainWindow.loadFile(path.join(global.mypaths.app.installer, 'index.html'));
  } else {
    //run game
    await mainWindow.loadFile(path.join(global.mypaths.app.game, 'index.html'));
  }

  //mainWindow.webContents.openDevTools();

}

//f5 shortcut to relaunch application
function addRefreshShortcut() {
/*
  globalShortcut.register('f5', function () {
    log.info('f5 is pressed');
    app.relaunch();
    app.quit();
  });

  globalShortcut.register('CommandOrControl+R', function () {
    log.info('CommandOrControl+R is pressed');
    //mainWindow.reload();
    app.relaunch();
    app.quit();
  });
*/
}

//Add chromium switches from nwjs
function addChromiumSwitches() {
  app.commandLine.appendSwitch('--js-flags', '--expose-gc');
  app.commandLine.appendSwitch('limit-fps', 60);
  const args = [
    'in-process-gpu',
    'disable-direct-composition',
    'enable-gpu-rasterization',
    'enable-gpu-memory-buffer-video-frames',
    'enable-native-gpu-memory-buffers',
    'enable-zero-copy',
    'enable-gpu-async-worker-context',
  ];
  for (let arg of args) {
    app.commandLine.appendArgument(arg);
  }
}

function getPackagePath() {
  //if we are in an .app dir
  const p = app.getAppPath();
  let appname = "armori.app";
  let f = p.indexOf(appname);
  console.log(f);
  if (f !== -1) {
    let o = path.join(p.slice(0, f + appname.length));
    console.log(o);
    return o;
  }
  //win/linux?
  //TODO: check pathing
  return path.join(app.getAppPath());
}

main();
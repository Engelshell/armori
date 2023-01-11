'use strict';
const remote = require('@electron/remote');
//const process = remote.process;
const path = require('path');
global.mypaths = remote.getGlobal("mypaths");

const install = window.process.argv.find((f) => f.includes("install=")).split('=')[1];

async function pregame() {
    var greenworks = require(path.join(global.mypaths.game.libs,'greenworks.js'));
}
//polyfill mainModule, direct to game dir instead of app dir
window.process.mainModule = {};
window.process.mainModule.filename = global.mypaths.app.game+'/index.html';

console.log("mainModule");
//console.log(process.mainModule.filename);

//polyfill steamkey
window.nw = {};
window.nw.App = {};
window.nw.App.argv = [];
//console.log(window.process.argv);
let steamkey = window.process.argv.find((f) => f.includes("steamkey="));
steamkey = steamkey.split('=')[1];
window.nw.App.argv.push(steamkey);


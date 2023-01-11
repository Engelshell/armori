'use strict';
/*
 Problem: Game tries to write world number as int and errors
 Cause: Modern nodejs versions of fs no longer coerce integers to strings
 Solution: Wrap write functions to cast to string
*/


const fixstr = `
// armori
// Patch World Save File Writing
DataManager.writeToFileAsyncOriginal = DataManager.writeToFileAsync;
DataManager.writeToFileAsync = function(text, filename, callback) {
    if(typeof text == 'number') { text = text.toString(); }
    DataManager.writeToFileAsyncOriginal(text, filename, callback);
}
// Same as above but for sync version
DataManager.writeToFileOriginal = DataManager.writeToFile;
DataManager.writeToFile = function(text, filename) {
    if(typeof text == 'number') { text = text.toString(); }
    DataManager.writeToFileOriginal(text, filename);
}`;

const path = require('path');
const fs = require('fs');

module.exports = async function(paths) {
    console.log("armori: running fixintwrites");
    const p = path.join(paths.temp.game.js, "main.js");
    const d = await fs.promises.readFile(p, 'utf8');
    //ensure fix isn't already applied
    if(d.includes("armori")) {
        console.log("armori: main.js already has fixintwrites");
    }
    await fs.promises.appendFile(p, fixstr);
}
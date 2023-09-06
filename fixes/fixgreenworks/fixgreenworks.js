'use strict';
/*
 Problem: Greenworks does not load properly
 Cause: original greenworks too old, not built for mac arm
 Solution: use forked version with mac arm support
 //https://github.com/Engelshell/greenworks
*/

const fs = require('fs');
const fse = require('fs-extra');
const path = require('path')

module.exports = async function(paths) {
    console.log("armori: running fixgreenworks");
    const lib1name = "greenworks-osx64.node";
    const file1name = "greenworks.js";
    const origlib1p = path.join(__dirname, lib1name);
    const origfile1p = path.join(__dirname, file1name);
    const newlib1p = path.join(paths.temp.game.libs, lib1name);
    const newfile1p = path.join(paths.temp.game.libs, file1name);

    //overwrite original sdk files for mac
    await fse.copy(origlib1p, newlib1p, {overwrite:true});
    await fse.copy(origfile1p, newfile1p, {overwrite:true});
}
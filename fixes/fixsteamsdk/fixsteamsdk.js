'use strict';
/*
 Problem: original omori steamsdk does not load properly
 Cause: sdk too old, not built for arm
 Solution: use modern (1.55+) steamsdk built for mac arm
*/

const path = require('path');
const util = require('util');
const fs = require('fs');
const fsp = fs.promises;
const fse = require('fs-extra');
const zlib = require('zlib');
const unzip = util.promisify(zlib.unzip);

module.exports = async function(paths) {
    console.log("armori: running steamsdk");

    const newlib1path = path.join(paths.temp.game.libs, "libsdkencryptedappticket"+".dylib");
    const lib1 = await fsp.readFile(path.join(__dirname, "sdk1.gz"));
    await fsp.writeFile(newlib1path, await unzip(lib1));

    const newlib2path = path.join(paths.temp.game.libs, "libsteam_api"+".dylib");
    const lib2 = await fsp.readFile(path.join(__dirname, "sdk2.gz"));
    await fsp.writeFile(newlib2path, await unzip(lib2));
}
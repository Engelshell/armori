'use strict';
/* Game Fixes
   This folder is where fixes to game files go
   Every fix is its own file
   Require that file below to add it to fixes.
   All fixes must export one async function
   See fixintwrites.js for example
*/
const fs = require('fs');
const fse = require('fs-extra');

let fixes = new Array();
module.exports.runfixes = async function(paths) {
    for(let fix of fixes) {
        await fix(paths);
    }
}

//add your fix files below
fixes.push( require('./fixintwrites.js') );
fixes.push( require('./fixsteamsdk/fixsteamsdk.js') );
fixes.push( require('./fixgreenworks/fixgreenworks.js') );









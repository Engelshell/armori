'use strict';
const { dialog, process } = require('@electron/remote');
const log = require('electron-log/renderer');
const fs = require('fs');
const fse = require('fs-extra')
const vdf = require('@node-steam/vdf');
const os = require("os");
const path = require('path');
const { runfixes } = require(path.join(global.mypaths.app.fixes, 'fixes.js'));

let options = {
    type: 'question',
    title: 'Confirmation',
    buttons: ["Yes", "No"],
    message: "Install armori?"
}
let omorierroroptions = {
    type: 'error',
    title: 'Unable to find OMORI install',
    buttons: ["OK"],
    message: "Unable to find OMORI steam installation or armori already installed."
}
const installbutton = document.querySelector("#installbutton");
const installindicator = document.querySelector('#installindicator');

installbutton.addEventListener("click", async () => {
    let omoripath = await findomoriinstall();
    log.info(`installarmori: omori path: ${omoripath}`);
    if (!omoripath) {
        log.error("installarmori: omori install not found or armori already installed.");
        await omorierror();
        return;
    }
    options.message = `Install Omori to\n${omoripath} ?`;
    let resp = await dialog.showMessageBox(options);
    if (resp.response !== 0) { return; }
    
    updateInstallStatus("Installing...");
    await installarmori(omoripath);
    updateInstallStatus("Install Complete");
});


function updateInstallStatus(text) {
    installindicator.innerText = text;
}

function readlibraryfolders(path) {
    const libraryfolderstr = fs.readFileSync(path, 'utf8');
    return vdf.parse(libraryfolderstr)["libraryfolders"];
}

async function omorierror() {
    const resp = await dialog.showMessageBox(omorierroroptions);
}

async function setupPaths(omorip) {
    let p = {};
    //original OMORI.app
    p.orig = {};
    p.orig.app = {};
    p.orig.app.path = path.join(omorip);
    p.orig.app.parentdir = path.dirname(p.orig.app.path);
    p.orig.app.filename = path.parse(p.orig.app.path).name;
    p.orig.app.resources = path.join(p.orig.app.path, "Contents", "Resources");
    p.orig.app.icon = path.join(p.orig.app.resources, 'app.icns');
    p.orig.backup = path.join(p.orig.app.parentdir, p.orig.app.filename + '_backup.app');
    p.orig.app.game = path.join(p.orig.app.resources, "app.nw");
    p.orig.game = {};
    p.orig.game.save = path.join(p.orig.app.game, "save");
    p.orig.game.js = path.join(p.orig.app.game, "js");
    p.orig.game.libs = path.join(p.orig.game.js, "libs");


    //armori_temp.app
    p.temp = {};
    p.temp.app = {};
    p.temp.app.path = path.join(p.orig.app.parentdir, "armori_temp.app");
    p.temp.app.resources = path.join(p.temp.app.path, "Contents", "Resources");
    p.temp.app.assets = path.join(p.temp.app.resources, 'app');
    p.temp.app.game = path.join(p.temp.app.assets, 'game');
    p.temp.app.icon = path.join(p.temp.app.resources, 'electron.icns');
    p.temp.game = {};
    p.temp.game.save = path.join(p.temp.app.game, 'save');
    p.temp.game.js = path.join(p.temp.app.game, 'js');
    p.temp.game.libs = path.join(p.temp.game.js, 'libs');

    return p;
}

async function installarmori(omorip) {
    log.info("installarmori");
    log.info("installarmori: " + omorip);

    const p = await setupPaths(omorip);
    log.info(global.mypaths);
    log.info(p);
    try {
        const chromeTempDir = path.join(os.homedir(), 'Library', 'Application Support', 'OMORI');
        log.info(chromeTempDir);
        const saveBackPath = await findSaveBackupName(p.orig.app.parentdir, 1);
        log.info(saveBackPath);
        await copyAssets(p, saveBackPath, chromeTempDir);
    } catch(e) {
        updateInstallStatus("Error installing. See Log");
        throw e;
    }
    log.info('installarmori: finished install');
}


let findTimes = 0;
async function findSaveBackupName(gamedir, n) {
    //prevent possible infinite loop
    if (findTimes > 100) {
        throw "Could not create a save backup folder, exceeded times";
    }
    findTimes++;
    let f = path.join(gamedir, `save_backup_${n}`);
    //if exists, recurse and try again
    if (await fse.pathExists(f)) {
        n++;
        f = await findSaveBackupName(gamedir, n);
    }

    return f;
}

async function cleanup(p) {
    log.info('cleanup: remove armori_temp.app if exists');
    if (await fse.pathExists(p.temp.app.path)) await fs.promises.rm(p.temp.app.path, { recursive: true, force: true });
}

async function copyAssets(p, saveBackPath, chromeTempDir) {
    await cleanup(p);

    updateInstallStatus("Copying mod package");
    log.info('copyAssets: copying armori.app to OMORI dir as armori_temp.app');
    await fse.copy(global.mypaths.app.package, p.temp.app.path, { overwrite: true, recursive: true });
    
    log.info('copyAssets: copying save into armori_temp.app');
    if (await fse.pathExists(p.orig.game.save)) {
        await fse.copy(p.orig.game.save, p.temp.game.save, { overwrite: false, recursive: true });
    }

    log.info('icopyAssets: copying icon into armori_temp.app');
    await fse.copy(p.orig.app.icon, p.temp.app.icon, { overwrite: true });

    updateInstallStatus("Installing - Copying assets...");
    log.info('copyAssets: copying game assets into armori_temp.app');
    await fse.copy(p.orig.app.game, p.temp.app.game, { overwrite: false, recursive: true });

    log.info('copyAssets: runfixes');
    updateInstallStatus("Installing - Applying Fixes...");
    await runfixes(p);

    log.info('copyAssets: delete chromium temp dir');

    if (await fse.pathExists(chromeTempDir)) await fs.promises.rm(chromeTempDir, { recursive: true, force: true });
    log.info("copyAssets: backing up OMORI saves: " + p.orig.game.save + " to " + saveBackPath);
    if (await fse.exists(p.orig.game.save)) {
        await fse.copy(p.orig.game.save, saveBackPath, { overwrite: false, recursive: true });
    }
    log.info("copyAssets: remove OMORI.app");
    await fs.promises.rm(p.orig.app.path, { recursive: true, force: true });

    log.info("copyAssets: rename armori_temp.app to OMORI.app");
    await fse.rename(p.temp.app.path, p.orig.app.path);

    await cleanup(p);
}

async function findomoriinstall() {
    //read steam library folder paths
    //a user could have a steam library in different locations
    const libraryfolderspath = path.join(os.homedir(),
        'Library', 'Application Support', 'Steam', 'config', 'libraryfolders.vdf');

    const libraryfolders = readlibraryfolders(libraryfolderspath);

    //loop through game library folders and check if OMORI.app exists
    //When Steam uninstalls a game it only removes the game files,
    //it does not delete the .app because it is just a directory
    //therefore detect install
    for (let num in libraryfolders) {
        const values = libraryfolders[num];
        const omorip = path.join(values.path, 'steamapps', 'common', 'OMORI', 'OMORI.app');
        const appnw = path.join(omorip, 'Contents', 'Resources', 'app.nw');
        if (!await fse.pathExists(omorip) || !await fse.pathExists(appnw)) {
            continue
        }

        return omorip;
    }

    return null;
}
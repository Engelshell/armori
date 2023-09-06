const util = require("node:util");
const {exec} = require("node:child_process");
const nodepath = require("node:path");
const execP = util.promisify(exec);

signList = {
    "darwin": [
        `armori.app/Contents/Resources/app/fixes/fixgreenworks/greenworks-osx64.node`,
        `armori.app/Contents/Frameworks/Electron Framework.framework/Libraries/libEGL.dylib`,
        `armori.app/Contents/Frameworks/Electron Framework.framework/Libraries/libffmpeg.dylib`,
        `armori.app/Contents/Frameworks/Electron Framework.framework/Libraries/libGLESv2.dylib`,
        `armori.app/Contents/Frameworks/Electron Framework.framework/Libraries/libvk_swiftshader.dylib`,
        `armori.app/Contents/Frameworks/Electron Framework.framework/Helpers/chrome_crashpad_handler`,
        `armori.app/Contents/Frameworks/Electron Framework.framework/Electron Framework`,
        `armori.app/Contents/Frameworks/Mantle.framework/Mantle`,
        `armori.app/Contents/Frameworks/ReactiveObjC.framework/ReactiveObjC`,
        `armori.app/Contents/Frameworks/Squirrel.framework/Resources/ShipIt`,
        `armori.app/Contents/Frameworks/Squirrel.framework/Squirrel`,
        `armori.app/Contents/Frameworks/armori Helper (Renderer).app`,
        `armori.app/Contents/Frameworks/armori Helper (Renderer).app`,
        `armori.app/Contents/Frameworks/armori Helper (Plugin).app`,
        `armori.app/Contents/Frameworks/armori Helper (GPU).app`,
        `armori.app/Contents/Frameworks/armori Helper.app`,
        `armori.app/Contents/MacOS/nwjs`
    ]
};

module.exports = {
    preMake: async (forgeConfig, options) => {
        const appPath = "./out/beta/armori-darwin-arm64/";
        for(let signPath of signList.darwin) {
            const rPath = nodepath.resolve(nodepath.join(appPath, signPath));
            
            //--options runtime //breaks build
            const execPOut = await execP(`codesign --verbose=4 --force --entitlements './entitlements.plist' --sign "armori - engelshell/armori" "${rPath}"`);
        }
    }
}

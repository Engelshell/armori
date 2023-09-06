const { utils: { fromBuildIdentifier } } = require('@electron-forge/core');
const {preMake} = require('./preMake.js');
const packageJson = require("./package.json");

const signingKeyAuthority = "armori - engelshell/armori"

// forge.config.js
module.exports = {
  buildIdentifier: 'beta',
  hooks: {
    preMake: preMake
  },
  packagerConfig: {
    name: "armori",
    appBundleId: fromBuildIdentifier({ beta: 'com.armori.app', prod: 'armori.app' }),
    //steam expects nwjs executable
    executableName: "nwjs",
    appCopyright: "MIT-0 MIT No Attribution",
    icon: "./icon.icns",
    electronVersion: '26.0.0',
    junk:true,
    overwrite:true,
    prune:true,
    appCategoryType: "public.app-category.games",
    platform:['darwin'],
    arch:['arm64']
  },
  makers: [
    {
      name: '@electron-forge/maker-dmg',
      platforms: [ "darwin" ],
      arch: [ 'arm64' ],
      config: {
        //could also symlink
        title: "armori",
        icon: "./icon.icns",
        //background: './assets/dmg-background.png',
        format: 'ULFO',
        overwrite:true
      }
    }

  ]
};
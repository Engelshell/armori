// forge.config.js
module.exports = {
  //...
  packagerConfig: {
    icon: "./icon.icns",
    executableName: "nwjs",
    electronVersion: '22.0.0',
    junk:true,
    overwrite:true,
    platform:'darwin',
    arch:'arm64'
  },
  makers: [
    {
      name: '@electron-forge/maker-dmg',
      platforms: [
        "darwin"
      ],
      arch: [
        'arm64'
      ],
      config: {
        //steam expects nwjs executable
        //could also symlink
        title: "armori",
        icon: "./icon.icns",
        //background: './assets/dmg-background.png',
        format: 'ULFO'
      }
    }
    /*
    {
      // Path to the icon to use for the app in the DMG window
      name: '@electron-forge/maker-zip',
      platforms: [
        "darwin"
      ],
      config: {
        icon: "./icon.icns",
        options: {
          icon: "./icon.icns"
        }
      }
    }*/

  ]
};
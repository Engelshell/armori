#  armori - Alpha v1.0.9
## Unofficial mod to OMORI for Apple Silicon Macs

armori modifies OMORI so it can run on M1/2 Apple Silicon macs.

This mod will likely become unnecessary in the future when the game is officially fixed.

Alpha Quality software, there are likely bugs.

![installer image](image.png)

## Download
Latest release: [armori-1.0.8-arm64.dmg](https://github.com/Engelshell/armori/releases/download/v1.0.8-alpha.1/armori-1.0.8-arm64.dmg)


## Install
Double click does not work! You must follow this:
<img src="open.png" alt="open image" width="800px">
![open image]()
Right or two-finger click on armori.app, select 'open'.

## Support
Do not contact OMORI for support if you have this mod installed.

Uninstall and Reinstall OMORI through steam to remove this mod.

Post an issue here on Github if you run into issues.

[Discord Link](https://discord.gg/bJYqHRAg7A)

## Mods
Does not currently support oneloader. Oneloader does its own modifications and expects nwjs.

## License
[MIT No Attribution](LICENSE.md)

By using this software you agree to the license.

## Signing
Armori is self signed with key identity `armori - engelshell/armori`. 

## Technical Details
- Full port of all components to apple silicon
- Ports from nwjs to Electron V26
- Greenworks compiled to apple silicon
- Steam SDK with apple silicon used
- Polyfill for nw.gui to electron
- Various fixes/wrappers to fix deprecated functionality

Looking to eventually port to other arm platforms

## TODO:

- Update nw.gui wrapper to include more functionality and correctness
- Rewrite installer as standalone app
- profile and discover potential performance issues caused by synchronous IPC.
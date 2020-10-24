# dryco

Dryco is an vscode extension which allows a new to programming user to write their code like a pro.

## Features

Dryco makes your code more DRY(Don't Repeat Yourself), reliable and readable by shifting all reapeated blocks of code into one file and importing them in our targel file and using them, this save us lots of size.

<!-- For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow. -->

<!-- ## Requirements
To install all npm dependencies and packages, run thin command on console:
> npm install -->

## Running Extension

After cloning this repo, open it in VSCode and install all npm dependencies or packages by running these commands on console:


> npm install

> npm run compile

After installing the required dependencies press `F5 key` and type `VS Code Extension Development` in search bar and press `enter key`.

Above actions will open an extention development environment and can be used to test all features of this extention.

To run extension press `CTRL+SHIFT+P` and type `Detect Clone`, this command will detect repeated blocks of code and represent it by underlining(in yellow color).

On hovering your courser above the highlighted code, it will tell user the locations of repeated code blocks(i.e. line number and file name).

On hovering your courser above the highlighted code, user also encounters `quick fix` option which on clicking creates a folder `dryco`(folder name) in the root directory of current project and move all repeated blocks of code in current file to the `utilFunctions.js` file in `dryco` folder and then exporting it from there.

<!-- ## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension. -->

<!-- ## Release Notes

Currently there is only one feature -->

### 1.0.0

Initial release of dryco

-----------------------------------------------------------------------------------------------------------
**Happy Hacking!**

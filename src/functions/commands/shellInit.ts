import _shell from "shelljs";

const shell: typeof _shell = window.require("shelljs");
const os = window.require('os');
const isMac = os.platform() === "darwin";

shell.config.execPath = String(shell.which("node"));

if (isMac) {
	console.log("mac detected");
	console.log(process.env);
	// Fix not detecting symlinks on mac
} else {
	console.log("not mac");
	// TODO: do windows related shell related init here
}

export const getShell = () => shell;

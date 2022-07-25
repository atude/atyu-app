import { Dispatch, SetStateAction } from "react";
import _shell, { ExecOptions } from "shelljs";
import _os from "os";
import _path from "path";

const shell: typeof _shell = window.require("shelljs");
const os: typeof _os = window.require("os");
const path: typeof _path = window.require("path");

const isMac = os.platform() === "darwin";
// const winNodePath = path.join("C:", "Program Files", "nodejs", "node.exe");
const winQmkShellPath = path.join("C:", "QMK_MSYS", "shell_connector.cmd");

// Fix mac path
if (isMac) {
	shell.env["PATH"] = "~/.bin/:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin";
}

shell.config.execPath = String(shell.which("node"));

console.log("shell.config.execPath: " + shell.config.execPath);
console.log("shell env path: " + shell.env["PATH"]);
// console.log("winnodepath: " + winNodePath);
console.log("is mac?: " + isMac);
console.log("node: " + shell.which("node"));

export const shellExecOptions: ExecOptions & { async: true } = {
	async: true,
	// Specify QMK MSYS shell on windows. Use default shell on mac
	shell: isMac ? shell.env["SHELL"] : winQmkShellPath,
	silent: true,
};

export const checkPrereqs = () => {
	if (isMac) {
		return shell.which("git") && shell.which("qmk");
	} else {
		// Test that the qmk msys file exists instead
		return shell.test("-f", winQmkShellPath);
	}
};

// Add log in reverse order for printing purposes
export const updateLog = (setLog: Dispatch<SetStateAction<string[]>>, dataString: string) => {
	setLog((existingLog) => [dataString, ...existingLog]);
	console.log(dataString);
};

export const killCmd = (shellCmd: any) => {
	shellCmd.stdout.destroy();
	shellCmd.stderr.destroy();
	shellCmd.kill("SIGINT");
};

export default shell;

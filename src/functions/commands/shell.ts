import { Dispatch, SetStateAction } from "react";
import _shell, { ExecOptions } from "shelljs";
import _os from "os";
import _path from "path";

const shell: typeof _shell = window.require("shelljs");
const os: typeof _os = window.require("os");
const path: typeof _path = window.require("path");

const winQmkShellPath = path.join("C:", "QMK_MSYS", "shell_connector.cmd");

export const isMac = os.platform() === "darwin";

// Fix mac path
if (isMac) {
	shell.env["PATH"] = "~/.bin/:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/opt/homebrew/bin";
}

// If we want to use a specific node instance: 
// shell.config.execPath = String(shell.which("node"));
console.log("shell env path: " + shell.env["PATH"]);
console.log("is mac?: " + isMac);
console.log("node: " + shell.which("node"));
console.log("shell: " + shell.env["SHELL"]);

export const shellExecOptions: ExecOptions & { async: true } = {
	async: true,
	// Specify QMK MSYS shell on windows. Use default shell on mac
	shell: isMac ? shell.env["SHELL"] : winQmkShellPath,
	silent: true,
};

export const checkPrereqs = async () => {
	if (isMac) {
		// Test git and qmk exists
		return shellRun("which git && which qmk");
	} else {
		// Test that the qmk msys file exists instead
		return shellRun("true");
	}
};

// Add log in reverse order for printing purposes
export const updateLog = (setLog: Dispatch<SetStateAction<string[]>>, dataString: string) => {
	setLog((existingLog) => [`=> ${dataString}`, ...existingLog]);
	console.log(dataString);
};

export const killAsyncCmd = (shellCmd: any) => {
	shellCmd.stdout.destroy();
	shellCmd.stderr.destroy();
	shellCmd.kill("SIGINT");
};

// Alternatives for windows without needing dedicated msys shell
export const osCommands = {
	cat: (file: string) => `${isMac ? "cat" : "type"} ${file}`,
  // TODO: might need to escape chars like double quote on mac
	// needs verification on windows
	echoTo: (str: string, outputFile: string) => isMac ? 
		`echo "${str}" > ${outputFile}` :
		`echo "${str}"> ${outputFile}`,
	testFile: (path: string) => isMac ? 
		`test -f ${path}` :
		`type ${path}`, // `type` should fail on win32 when file dont exist
}

type ShellOutput = {
	success: boolean;
	code: number;
	stdout?: string;
	stderr?: string;
	pid?: number;
}

// Run a shell command in sync but with async.
export const shellRun = (command: string, dontUseQmkShell?: boolean) => new Promise<ShellOutput>((resolve) => {
	setTimeout(() => {
		resolve({
			success: false,
			code: -1,
			stderr: "Command timed out",
			pid: -1,
		});
	}, 600000 /* 600s */);

	const stdout: string[] = [];
	const stderr: string[] = [];
	const exec = shell.exec(command, {
		...shellExecOptions,
		// Dont use QMK MSYS shell on windows if flag
		...(dontUseQmkShell && !isMac && { shell: undefined })
	});
	if (!exec?.pid) {
		// couldnt get shell here
		resolve({
			success: false,
			code: -69,
			pid: undefined,
		});
	}
	exec.stdout?.on("data", data => stdout.push(data));
	exec.stderr?.on("data", data => stderr.push(data));
	exec.on("close", data => {
		// console.log(Number(data), stdout.join("\n"), stderr.join("\n"));
		resolve({
			success: Number(data) === 0,
			code: Number(data),
			stdout: stdout.length ? stdout.join("\n") : undefined,
			stderr: stderr.length ? stderr.join("\n") : undefined,
			pid: exec?.pid,
		});
	});
});

export default shell;

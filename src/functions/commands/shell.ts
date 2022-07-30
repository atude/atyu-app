import { Dispatch, SetStateAction } from "react";
import _shell, { ExecOptions } from "shelljs";
import _os from "os";
import _fs from "fs";
import _path from "path";

const shell: typeof _shell = window.require("shelljs");
const os: typeof _os = window.require("os");
const fs: typeof _fs = window.require("fs");
const path: typeof _path = window.require("path");

type ShellOutput = {
  success: boolean;
  code: number;
  stdout?: string;
  stderr?: string;
  pid?: number;
};

const winQmkShellPath = path.join("C:", "QMK_MSYS", "shell_connector.cmd");

export const isMac = os.platform() === "darwin";
export const homeDir = os.homedir();

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
  // Regex to remove ANSI colouring
  setLog((existingLog) => [
    // eslint-disable-next-line no-control-regex
    `=> ${dataString.toString().replace(/\u001b[^m]*?m/g, "")}`,
    ...existingLog,
  ]);
  console.log(dataString);
};

export const killAsyncCmd = (shellCmd: any) => {
  shellCmd.stdout.destroy();
  shellCmd.stderr.destroy();
  shellCmd.kill("SIGINT");
};

export const nodeCommands = {
  fileExists: (filepath: string): ShellOutput => {
    try {
      if (fs.existsSync(filepath)) {
        return { success: true, code: 0 };
      }
      return { success: false, code: -1 };
    } catch (e) {
      console.log(e);
      return { success: false, code: -1 };
    }
  },
  readJsonFile: (filepath: string): ShellOutput => {
    try {
      const file = fs.readFileSync(filepath);
      const stdout = JSON.parse(file.toString());
      return { success: true, code: 0, stdout };
    } catch (e) {
      console.log(e);
      return { success: false, code: -1 };
    }
  },
  saveToFile: (str: string, filePath: string): ShellOutput => {
    try {
      fs.writeFileSync(filePath, str);
      return { success: true, code: 0 };
    } catch (e) {
      console.log(e);
      return { success: false, code: -1 };
    }
  },
  rmDir: (filePath: string): ShellOutput => {
    try {
      fs.rmSync(filePath, { recursive: true, force: true });
      return { success: true, code: 0 };
    } catch (e) {
      console.log(e);
      return { success: false, code: -1 };
    }
  },
};

// Run a shell command in sync but with async. Prevents requirement of external Node
// when in Electron.
export const shellRun = (command: string) =>
  new Promise<ShellOutput>((resolve) => {
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
    const exec = shell.exec(command, shellExecOptions);
    if (!exec?.pid) {
      // couldnt get shell here
      resolve({
        success: false,
        code: -69,
        pid: undefined,
      });
    }
    exec.stdout?.on("data", (data) => stdout.push(data));
    exec.stderr?.on("data", (data) => stderr.push(data));
    exec.on("close", (data) => {
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

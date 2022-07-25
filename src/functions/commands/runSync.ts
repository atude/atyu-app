import { FlashState } from "../../constants/types/flashState";
import { AppContext } from "../../controllers/context/appContext";
import { atyuQmkDir } from "../path";
import runVerify from "./runVerify";
import shell, { shellExecOptions, updateLog } from "./shell";

// Pull updates from repo
const runSync = (appContext: AppContext) => {
  const {
    setLog,
    setFlashState,
		setDoingTask,
  } = appContext;
	let alreadyUpdated = false;
	setFlashState(FlashState.UPDATING, "Checking for updates");

	if (shell.cd(atyuQmkDir).code !== 0) {
		return setFlashState(FlashState.ERROR, "Failed to pull updates; something wrong with git?");
	}

	setDoingTask(true);
	const pullCmd = shell.exec("git pull", shellExecOptions);

	pullCmd.stdout?.on("data", (data: any) => {
		const dataString = data.toString();
		updateLog(setLog, dataString);
		if (dataString.includes("Already up to date.")) {
			alreadyUpdated = true;
		}
		if (dataString.includes("Updating")) {
			setFlashState(FlashState.UPDATING, "Downloading updates from atude/qmk_firmware");
		}
	});
	pullCmd.stderr?.on("data", (data: any) => updateLog(setLog, data.toString()));
  pullCmd.on("close", (code: any) => {
		setDoingTask(false);
		if (Number(code) !== 0) {
			setFlashState(FlashState.ERROR, "Failed to check for updates");
			return;
		}
		if (alreadyUpdated) {
			return setFlashState(FlashState.DONE, "Already up to date");
		}
		setFlashState(FlashState.DONE, "Successfully updated Atyu QMK");
		return runVerify(appContext);
	});
};

export default runSync;

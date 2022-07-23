import { ShellString } from "shelljs";
import { AppReadyState } from "../../constants/types/appReadyState";
import { FlashState } from "../../constants/types/flashState";
import { AppContext } from "../../controllers/context/appContext";
import { atyuDir, atyuQmkDir } from "../path";
import { getShell, updateLog } from "./helpers";

// First time setup
const runSetup = (appContext: AppContext): void => {
  const { setLog, setFlashState, setFlashMessage, setAppReadyState } = appContext;
  const shell = getShell();

  const checkCommand = (cmd: ShellString, errMsg?: string) => {
    updateLog(setLog, cmd?.stdout || cmd?.stderr || "");
    if (cmd.code !== 0) {
      setFlashState(FlashState.ERROR, errMsg);
    }
    return cmd.code === 0;
  };

	// Check for git and qmk existence
	if (!shell.which("git") || !shell.which("qmk")) {
		updateLog(setLog, "which git/qmk failed.");
		setFlashState(FlashState.ERROR, "Couldn't find git or qmk (required for Atyu)");
		return setAppReadyState(AppReadyState.NOT_READY);
	}

  setAppReadyState(AppReadyState.LOADING);
  setFlashState(FlashState.RUNNING_SETUP, "Replacing any existing installations");

  if (shell.test("-d", atyuQmkDir)) {
    // Found existing atude/qmk_firmware, so delete qmk files here. Stops the
    // bug where 'qmk setup' will repeatedly install nested 'qmk_firmware' folders.
    // Also assures clean installs.
    updateLog(setLog, `Found existing Atyu QMK folder. Deleting ${atyuQmkDir}`);
    if (
      !checkCommand(shell.rm("-rf", atyuQmkDir), "Couldn't delete existing Atyu QMK installation")
    ) {
      return;
    }
  }

  // Make dir
  setFlashMessage("Creating Atyu files");
  if (!checkCommand(shell.mkdir("-p", atyuDir), "Couldn't create folder for setup")) return;
  updateLog(setLog, `Successfully created ${atyuDir}`);

  // Cd into dir
  if (!checkCommand(shell.cd(atyuDir), "Couldn't go into Atyu folder")) return;
  updateLog(setLog, `Successfully moved into ${atyuDir}`);

  // Setup atude/qmk_firmware
  setFlashMessage("Downloading and setting up Atyu QMK (this can take a few minutes)");
  const setupQmkCmd = shell.exec(`qmk setup atude/qmk_firmware --home ./qmk_firmware --yes`, {
    async: true,
  });

  setupQmkCmd.stdout.on("data", (data: any) => updateLog(setLog, data.toString()));
  setupQmkCmd.stderr.on("data", (data: any) => updateLog(setLog, data.toString()));
  setupQmkCmd.on("close", (code: any) => {
    updateLog(setLog, `Finished with code ${Number(code)}`);
    if (Number(code) === 0) {
      updateLog(setLog, "Successfully ran qmk setup (using atude/qmk_firmware)");

      // Do a test build using `satisfaction75`
      if (!checkCommand(shell.cd(atyuQmkDir), "Couldn't go into Atyu QMK folder")) return;

      setFlashMessage(
        "Verifying installation by building test firmware (this can *also* take a few minutes)"
      );
      const testBuildCmd = shell.exec("qmk compile -kb cannonkeys/satisfaction75/rev1 -km via", {
        async: true,
      });
      testBuildCmd.stdout.on("data", (data: any) => updateLog(setLog, data.toString()));
      testBuildCmd.stderr.on("data", (data: any) => updateLog(setLog, data.toString()));
      testBuildCmd.on("close", (code: any) => {
        updateLog(setLog, `Finished with code ${Number(code)}`);
        if (Number(code) === 0) {
          setAppReadyState(AppReadyState.READY);
          setFlashState(FlashState.DONE);
          updateLog(setLog, "Successfully built test firmware [satisfaction75]");
        } else {
          setFlashState(FlashState.ERROR, "Failed to build test firmware");
        }
      });
    } else {
      setFlashState(FlashState.ERROR, "Failed to setup atude/qmk_firmware environment");
    }
  });

  return;
};

export default runSetup;

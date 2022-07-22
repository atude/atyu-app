import { AppReadyState } from "../../constants/types/appReadyState";
import { FlashState } from "../../constants/types/flashState";
import { AppContext } from "../../controllers/context/appContext";
import { atyuHomeConfigFile } from "../shellHelpers";
import { getShell, updateLog } from "./helpers";

// Runs whenever app opens. Checks everything is fine.
const runVerify = (appContext: AppContext): void => { 
	const { setLog, setFlashState, setFlashMessage, setAppReadyState } = appContext;
	const shell = getShell();
	setAppReadyState(AppReadyState.LOADING);

  // Check for git and qmk existence
  if (!shell.which("git")) {
		updateLog(setLog, "which git failed.");
    setFlashState(FlashState.ERROR);
    setFlashMessage("Couldn't find git (required for Atyu)");
    return;
  }
  if (!shell.which("qmk")) {
		updateLog(setLog, "which qmk failed.");
    setFlashState(FlashState.ERROR);
    setFlashMessage("Couldn't find qmk (required for Atyu)");
    return;
  }

	const homeConfig = shell.test("-f", atyuHomeConfigFile);
	if (!homeConfig) {
		updateLog(setLog, `Couldnt find ${atyuHomeConfigFile}.`);
		return setAppReadyState(AppReadyState.NOT_READY);
	}
	updateLog(setLog, `Found ${atyuHomeConfigFile}!`);

	// TODO: Load required config files

	// Done (Looks weird without some delay)
	setTimeout(() => setAppReadyState(AppReadyState.READY), 1000);
};

export default runVerify;
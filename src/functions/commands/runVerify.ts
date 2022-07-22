import { AtyuConfig, AtyuConfigMap, zAtyuConfig } from "../../configs/atyuConfig";
import { KeyboardsConfig, zKeyboardsConfig } from "../../configs/keyboardConfig";
import { AppReadyState } from "../../constants/types/appReadyState";
import { FlashState } from "../../constants/types/flashState";
import { AppContext } from "../../controllers/context/appContext";
import { atyuHomeConfigFilePath, atyuKeyboardConfigFilename, atyuQmkDir } from "../shellHelpers";
import { getShell, updateLog } from "./helpers";

// Runs whenever app opens. Checks everything is fine.
const runVerify = (appContext: AppContext): void => {
  const { setLog, setKeyboardsConfig, setAtyuConfigMap, setFlashState, setFlashMessage, setAppReadyState } =
    appContext;
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

  const homeConfigExists = shell.test("-f", atyuHomeConfigFilePath);
  if (!homeConfigExists) {
    updateLog(setLog, `Couldnt find ${atyuHomeConfigFilePath}.`);
    return setAppReadyState(AppReadyState.NOT_READY);
  }
  updateLog(setLog, `Found ${atyuHomeConfigFilePath}!`);

  // Attempt load required home config file, then attempt load every child config file
  // Maybe the child configs can be loaded on a keyboard selection basis to isolate
  // issues across all of Atyu if one keyboard has a bad config.
  try {
    updateLog(setLog, "Parsing JSON...");
    const atyuHomeJson = JSON.parse(shell.cat(atyuHomeConfigFilePath).stdout);
    updateLog(setLog, "Validating JSON...");
    const keyboardsConfig = zKeyboardsConfig.parse(atyuHomeJson);
    updateLog(setLog, "Setting config...");
    setKeyboardsConfig(keyboardsConfig);

    const atyuConfigMap: AtyuConfigMap = Object.values(keyboardsConfig).reduce(
      (configsMap, keyboardConfig) => {
        const configPath = `${atyuQmkDir}${keyboardConfig.dir}${atyuKeyboardConfigFilename}`;
        const atyuConfigJson = JSON.parse(shell.cat(configPath).stdout);
        const atyuConfig = zAtyuConfig.parse(atyuConfigJson);
        updateLog(setLog, `Loaded config for ${keyboardConfig.key} from ${configPath}`);
        return { ...configsMap, [keyboardConfig.key]: atyuConfig };
      },
      {}
    );

		setAtyuConfigMap(atyuConfigMap);
    // Add delay cause looks weird without it
		// Could be removed once a lot more keyboards added
    setTimeout(() => setAppReadyState(AppReadyState.READY), 1000);
  } catch (e: any) {
    updateLog(setLog, e?.toString() ?? "error occured while parsing JSON");
    setAppReadyState(AppReadyState.NOT_READY);
  }
};

export default runVerify;

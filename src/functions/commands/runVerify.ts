import { AtyuConfigMap, zAtyuConfig } from "../../configs/atyuConfig";
import { zKeyboardsConfig } from "../../configs/keyboardConfig";
import { AppReadyState } from "../../constants/types/appReadyState";
import { FlashState } from "../../constants/types/flashState";
import { AppContext } from "../../controllers/context/appContext";
import { atyuHomeConfigFilePath, atyuKeyboardConfigFilename, atyuQmkDir } from "../path";
import shell, { updateLog, checkPrereqs } from "./shell";

// Runs whenever app opens. Checks everything is fine.
const runVerify = (appContext: AppContext): void => {
  const {
    setLog,
    setKeyboardsConfig,
    setAtyuConfigMap,
    setFlashState,
    setAppReadyState,
  } = appContext;
  setAppReadyState(AppReadyState.LOADING);

  if (!checkPrereqs()) {
    updateLog(setLog, `which git/qmk failed`);
    setFlashState(FlashState.ERROR, "Couldn't find git or qmk (required for Atyu)");
    return setAppReadyState(AppReadyState.NOT_READY);
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
		setFlashState(FlashState.ERROR, "There were issues trying to read the config files");
    setAppReadyState(AppReadyState.NOT_READY);
  }
};

export default runVerify;

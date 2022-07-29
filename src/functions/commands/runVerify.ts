import { AtyuConfigMap, zAtyuConfig } from "../../configs/atyuConfig";
import { zKeyboardsConfig } from "../../configs/keyboardConfig";
import { AppReadyState } from "../../constants/types/appReadyState";
import { FlashState } from "../../constants/types/flashState";
import { AppContext } from "../../controllers/context/appContext";
import { atyuHomeConfigFilePath, atyuKeyboardConfigFilename, atyuQmkDir, pathOf } from "../path";
import { updateLog, checkPrereqs, shellRun, osCommands } from "./shell";

// Runs whenever app opens. Checks everything is fine.
const runVerify = async (appContext: AppContext): Promise<void> => {
  const {
    setLog,
    setKeyboardsConfig,
    setAtyuConfigMap,
    setFlashState,
    setAppReadyState,
  } = appContext;
  setAppReadyState(AppReadyState.LOADING);

	const hasPrereqs = await checkPrereqs();
  if (!hasPrereqs.success) {
    updateLog(setLog, `Couldn't find QMK installed, or QMK is installed in an unknown directory`);
    setFlashState(FlashState.ERROR, "Couldn't find QMK (required for Atyu)");
    return setAppReadyState(AppReadyState.NOT_READY);
  }

  const homeConfigExists = await shellRun(osCommands.testFile(pathOf(atyuHomeConfigFilePath)), true);
  if (!homeConfigExists.success) {
    updateLog(setLog, `Couldn't find ${atyuHomeConfigFilePath}.`);
    return setAppReadyState(AppReadyState.NOT_READY);
  }
  updateLog(setLog, `Found ${atyuHomeConfigFilePath}!`);

  // Attempt load required home config file, then attempt load every child config file
  // Maybe the child configs can be loaded on a keyboard selection basis to isolate
  // issues across all of Atyu if one keyboard has a bad config.
  try {
    updateLog(setLog, "Parsing JSON...");
		const atyuHomeJsonOutput = await shellRun(osCommands.cat(pathOf(atyuHomeConfigFilePath)), true);
		if (!atyuHomeJsonOutput.success || !atyuHomeJsonOutput.stdout) {
			throw Error("Couldn't process home json");
		}
		updateLog(setLog, "output:");
		updateLog(setLog, atyuHomeJsonOutput.stdout);
    const atyuHomeJson = JSON.parse(atyuHomeJsonOutput.stdout);
    updateLog(setLog, "Validating JSON...");
    const keyboardsConfig = zKeyboardsConfig.parse(atyuHomeJson);
    updateLog(setLog, "Setting config...");
    setKeyboardsConfig(keyboardsConfig);

		let atyuConfigMap: AtyuConfigMap = {};
    for (const keyboardConfig of Object.values(keyboardsConfig)) {
			const configPath = `${atyuQmkDir}${keyboardConfig.dir}${atyuKeyboardConfigFilename}`;
			const atyuConfigJsonOutput = await shellRun(osCommands.cat(pathOf(configPath)), true);
			if (!atyuConfigJsonOutput.success || !atyuConfigJsonOutput.stdout) {
				throw Error(`Couldn't process config json for ${atyuKeyboardConfigFilename}`);
			}
			updateLog(setLog, `Config for ${keyboardConfig.key}:`);
			updateLog(setLog, atyuConfigJsonOutput.stdout);
			const atyuConfigJson = JSON.parse(atyuConfigJsonOutput.stdout);
			const atyuConfig = zAtyuConfig.parse(atyuConfigJson);
			updateLog(setLog, `Loaded config for ${keyboardConfig.key} from ${configPath}`);
			atyuConfigMap[keyboardConfig.key] = atyuConfig;
		};

    setAtyuConfigMap(atyuConfigMap);
    // Add delay cause looks weird without it
    // Could be removed once a lot more keyboards added
    setTimeout(() => setAppReadyState(AppReadyState.READY), 1000);
  } catch (e: Error | any) {
    updateLog(setLog, e?.message ?? e?.toString() ?? "error occured while parsing JSON");
		setFlashState(FlashState.ERROR, "There were issues trying to read the config files");
    setAppReadyState(AppReadyState.NOT_READY);
  }
};

export default runVerify;

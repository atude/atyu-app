import { AtyuConfigMap, zAtyuConfig } from "../../configs/atyuConfig";
import { zKeyboardsConfig } from "../../configs/keyboardConfig";
import { AppReadyState } from "../../constants/types/appReadyState";
import { FlashState } from "../../constants/types/flashState";
import { AppContext } from "../../controllers/context/appContext";
import { atyuHomeConfigFilePath, atyuKeyboardConfigFilename, atyuQmkDir, pathOf } from "../path";
import { updateLog, checkPrereqs, nodeCommands } from "./shell";

// Runs whenever app opens. Checks everything is fine and loads files.
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

  const homeConfigExists = nodeCommands.fileExists(pathOf(atyuHomeConfigFilePath));
  if (!homeConfigExists.success) {
    updateLog(setLog, `Couldn't find ${pathOf(atyuHomeConfigFilePath)}.`);
    return setAppReadyState(AppReadyState.NOT_READY);
  }
  console.log(homeConfigExists);
  updateLog(setLog, `Found ${pathOf(atyuHomeConfigFilePath)}!`);

  // Attempt load required home config file, then attempt load every child config file
  // Maybe the child configs can be loaded on a keyboard selection basis to isolate
  // issues across all of Atyu if one keyboard has a bad config.
  try {
    updateLog(setLog, "Parsing JSON...");
		const atyuHomeJsonOutput = nodeCommands.readJsonFile(pathOf(atyuHomeConfigFilePath));
		if (!atyuHomeJsonOutput.success || !atyuHomeJsonOutput.stdout) {
			throw Error("Couldn't process home json");
		}
    const keyboardsConfig = zKeyboardsConfig.parse(atyuHomeJsonOutput.stdout);
    updateLog(setLog, "Setting config...");
    setKeyboardsConfig(keyboardsConfig);

		let atyuConfigMap: AtyuConfigMap = {};
    for (const keyboardConfig of Object.values(keyboardsConfig)) {
			const configPath = pathOf(`${atyuQmkDir}${keyboardConfig.dir}${atyuKeyboardConfigFilename}`);
			const atyuConfigJsonOutput = nodeCommands.readJsonFile(configPath);
			if (!atyuConfigJsonOutput.success || !atyuConfigJsonOutput.stdout) {
        console.log(atyuConfigJsonOutput);
				throw Error(`Couldn't process config json for ${atyuKeyboardConfigFilename}`);
			}
			const atyuConfig = zAtyuConfig.parse(atyuConfigJsonOutput.stdout);
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

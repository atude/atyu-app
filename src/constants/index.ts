import { atyuSpecialKeys } from "./atyuSpecialKeys";
import { AtyuOptionRadioNumber } from "../configs/atyuConfig";

export const versionString = `0.4 beta`;
export const defaultKeyboardKey = "satisfaction75";
export const defaultEmptyGif = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
export const setupHelpText = `
	If this is your first time using Atyu, click run setup. Otherwise, there is something
	wrong with loading up QMK for Atyu. Check the log and ask for help in the
	Atyu discord server. Or click run setup to start a fresh install.
`.trim();

export const defaultGifRadioStruct: AtyuOptionRadioNumber = {
	type: "radio_number",
	radioKey: atyuSpecialKeys.gifSpeed,
	defaultValue: 100,
	radioValues: [
		{
			name: "Slow",
			value: 200
		},
		{
			name: "Normal",
			value: 100
		},
		{
			name: "Fast",
			value: 50
		},
	],
};

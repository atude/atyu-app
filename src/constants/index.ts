import { atyuSpecialKeys } from "./atyuSpecialKeys";
import { AtyuOptionRadioNumber } from "./types/atyuConfig";

export const versionString = "v0.1 alpha"
export const atyuConfigFilename = "atyu_config.h";
export const defaultEmptyGif = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

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

import { AtyuOptionRadioNumber } from "./types/atyuConfig";

export const versionString = "v0.1 alpha"
export const defaultEmptyGif = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

export const defaultGifRadioStruct: AtyuOptionRadioNumber = {
	type: "radio_number",
	radioKey: "gifSpeed",
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

// Selection of keys you can enable or disable
export type AtyuOptionMultiselectBoolean = {
	type: "multiselect_boolean";
	multiselectStruct: {
		name: string;
		key: string;
		defaultValue: boolean;
	}[],
	multiselectOptions?: {
		min?: number;
		max?: number;
	}
}

// One key you can set a strict value on
export type AtyuOptionRadioNumber = {
	type: "radio_number";
	radioKey: string;
	radioValues: {
		name: string;
		value: number;
	}[];
	defaultValue: number;
}
export type AtyuOptionSwitch = {
	type: "switch";
	key: string;
	defaultValue: boolean;
}

export type AtyuOptionUpdateGif = {
	type: "update_gif";
	defaultGifSpeed: number;
};

type AtyuChildOptionsStruct = 
	| AtyuOptionMultiselectBoolean
	| AtyuOptionRadioNumber
	| AtyuOptionSwitch
	| AtyuOptionUpdateGif
;

export type AtyuChildOptionsType = AtyuChildOptionsStruct["type"];

export type AtyuChildConfig = {
	name: string;
	desc?: string;
	struct: AtyuChildOptionsStruct;
};

// Top level configs are all booleans
export type AtyuConfig =  {
	name: string;
	desc: string;
	key: string;
	configurable: boolean;
	enabledByDefault: boolean;
	children: AtyuChildConfig[];
};
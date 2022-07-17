// Selection of keys you can enable or disable
export type AtyuOptionMultiselectBoolean = {
	type: "multiselect_boolean";
	multiselectStruct: {
		name: string;
		key: string;
		defaultValue: boolean;
	}[],
	multiselectOptions: null | {
		min: number | null;
		max: number | null;
	}
}

// One key you can set a strict value on
export type AtyuOptionMultiselectNumber = {
	type: "multiselect_number";
	multiselectKey: string;
	multiselectValues: {
		name: string;
		value: number;
	}
	defaultValue: number;
}

export type AtyuOptionSwitch = {
	type: "switch";
	key: string;
	defaultValue: boolean;
}

type AtyuChildOptionsStruct = 
	| AtyuOptionMultiselectBoolean
	| AtyuOptionMultiselectNumber
;

export type AtyuChildConfig = {
	name: string;
	desc: string;
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
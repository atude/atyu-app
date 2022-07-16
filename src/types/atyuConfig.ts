
// Selection of keys you can enable or disable
type AtyuOptionMultiselectBoolean = {
	type: "multiselect_boolean";
	multiselectKeys: {
		key: string;
		defaultValue: boolean;
	}[],
	multiselectOptions: null | {
		min: number | null;
		max: number | null;
	}
}

// One key you can set a strict value on
type AtyuOptionMultiselectNumber = {
	type: "multiselect_number";
	multiselectKey: string;
	multiselectValues: {
		name: string;
		value: number;
	}
	defaultValue: number;
}

type AtyuOptionSwitch = {
	type: "switch";
	key: string;
	defaultValue: boolean;
}

type AtyuChildOptionsStructure = 
	| AtyuOptionMultiselectBoolean
	| AtyuOptionMultiselectNumber
;

type AtyuChildConfig = {
	name: string;
	description: string;
	structure: AtyuChildOptionsStructure;
};

// Top level configs are all booleans
export type AtyuConfig =  {
	name: string;
	description: string;
	key: string;
	configurable: boolean;
	isEnabledByDefault: boolean;
	children: AtyuChildConfig[];
};
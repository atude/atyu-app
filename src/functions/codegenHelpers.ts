export const codegenHashDefine = (key: string, value: boolean | string | number) =>
	`#define ${key} ${value}`;
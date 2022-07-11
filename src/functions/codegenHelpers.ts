export const codegenHashDefine = (key: string, value: boolean | string | number) =>
	`#define ${key} ${value}`;

export const tab = (tabDepth = 1): string => "    ".repeat(tabDepth);
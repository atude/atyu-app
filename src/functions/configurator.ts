export function atyuValue(contextKey: any, defaultValue: boolean): boolean
export function atyuValue(contextKey: any, defaultValue: string): string;
export function atyuValue(contextKey: any, defaultValue: number): number;
export function atyuValue(contextKey: any, defaultValue: boolean | string | number): boolean | string | number {
	if (typeof contextKey === "boolean" || typeof contextKey === "string" || typeof contextKey === "number") {
		return contextKey;
	}
	return defaultValue;
}

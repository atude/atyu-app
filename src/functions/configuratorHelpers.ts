export const atyuBooleanValue = (contextKey: any, defaultValue: boolean) => 
	typeof contextKey === "boolean" ? !!contextKey : defaultValue;

export const atyuNumberValue = (contextKey: any, defaultValue: number) => 
	typeof contextKey === "number" ? contextKey : defaultValue;
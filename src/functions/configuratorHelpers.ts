export const atyuBooleanValue = (contextKey: any, defaultValue: boolean) => 
	typeof contextKey === "boolean" ? !!contextKey : defaultValue;
import { AtyuContext } from "../controllers/context/atyuContext";
import { atyuSpecialKeys, atyuSpecialKeysArr } from "../constants/atyuSpecialKeys";

export const codegenHashDefine = (key: string, value: boolean | string | number) =>
	`#define ${key} ${value}`;
export const tab = (tabDepth = 1): string => "    ".repeat(tabDepth);

type CodegenOutput = {
	configCode: string;
	resourcesCode: string;
}

export const runCodegen = (context: AtyuContext): CodegenOutput => {
	const configCode: string[] = ["#pragma once\n"];
	const resourcesCode: string[] = ["#pragma once\n#include <stdio.h>\n"];

	// Process generic keys
	Object.keys(context).forEach((key: string) => {
		// Dont process special keys here
		if (atyuSpecialKeysArr.includes(key)) {
			console.log(`wont process special key: ${key}`);
			return;
		}
		if (key.startsWith("dispatch")) {
			console.log(`wont process dispatch function: ${key}`);
			return;
		}
		if (key.startsWith("__")) {
			console.log(`wont process keys with __: ${key}`);
			return;
		}
		if (context[key] === undefined) {
			console.log(`could not get value for key: ${key}`);
			return;
		}
		configCode.push(codegenHashDefine(key, context[key]));
	});

	// Process special keys
	// -> Update gif
	if (context[atyuSpecialKeys.gifEnabled] !== undefined) {
		const gifCode = context[atyuSpecialKeys.gifCode];
		const gifUrl = context[atyuSpecialKeys.gifUrl];
		const gifSpeed = context[atyuSpecialKeys.gifSpeed];
		const gifEnabled = context[atyuSpecialKeys.gifEnabled];
		if (gifCode && gifSpeed && gifUrl && gifEnabled) {
			configCode.push(codegenHashDefine("ATYU_OLED_GIF_ENABLED", true));
			configCode.push(codegenHashDefine("ATYU_ANIM_GIF_SPEED", gifSpeed));
			resourcesCode.push(gifCode);
		} else {
			configCode.push(codegenHashDefine("ATYU_OLED_GIF_ENABLED", false));
		}
	}

	return {
		configCode: configCode.join("\n"),
		resourcesCode: resourcesCode.join("\n"),
	};
}
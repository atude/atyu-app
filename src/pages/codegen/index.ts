import { codegenHashDefine } from "../../functions/codegenHelpers";
import { AtyuContext } from "../../controllers/context/atyuContext";
import { atyuSpecialKeys, atyuSpecialKeysArr } from "../../constants/atyuSpecialKeys";

export const runCodegen = (context: AtyuContext): string => {
	const code: string[] = [
		"#pragma once\n#include <stdio.h>\n",
	];

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
		if (context[key] === undefined) {
			console.log(`could not get value for key: ${key}`);
			return;
		}
		code.push(codegenHashDefine(key, context[key]));
	});

	// Process special keys
	// -> Update gif
	if (context[atyuSpecialKeys.gifEnabled] !== undefined) {
		const gifCode = context[atyuSpecialKeys.gifCode];
		const gifUrl = context[atyuSpecialKeys.gifUrl];
		const gifSpeed = context[atyuSpecialKeys.gifSpeed];
		const gifEnabled = context[atyuSpecialKeys.gifEnabled];
		if (gifCode && gifSpeed && gifUrl && gifEnabled) {
			code.push(codegenHashDefine("ATYU_OLED_GIF_ENABLED", true));
			code.push(codegenHashDefine("ATYU_ANIM_GIF_SPEED", gifSpeed));
			code.push(gifCode);
		} else {
			code.push(codegenHashDefine("ATYU_OLED_GIF_ENABLED", false));
		}
	}

	return code.join("\n");
}
import { codegenHashDefine, tab } from "../../functions/codegenHelpers";
import { AtyuState } from "../configurator/reducer";

export const runCodegen = (state: AtyuState): string => {
	const { 
		bigClockEnabled, 
		bongoEnabled,
		petsEnabled,
		customGifEnabled, 
		gifCode, 
		gifUrl 
	} = state;
	const gifEnabledAndAdded: boolean = customGifEnabled && !!gifCode.length && !!gifUrl.length;
	const code: string[] = [
		"#pragma once\n#include <stdio.h>\n",
		codegenHashDefine("OLED_CLOCK_ENABLED", bigClockEnabled),
		codegenHashDefine("OLED_BONGO_ENABLED", bongoEnabled),
		codegenHashDefine("OLED_PETS_ENABLED", petsEnabled),
		codegenHashDefine("OLED_GIF_ENABLED", gifEnabledAndAdded)
	];

	if (gifEnabledAndAdded) {
		// TODO: make this a setting
		code.push(codegenHashDefine("ANIM_GIF_SPEED", 100));
		code.push(gifCode);
	}
	return code.join("\n");
}
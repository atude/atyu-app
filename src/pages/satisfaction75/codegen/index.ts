import { codegenHashDefine } from "../../../functions/codegenHelpers";
import { Satisfaction75State } from "../reducer";

const configPrefix = `
#pragma once

#include <stdio.h>
`;

// TODO:
export const runCodegen = (state: Satisfaction75State) => {
	const codeStringArray: string[] = [];
	codeStringArray.push(codegenHashDefine("OLED_CLOCK_ENABLED", state.bigClockEnabled));
	return configPrefix + codeStringArray.join("\n");
}
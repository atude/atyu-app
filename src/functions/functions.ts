import gifFrames from "gif-frames";
import { createCodeFunctionPrefix, createCodeFunctionSuffix, createNoGifFunction } from "./codeStrings";
import convertImagesToCpp from "./imgtocpp";

export const maxFrames = 100;

export const convertGifToCpp = async (urls: string[]): Promise<[string, number]> => {
	const codeSnippets = [];
	let totalFrames = 0;
	let i = 0;
	for (const url of urls) {
		if (!url.length) {
			i++;
			codeSnippets.push(createNoGifFunction(i));
			continue;
		}
		const rawFrames = await gifFrames({ url, frames: "all" });
		const frames = rawFrames.map((rawFrame) => rawFrame.getImage().read().toString('base64'));
		codeSnippets.push(await convertImagesToCpp(frames, i));
		totalFrames += frames.length;
		i++;
	};
	return [createCodeFunctionPrefix() +
	 codeSnippets.join("\n") +
	 createCodeFunctionSuffix(), totalFrames];
};

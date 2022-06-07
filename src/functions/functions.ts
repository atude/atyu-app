import gifFrames from "gif-frames";
import { createCodeFunctionPrefix, createCodeFunctionSuffix } from "./codeStrings";
import convertImagesToCpp from "./imgtocpp";

export const maxFrames = 48;

export const convertGifToCpp = async (urls: string[]): Promise<[string, number]> => {
	const urlsFiltered = urls.filter(url => !!url);
	const codeSnippets = [];
	let totalFrames = 0;
	let i = 0;
	for (const url of urlsFiltered) {
		const rawFrames = await gifFrames({ url, frames: "all" });
		const frames = rawFrames.map((rawFrame) => rawFrame.getImage().read().toString('base64'));
		codeSnippets.push(await convertImagesToCpp(frames, i));
		totalFrames += frames.length;
		i++;
	};
	return [createCodeFunctionPrefix() +
	 codeSnippets.join("\n") +
	 createCodeFunctionSuffix(urlsFiltered.length), totalFrames];
};

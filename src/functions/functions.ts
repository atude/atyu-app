import gifFrames from "gif-frames";
import { createCodeFunctionPrefix, createCodeFunctionSuffix } from "./codeStrings";
import convertImagesToCpp from "./imgtocpp";

export const convertGifToCpp = async (urls: string[]): Promise<string> => {
	const urlsFiltered = urls.filter(url => !!url);
	const codeSnippets = [];
	let i = 0;
	for (const url of urlsFiltered) {
		const rawFrames = await gifFrames({ url, frames: "all" });
		const frames = rawFrames.map((rawFrame) => rawFrame.getImage().read().toString('base64'));
		codeSnippets.push(await convertImagesToCpp(frames, i));
		i++;
	};
	console.log(codeSnippets);
	console.log("Done!");
	return createCodeFunctionPrefix() +
	 codeSnippets.join("\n") +
	 createCodeFunctionSuffix(urlsFiltered.length);
};

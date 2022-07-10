import gifFrames from "gif-frames";
import { codeFunctionPrefix } from "./codeStrings";
import convertImagesToCpp from "./imgtocpp";

export const convertGifToCpp = async (url: string): Promise<string> => {
	const rawFrames = await gifFrames({ url, frames: "all" });
	const frames = rawFrames.map((rawFrame) => rawFrame.getImage().read().toString('base64'));
	const codeSnippet = await convertImagesToCpp(frames);
	return codeFunctionPrefix + codeSnippet;
};

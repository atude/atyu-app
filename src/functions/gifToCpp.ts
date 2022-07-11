import gifFrames from "gif-frames";
import convertImagesToCpp from "./imgToCpp";

export const convertGifToCpp = async (url: string): Promise<string> => {
	const rawFrames = await gifFrames({ url, frames: "all" });
	const frames = rawFrames.map((rawFrame) => rawFrame.getImage().read().toString('base64'));
	const codeSnippet = await convertImagesToCpp(frames);
	return codeSnippet;
};

import gifFrames from "gif-frames";
import convertImagesToCpp from "./imgtocpp";

export const convertGifToCpp = async (url: string): Promise<string> => {
	const rawFrames = await gifFrames({ url, frames: "all" });
	const frames = rawFrames.map((rawFrame) => rawFrame.getImage().read().toString('base64'));
	const cppCodeSnippet = await convertImagesToCpp(frames);
	console.log(cppCodeSnippet);
	console.log("Done!");
	return cppCodeSnippet;
};

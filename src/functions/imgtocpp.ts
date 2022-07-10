import { createCodePrefix, createCodeSuffix } from "./codeStrings";

// Derived from https://github.com/javl/image2cpp/blob/master/index.html
const screenWidth = 128;
const screenHeight = 32;
const threshold = 128;
const indent = "        ";
const double_indent = "            ";

const imageToVertical1bit = (imageData: any) => {
	let output_string = double_indent;
	let output_index = 0;
	let add_indent = false;

	for (let p = 0; p < Math.ceil(screenHeight / 8); p++){
		for (let x = 0; x < screenWidth; x++){
			if (add_indent) {
				output_string += double_indent;
				add_indent = false;
			}
			let byteIndex = 7;
			let number = 0;

			for (let y = 7; y >= 0; y--){
				let index = ((p*8)+y)*(screenWidth*4)+x*4;
				let avg = (imageData[index] + imageData[index + 1] + imageData[index + 2]) / 3;
				if (avg > threshold){
					number += Math.pow(2, byteIndex);
				}
				byteIndex--;
			}
			let byteSet = number.toString(16);
			if (byteSet.length === 1) { 
				byteSet = "0" + byteSet; 
			}
			let b = "0x" + byteSet.toString();
			output_string += b + ", ";
			output_index++;
			if(output_index >= 16){
				output_string += "\n";
				add_indent = true;
				output_index = 0;
			}
		}
	}
	return output_string;
}

const convertToString = (images: any[], frames_length: number) => {
	let output_string = "";
	const prefix = createCodePrefix(frames_length);
	const suffix = createCodeSuffix(frames_length);
	output_string += prefix;
	let code;
	images.forEach((image: any, index: number) => {
		code = indent + "{\n";
		code += imageToVertical1bit(image);
		code += indent + "},";
		if (index !== images.length - 1) {
			code += "\n";
		}
		output_string += code;
	});
	output_string += suffix;
	return output_string;
};

const convertImagesToCpp = async (images: any) => {
	const imageToRgba = async (imageBase64: any) => {
		const img = new Image();
		img.width = 128;
		img.height = 32;
		img.src = 'data:image/jpeg;base64,'+ imageBase64;
		let imageData;

		await img.decode();
		const canvas = document.createElement('canvas');
		canvas.width = img.width;
		canvas.height = img.height;

		const context = canvas.getContext('2d');
		if (context) {
			context.drawImage(img, 0, 0, 128, 32);
			imageData = context.getImageData(0, 0, canvas.width, canvas.height);
			console.log(imageData.data);
			return imageData.data;
		}
	};

	const processedImages = [];
	for (const image of images) {
		processedImages.push(await imageToRgba(image));
	}
	const outputString = convertToString(processedImages, processedImages.length);
	return outputString;
}

export default convertImagesToCpp;
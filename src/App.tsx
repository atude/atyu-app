import React, { useState } from 'react';
import { convertGifToCpp } from './functions/functions';

function App() {
	const [inputGifUrl, setInputGifUrl] = useState<string>("");
	const [inputGifBuffer, setInputGifBuffer] = useState<string>("");
	const [outputCode, setOutputCode] = useState<string>("");

	const handleInputGif = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files?.length) {
			const file = event.target.files[0];
			const fileReader = new FileReader();

			fileReader.addEventListener("load", (fileEvent) => {
				setInputGifBuffer(fileEvent?.target?.result?.toString() ?? "");
			}); 
				
			fileReader.readAsDataURL(file);
			setInputGifUrl(window.URL.createObjectURL(file));
		};
	}

	const handleProcessGif = async () => {
		// console.log(inpGif);
		// console.log(inputGifBuffer);
		const codeSnippet = await convertGifToCpp(inputGifBuffer);
		if (codeSnippet) {
			setOutputCode(codeSnippet);
			console.log(codeSnippet);
		}
	}

  return (
    <div>
			<input 
				type="file" 
				id="img" 
				name="img" 
				accept="image/gif" 
				onChange={event => handleInputGif(event)} 
			/>
			<button onClick={() => handleProcessGif()}>process!</button>
			{inputGifUrl && 
				<img src={inputGifUrl} alt="input gif" />
			}
			{outputCode && 
				<button onClick={() => navigator.clipboard.writeText(outputCode)} >
					Copy to clipboard
				</button>
			}
			<code>
				<pre>
					{outputCode}
				</pre>
			</code>
    </div>
  );
}

export default App;

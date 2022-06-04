import styled from '@emotion/styled';
import { Button, Grid, Input, Typography } from '@mui/material';
import React, { useState } from 'react';
import { convertGifToCpp } from './functions/functions';

const MainDiv = styled.div`
	margin: 0 auto;
	max-width: 1000px;
  padding: 32px;
`;

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
		const codeSnippet = await convertGifToCpp(inputGifBuffer);
		if (codeSnippet) {
			setOutputCode(codeSnippet);
			console.log(codeSnippet);
		}
	}

  return (
    <MainDiv>
			<Grid container direction="column" alignItems="center" spacing={2}>
				<Grid item>
					<Typography variant="h4">
						Satisfaction 75 GIF to code tool
					</Typography>
				</Grid>
				<Grid item>
					<Typography variant="subtitle1">
						For use with atude's firmware (v12 and above)
					</Typography>
				</Grid>
				<Grid item>
					<Input 
						type="file" 
						id="img" 
						name="img"
						inputProps={{
							accept: "image/gif",
						}}
						onChange={event => handleInputGif(event as React.ChangeEvent<HTMLInputElement>)} 
					/>
				</Grid>
				<Grid item>
					<Button 
						disabled={!inputGifUrl || !inputGifBuffer} 
						variant="outlined" 
						onClick={() => handleProcessGif()}
					>
							Process GIF
					</Button>
				</Grid>
				<Grid item>
					{inputGifUrl && 
						<img src={inputGifUrl} alt="input gif" />
					}
				</Grid>
				<br />
				<br />
				<Grid item display="flex" flexDirection="column" >
					{outputCode && 
						<Button variant="outlined" onClick={() => navigator.clipboard.writeText(outputCode)} >
							Copy code to clipboard
						</Button>
					}
					<code>
						<pre>
							{outputCode}
						</pre>
					</code>
				</Grid>
			</Grid>
    </MainDiv>
  );
}

export default App;

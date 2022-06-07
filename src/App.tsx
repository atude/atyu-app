import styled from '@emotion/styled';
import { Button, Grid, Input, CircularProgress, Typography, Alert } from '@mui/material';
import React, { useState } from 'react';
import { convertGifToCpp, maxFrames } from './functions/functions';

const MainDiv = styled.div`
	margin: 0 auto;
	max-width: 1000px;
  padding: 32px;
`;

function App() {
	const [inputGifUrls, setInputGifUrls] = useState<string[]>(["", "", ""]);
	const [inputGifBuffers, setInputGifBuffers] = useState<string[]>(["", "", ""]);
	const [outputCode, setOutputCode] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
 
	const handleInputGif = async (event: React.ChangeEvent<HTMLInputElement>, gifIndex: number) => {
		setError("");
		if (event.target.files?.length) {
			const file = event.target.files[0];
			const fileReader = new FileReader();

			fileReader.addEventListener("load", (fileEvent) => {
				// Set new input buffers
				const newBuffers = [...inputGifBuffers];
				newBuffers[gifIndex] = fileEvent?.target?.result?.toString() ?? "";
				setInputGifBuffers(newBuffers);
			}); 
				
			fileReader.readAsDataURL(file);

			// Set new urls
			const newUrls = [...inputGifUrls];
			newUrls[gifIndex] = window.URL.createObjectURL(file);
			setInputGifUrls(newUrls);
		};
	}

	const handleProcessGif = async () => {
		setLoading(true);
		setError("");
		try {
			const [codeSnippet, totalFrames] = await convertGifToCpp(inputGifBuffers);
			if (totalFrames > maxFrames) {
				setError(`Too many total frames; try with smaller gifs (max ${maxFrames} frames total - your gifs have ${totalFrames})`);
				setOutputCode("");
			}
			if (codeSnippet) {
				setOutputCode(codeSnippet);
			}
			setLoading(false);
		} catch (e) {
			setError(`Unknown error: ${e || "reload page"}`);
			setLoading(false);
		}
	}

	const downloadCode = (code: string) => {
    const element = document.createElement("a");
    const file = new Blob([code], {
      type: "text/plain"
    });
    element.href = URL.createObjectURL(file);
    element.download = "render_gif.c";
    document.body.appendChild(element);
    element.click();
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
				<br />
				<br />
				<Grid container direction="row" justifyContent="center" spacing={2}>
					{Array.from(Array(3).keys()).map(i => (
						<Grid item key={i}>
							<Typography>Slot {i + 1}</Typography>
							<Input 
								type="file" 
								id="img" 
								name="img"
								inputProps={{
									accept: "image/gif",
								}}
								onChange={event => handleInputGif(event as React.ChangeEvent<HTMLInputElement>, i)} 
							/>
						</Grid>
					))}
				</Grid>
				<Grid item>
					<Button 
						disabled={!inputGifUrls[0] || !inputGifBuffers[0] || loading} 
						variant="outlined" 
						onClick={() => handleProcessGif()}
					>
							Process GIFs
					</Button>
				</Grid>
				<Grid item>
					{inputGifUrls.map((inputGifUrl, i) => (
						inputGifUrl ? 
							<img style={{ margin: "4px", border: "2px solid red" }} key={i} src={inputGifUrl} alt="input gif" /> :
							<div key={i}/>
					))}
				</Grid>
				<br />
				<br />
				<Grid item display="flex" flexDirection="column" alignItems="center">
					{!!loading && <CircularProgress />}
					{!!error.length && <Alert severity="error">{error}</Alert>}
					<br />
					<br />
					{outputCode && 
						<div>
							<Button style={{ marginRight: "4px" }} variant="outlined" onClick={() => navigator.clipboard.writeText(outputCode)} >
								Copy code to clipboard
							</Button>
							<Button variant="outlined" onClick={() => downloadCode(outputCode)}>
								Download as 'render_gif.c' file
							</Button>
						</div>
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

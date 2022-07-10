import { Button, Grid, Input, CircularProgress, Typography, Alert } from '@mui/material';
import React, { useState } from 'react';
import { convertGifToCpp } from '../../../functions/functions';

function Satisfaction75GifTool() {
	const [inputGifUrl, setInputGifUrl] = useState<string>("");
	const [inputGifBuffer, setInputGifBuffer] = useState<string>("");
	const [outputCode, setOutputCode] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
 
	const handleInputGif = async (event: React.ChangeEvent<HTMLInputElement>) => {
		setError("");
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
		setLoading(true);
		setError("");
		try {
			const codeSnippet = await convertGifToCpp(inputGifBuffer);
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
		<Grid container direction="column" spacing={2}>
			<Grid item>
				<Typography>Input GIF</Typography>
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
					disabled={loading} 
					variant="outlined" 
					onClick={() => handleProcessGif()}
				>
						Process GIFs
				</Button>
			</Grid>
			<Grid item>
				{!!inputGifUrl && (
					<img style={{ margin: "4px", border: "2px solid red" }} src={inputGifUrl} alt="gif" />
				)}
			</Grid>
			<br />
			<br />
			<Grid item display="flex" flexDirection="column" alignItems="center">
				{!!loading && <CircularProgress />}
				{!!error.length && <Alert severity="warning">{error}</Alert>}
				<br />
				<br />
				{outputCode && 
					<div>
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
  );
}

export default Satisfaction75GifTool;

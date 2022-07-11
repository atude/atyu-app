import { Alert, Button, CircularProgress, Grid, Input, Snackbar, Typography, useTheme } from '@mui/material';
import React, { useContext, useState } from 'react';
import HorizontalBox from '../../../components/HorizontalBox';
import { AppContext } from '../../../context';
import { convertGifToCpp } from '../../../functions/functions';

const defaultEmptyGif = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

function Satisfaction75GifTool() {
	const theme = useTheme();
	const { isDoingTask, setDoingTask } = useContext(AppContext);
	const [inputGifUrl, setInputGifUrl] = useState<string>(defaultEmptyGif);
	const [outputCode, setOutputCode] = useState<string>("");
	const [error, setError] = useState<string>("");

	const handleError = (msg: string) => {
		setError(msg);
		setDoingTask(false);
		setOutputCode("");
	}
 
	const handleInputGif = async (event: React.ChangeEvent<HTMLInputElement>) => {
		setError("");
		setDoingTask(true);
		if (event.target.files?.length) {
			const file = event.target.files[0];
			const fileReader = new FileReader();

			fileReader.addEventListener("load", async (fileEvent) => {
				const inputGifBuffer = fileEvent?.target?.result?.toString() ?? "";
				if (!inputGifBuffer.length) {
					handleError("Error processing gif");
				}

				try {
					const codeSnippet = await convertGifToCpp(inputGifBuffer);
					if (codeSnippet) {
						setOutputCode(codeSnippet);
						console.log(codeSnippet)
						setDoingTask(false);
					} else {
						handleError("Failed to generate GIF code");
					}
				} catch (e) {
					handleError("Error processing gif");
				}
			}); 

			fileReader.readAsDataURL(file);
			setInputGifUrl(window.URL.createObjectURL(file));
		};
	}

  return (
		<HorizontalBox expanded>
			<label htmlFor="contained-button-file">
				<input
					style={{ display: "none" }}
					type="file" 
					id="contained-button-file" 
					name="img"
					accept="image/gif"
					onChange={event => handleInputGif(event as React.ChangeEvent<HTMLInputElement>)} 
				/>
				<Button
					variant="outlined"
					component="span"
				>
					Upload 128x32 black and white GIF
				</Button>
      </label>
			<HorizontalBox>
				{!!isDoingTask && <CircularProgress size={30} sx={{ mr: "8px" }} />}
				<img 
					style={{ 
						margin: "4px", 
						border: `2px solid ${theme.palette.primary.main}`,
						width: "128px",
						height: "32px",
					}} 
					src={inputGifUrl || "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="} 
					alt="sat75_gif" 
				/>
				<Snackbar open={!!error.length} autoHideDuration={6000} onClose={() => setError("")}>
					<Alert severity="error" sx={{ width: '100%' }}>
						{error}
					</Alert>
				</Snackbar>	
			</HorizontalBox>
		</HorizontalBox>
  );
}

export default Satisfaction75GifTool;

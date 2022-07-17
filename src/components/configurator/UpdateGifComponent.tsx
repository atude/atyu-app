import { Clear } from '@mui/icons-material';
import { Alert, Button, CircularProgress, IconButton, Snackbar, useTheme } from '@mui/material';
import React, { useState } from 'react';
import HorizontalBox from '../HorizontalBox';
import { defaultEmptyGif } from '../../constants';
import { convertGifToCpp } from '../../functions/gifToCpp';
import { useAtyuContext } from '../../controllers/context/atyuContext';
import { useAppContext } from '../../controllers/context/appContext';

function UpdateGifComponent() {
	const theme = useTheme();
	const { dispatchUpdateGif, gifUrl, gifCode, gifSpeed } = useAtyuContext(); //TODO:
	const { isDoingTask, setDoingTask } = useAppContext();
	const [error, setError] = useState<string>("");

	const handleError = (msg: string) => {
		setError(msg);
		setDoingTask(false);
		dispatchUpdateGif("", "");
	}

	const handleClearGif = () => {
		dispatchUpdateGif("", "");
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
						dispatchUpdateGif(undefined, codeSnippet);
						setDoingTask(false);
					} else {
						handleError("Failed to generate GIF code");
					}
				} catch (e) {
					handleError("Error processing gif");
				}
			}); 

			fileReader.readAsDataURL(file);
			dispatchUpdateGif(window.URL.createObjectURL(file), undefined);
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
					src={gifUrl || defaultEmptyGif}
					alt="sat75_gif" 
				/>
				<IconButton disabled={isDoingTask || !gifUrl} onClick={handleClearGif} color="secondary">
					<Clear />
				</IconButton>
				<Snackbar open={!!error.length} autoHideDuration={6000} onClose={() => setError("")}>
					<Alert severity="error" sx={{ width: '100%' }}>
						{error}
					</Alert>
				</Snackbar>	
			</HorizontalBox>
		</HorizontalBox>
  );
}

export default UpdateGifComponent;

import styled from "@emotion/styled";
import { Alert } from "@mui/material";

const AlertStyled = styled(Alert)`
	top: 0;
	margin-bottom: 20px;
`;

const FlashAlert = () => {
	return (
		<AlertStyled severity="error"></AlertStyled>
	);
}
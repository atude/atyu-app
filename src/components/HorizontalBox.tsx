import { Box, SxProps, Theme } from "@mui/material";
import React from "react";

type Props = {
	children?: React.ReactNode;
	expanded?: boolean;
	sx?: SxProps<Theme>;
};

const HorizontalBox = (props: Props) => {
	return (
		<Box 
			sx={{
				...(props.expanded && { width: "100%" }),
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				...(props.expanded && { justifyContent: "space-between" }),
				...props.sx,
			}} 
		>
			{props.children}
		</Box>
	);
};

export default HorizontalBox
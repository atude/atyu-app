import styled from "@emotion/styled";
import { Box, Button, ButtonGroup, Checkbox, Typography, useTheme } from "@mui/material";
import { atyuBooleanValue, atyuNumberValue } from "../../functions/configuratorHelpers";
import { useAtyuContext } from "../../controllers/context/atyuContext";
import { AtyuOptionRadioNumber } from "../../constants/types/atyuConfig";
import { blueGrey } from "@mui/material/colors";
import HorizontalBox from "../HorizontalBox";

type Props = {
  config: AtyuOptionRadioNumber;
	name: string;
	desc?: string;
};

const ButtonGroupContainer = styled(ButtonGroup)`
`;

const ButtonOption = styled(Button)`
	width: 90px;
`;

const RadioNumberComponent = (props: Props) => {
	const theme = useTheme();
  const context = useAtyuContext();
  const { name, desc, config } = props;
  const { radioKey, radioValues, defaultValue } = config;
	const value = atyuNumberValue(context[radioKey], defaultValue);

  return (
    <HorizontalBox expanded>
			<Typography variant="subtitle1">{name}</Typography>
			{!!desc?.length && (
				<Typography sx={{ mb: "12px" }} variant="subtitle2" color="secondary">{desc}</Typography>
			)}
      <ButtonGroupContainer disableElevation>
        {radioValues.map((radioValue) => {
          const { name, value: thisValue } = radioValue;
          return (
            <ButtonOption 
							variant={thisValue === value ? "contained" : "outlined"}
							onClick={() => context.dispatchUpdateValue(radioKey, thisValue)}
							key={name}
						>
              {name}
            </ButtonOption>
          );
        })}
      </ButtonGroupContainer>
    </HorizontalBox>
  );
};

export default RadioNumberComponent;

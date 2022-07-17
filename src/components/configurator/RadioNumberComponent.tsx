import styled from "@emotion/styled";
import { Box, Checkbox, Typography, useTheme } from "@mui/material";
import { atyuBooleanValue } from "../../functions/configuratorHelpers";
import { useAtyuContext } from "../../controllers/context/atyuContext";
import { AtyuOptionRadioNumber } from "../../constants/types/atyuConfig";
import { blueGrey } from "@mui/material/colors";

type Props = {
  config: AtyuOptionRadioNumber;
	name: string;
	desc?: string;
};

const RadioContainer = styled(Box)`
  width: 100%;
  max-height: 200px;
  flex-wrap: wrap;
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
`;

const CheckboxBox = styled(Box)`
  margin-bottom: -8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 80%;
`;

const RadioNumberComponent = (props: Props) => {
	const theme = useTheme();
  const context = useAtyuContext();
  const { name, desc, config } = props;
  const { radioKey, radioValues } = config;

  return (
    <Box>
			<Typography variant="subtitle1">{name}</Typography>
			{!!desc?.length && (
				<Typography sx={{ mb: "12px" }} variant="subtitle2" color="secondary">{desc}</Typography>
			)}
      <RadioContainer>
				{/* TODO: */}
        {/* {multiselectStruct.map((multiselectKey, i) => {
          const { name, key, defaultValue } = multiselectKey;
          const isEnabled = atyuBooleanValue(context[key], defaultValue);
          return (
            <CheckboxBox key={key}>
              <Checkbox
                disabled={
                  // Disabled if not enough min or too much max
                  !!multiselectOptions &&
                  ((!isEnabled &&
                    multiselectOptions?.max != null &&
                    enabledAggregate >= multiselectOptions?.max) ||
                    (isEnabled &&
                      multiselectOptions?.min != null &&
                      enabledAggregate <= multiselectOptions?.min))
                }
                checked={isEnabled}
                onChange={() => context.dispatchToggleKey(key)}
              />
              <Typography>{name}</Typography>
            </CheckboxBox>
          );
        })} */}
      </RadioContainer>
    </Box>
  );
};

export default RadioNumberComponent;

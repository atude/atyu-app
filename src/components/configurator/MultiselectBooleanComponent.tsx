import styled from "@emotion/styled";
import { Box, Checkbox, Typography, useTheme } from "@mui/material";
import { atyuValue } from "../../functions/configurator";
import { useAtyuContext } from "../../controllers/context/atyuContext";
import { AtyuOptionMultiselectBoolean } from "../../configs/atyuConfig";
import { blueGrey } from "@mui/material/colors";

type Props = {
  config: AtyuOptionMultiselectBoolean;
	name: string;
	desc?: string;
};

const CheckboxContainer = styled(Box)`
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

const MultiselectBooleanComponent = (props: Props) => {
	const theme = useTheme();
  const context = useAtyuContext();
  const { name, desc, config } = props;
  const { multiselectStruct, multiselectOptions } = config;
  const enabledAggregate = multiselectStruct.reduce(
    (total, multiselectKey) => (!!context[multiselectKey.key] ? total + 1 : total),
    0
  );

  return (
    <Box>
			<Typography variant="subtitle1" fontSize={14}>{name}</Typography>
			{!!desc?.length && (
				<Typography sx={{ mb: "12px" }} variant="subtitle2" color="secondary">{desc}</Typography>
			)}
      { (
        <Typography component="span" variant="subtitle2" color={blueGrey[300]}>
          {multiselectOptions?.max != null && `
						Choose up to ${multiselectOptions?.max} ${multiselectOptions?.max === 1 ? "option" : "options"}. 
					`}
					{multiselectOptions?.min != null && `
						You must have at least ${multiselectOptions?.min} ${multiselectOptions?.min === 1 ? "option" : "options"} selected.
					`}
        </Typography>
      )}
      {multiselectOptions?.min != null && (
        <Typography component="span" variant="subtitle2" color={theme.palette.secondary.light}>
          
        </Typography>
      )}
      <CheckboxContainer>
        {multiselectStruct.map((multiselectKey, i) => {
          const { name, key, defaultValue } = multiselectKey;
          const isEnabled = atyuValue(context[key], defaultValue);
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
                onChange={() => context.dispatchUpdateValue(key, !isEnabled)}
              />
              <Typography>{name}</Typography>
            </CheckboxBox>
          );
        })}
      </CheckboxContainer>
    </Box>
  );
};

export default MultiselectBooleanComponent;

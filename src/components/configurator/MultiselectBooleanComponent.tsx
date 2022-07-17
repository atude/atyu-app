import styled from "@emotion/styled";
import { Box, Checkbox, Typography, useTheme } from "@mui/material";
import { atyuBooleanValue } from "../../functions/configuratorHelpers";
import { useAtyuContext } from "../../controllers/context/atyuContext";
import { AtyuOptionMultiselectBoolean } from "../../constants/types/atyuConfig";

type Props = {
  config: AtyuOptionMultiselectBoolean;
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

//TODO: we can use a radio component if max is 1
const MultiselectBooleanComponent = (props: Props) => {
	const theme = useTheme();
  const context = useAtyuContext();
  const { config } = props;
  const { multiselectStruct, multiselectOptions } = config;
  const enabledAggregate = multiselectStruct.reduce(
    (total, multiselectKey) => (!!context[multiselectKey.key] ? total + 1 : total),
    0
  );

  return (
    <Box>
      {multiselectOptions?.max != null && (
        <Typography component="span" variant="subtitle2" color={theme.palette.secondary.light}>
          Choose up to {multiselectOptions?.max} {multiselectOptions?.max === 1 ? "option" : "options"}.&nbsp;
        </Typography>
      )}
      {multiselectOptions?.min != null && (
        <Typography component="span" variant="subtitle2" color={theme.palette.secondary.light}>
          You must have at least {multiselectOptions?.min} {multiselectOptions?.min === 1 ? "option" : "options"} selected.
        </Typography>
      )}
      <CheckboxContainer>
        {multiselectStruct.map((multiselectKey, i) => {
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
        })}
      </CheckboxContainer>
    </Box>
  );
};

export default MultiselectBooleanComponent;

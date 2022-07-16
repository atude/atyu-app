// import { AccessTime, Gif, Pets, ViewComfyRounded } from "@mui/icons-material";
import styled from "@emotion/styled";
import { Alert, Box, Button, Switch, Typography, useTheme } from "@mui/material";
import { AtyuConfig } from "../../types/atyuConfig";
import { runCodegen } from "../codegen";
import { useAtyuContext } from "./context";
import { testConfig } from "./reducer";
// import Satisfaction75GifTool from "./modes/Satisfaction75GifTool";

const OledModeBox = styled(Alert)`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  transition: all 0.5s;
`;

const OledModeHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const OledModeHeaderText = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const OledModeComponent = styled.div`
  margin-top: 12px;
  padding: 14px 8px 0 8px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${(props) => props.color};
`;

// This is the UI generator
const Configurator = () => {
  const context = useAtyuContext();
  const theme = useTheme();
  // TODO: here we want to read the config to create the UI components.
  // can split it up so its easy to create here or something like that
  // oleed modes replaced with something else

  const config: AtyuConfig[] = testConfig;

  return (
    <Box>
      <Typography color="primary" variant="h5" sx={{ mb: "12px" }}>
        OLED modes
      </Typography>
      {config.map((configSection) => {
        const { name, description, key, configurable, children, isEnabledByDefault } =
          configSection;
				const { dispatchToggleKey } = context;
				let isEnabled: boolean = isEnabledByDefault;
				if (typeof context[key] === "boolean") {
					isEnabled = !!context[key];
				}
				
        return (
          <OledModeBox
            variant="outlined"
            severity="info"
            key={name}
            icon={false}
            sx={{ filter: isEnabled !== undefined && !isEnabled ? "grayscale(100%)" : "none" }}
          >
            <OledModeHeader>
              <OledModeHeaderText>
                {/*{icon}*/}&nbsp;&nbsp;{name}
              </OledModeHeaderText>
              {!!configurable && <Switch checked={isEnabled} onChange={() => dispatchToggleKey(key)} />}
            </OledModeHeader>
            {/* {!!isEnabled && !!component && (
              <OledModeComponent color={theme.palette.primary.main}>{component}</OledModeComponent>
            )} */}
          </OledModeBox>
        );
      })}
      <Button onClick={() => console.log(runCodegen(context))}>codegen test</Button>
    </Box>
  );
};

export default Configurator;

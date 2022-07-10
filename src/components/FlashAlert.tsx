import styled from "@emotion/styled";
import { Alert } from "@mui/material";
import { useContext } from "react";
import { FlashAlertSeverityMap, FlashStateDisplayStrings } from "../consts";
import { AppContext } from "../context";

const AlertStyled = styled(Alert)`
  top: 0;
  margin-bottom: 20px;
`;

const FlashAlert = () => {
  const { flashState } = useContext(AppContext);
  const flashSeverity = FlashAlertSeverityMap[flashState];
  const displayString = FlashStateDisplayStrings[flashState];

  return !flashSeverity ? (
    <AlertStyled severity="info" icon={false}>
      <b>Atyu | OLED mods for QMK keyboards</b>
    </AlertStyled>
  ) : (
    <AlertStyled variant="filled" severity={flashSeverity}>{displayString}</AlertStyled>
  );
};

export default FlashAlert;

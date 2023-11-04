import React from "react";
import { Grid } from "@mui/material";
import ChannelData from "components/ChannelData";
import RacerData from "components/RacerData";

interface ConnectorProps {}

const Connector: React.FC<ConnectorProps> = () => {
	return (
		<Grid container direction="row" spacing={4}>
			<RacerData />
			<ChannelData channel={"A"} />
			<ChannelData channel={"B"} />
		</Grid>
	);
};

export default Connector;

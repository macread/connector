import React from "react";
import { ConnectorDataContainer } from "./index";

interface UnstatedNextProvidersProps {
	children: any;
}

const UnstatedNextProviders: React.FC<UnstatedNextProvidersProps> = (props) => {
	return (
		<ConnectorDataContainer.Provider>
			{props.children}
		</ConnectorDataContainer.Provider>
	);
};

export default UnstatedNextProviders;

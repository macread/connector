import React from "react";
import { FormControl, Input, InputLabel } from "@mui/material";

interface UrlEntryProps {
	label: string;
	onChange: (value: string) => void;
	value: string | undefined;
}

const UrlEntry: React.FC<UrlEntryProps> = (props: UrlEntryProps) => {
	const { onChange, value } = props;

	return (
		<FormControl sx={{ m: 1, width: "100%" }} variant="standard">
			<InputLabel htmlFor="channel">r|r API URL</InputLabel>
			<Input
				id="urlEntry"
				onChange={(e) => onChange(e.target.value)}
				type="text"
				value={value}
			/>
		</FormControl>
	);
};

export default UrlEntry;

import React from "react";
import {
	FormControl,
	IconButton,
	Input,
	InputAdornment,
	InputLabel,
} from "@mui/material";
import { LinkOffOutlined, LinkOutlined } from "@mui/icons-material";

interface IpEntryProps {
	channel: string;
	channelConnected: boolean;
	connectToChannel: () => void;
	onChange: (channel: string, value: string) => void;
	value: string | undefined;
}

const IpEntry: React.FC<IpEntryProps> = (props: IpEntryProps) => {
	const {
		channel,
		channelConnected,
		connectToChannel,
		onChange,
		value,
	} = props;

	return (
		<FormControl sx={{ m: 1, width: "100%" }} variant="standard">
			<InputLabel htmlFor="channel">{`${channel} Channel IP`}</InputLabel>
			<Input
				id={`channel${channel}IP`}
				endAdornment={
					<InputAdornment position="end">
						<IconButton
							aria-label="toggle password visibility"
							onClick={connectToChannel}
						>
							{channelConnected ? (
								<LinkOutlined fontSize="small" />
							) : (
								<LinkOffOutlined fontSize="small" />
							)}
						</IconButton>
					</InputAdornment>
				}
				onChange={(e) => onChange(channel, e.target.value)}
				type="text"
				value={value}
			/>
		</FormControl>
	);
};

export default IpEntry;

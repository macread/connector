import React from "react";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import LinkOffOutlined from "@mui/icons-material/LinkOffOutlined";
import LinkOutlined from "@mui/icons-material/LinkOutlined";
import ReloadPicker from "./ReloadPicker";
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
						<ReloadPicker channel={channel} />
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

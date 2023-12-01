import React, { useState } from "react";
import axios from "axios";
import { filter } from "lodash";
import Avatar from "@mui/material/Avatar";
import { DataObject } from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ReplayOutlined from "@mui/icons-material/ReplayOutlined";
import { ConnectorDataContainer } from "containers";
import { ITimingData, ITimyData } from "../types";

export interface ReloadPickerProps {
	channel: string;
}

export interface SimpleDialogProps {
	logFiles: string[];
	open: boolean;
	selectedValue: string;
	onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
	const { logFiles, onClose, selectedValue, open } = props;

	const handleClose = () => {
		onClose(selectedValue);
	};

	const handleListItemClick = (value: string) => {
		onClose(value);
	};

	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle sx={{ bgcolor: "lightgray" }}>
				Select log file to import
			</DialogTitle>
			<List sx={{ pt: 0 }}>
				{logFiles.map((logFile) => (
					<ListItem disableGutters key={logFile}>
						<ListItemButton onClick={() => handleListItemClick(logFile)}>
							<ListItemAvatar>
								<Avatar>
									<DataObject />
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary={logFile} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Dialog>
	);
}

export default function ReloadPicker(props: ReloadPickerProps) {
	const { channel } = props;
	const {
		handleMessageData,
		setChannelAData,
		setChannelATimingData,
		setChannelBData,
		setChannelBTimingData,
	} = ConnectorDataContainer.useContainer();
	const [logFiles, setLogFiles] = useState<string[]>([]);
	const [open, setOpen] = useState(false);
	const [port] = useState<string>(channel === "A" ? "3300" : "3301");
	const [selectedValue, setSelectedValue] = React.useState(logFiles[1]);

	const handleClickOpen = () => {
		axios
			.get(`http://localhost:${port}/listLogs`)
			.then(function (response) {
				// handle success
				const channelLogFiles: string[] = response.data.logFiles.filter(
					(row: string) => row.startsWith(`channel_${channel}`)
				);
				setLogFiles(channelLogFiles);
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			});
		setOpen(true);
	};

	const handleClose = (value: string) => {
		axios
			.get(`http://localhost:${port}/getLog?logFile=${value}`)
			.then(function (response) {
				// handle success
				// need to transform the data to a JSON object
				let logFileDataObj: string = `[${response.data.logFileData.replaceAll(
					"}\n",
					"},"
				)}]`;
				logFileDataObj = logFileDataObj.replaceAll("},]", "}]"); // remove that last comma
				const logFileData = JSON.parse(logFileDataObj);
				let finalTimeMessages: ITimyData[] = [];
				const timeMessages = filter(logFileData, ["label", "time"]);
				const times: ITimingData[] = timeMessages.map((timeMessage) => {
					let finalTimeMessage: string;
					const timerData: string = timeMessage.message;
					const time: string = timerData.substring(9);
					if (timerData.includes("C0")) {
						finalTimeMessage = `start: ${time}`;
					} else {
						finalTimeMessage = `stop: ${time}`;
					}
					finalTimeMessages.push({ timyTime: finalTimeMessage });
					return handleMessageData(finalTimeMessage);
				});
				if (channel === "A") {
					setChannelAData(finalTimeMessages);
					setChannelATimingData(times);
				} else {
					setChannelBData(finalTimeMessages);

					setChannelBTimingData(times);
				}
			})
			.catch(function (error) {
				// handle error
				console.log(error);
			});

		setOpen(false);

		setSelectedValue(value);
	};

	return (
		<div>
			<IconButton onClick={handleClickOpen}>
				<ReplayOutlined />
			</IconButton>
			<SimpleDialog
				logFiles={logFiles}
				selectedValue={selectedValue}
				open={open}
				onClose={handleClose}
			/>
		</div>
	);
}

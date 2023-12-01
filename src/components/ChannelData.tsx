import React, { useState } from "react";
import { TableVirtuoso, TableComponents } from "react-virtuoso";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { ConnectorDataContainer } from "containers";
import IpEntry from "./IpEntry";
import { ITimyData } from "../types";

interface ChannelDataProps {
	channel: string;
}

interface ColumnData {
	dataKey: keyof ITimyData;
	label: string;
	numeric?: boolean;
	width: number;
}

const channelHeader: ColumnData[] = [
	{
		width: 40,
		label: "Channel",
		dataKey: "timyTime",
		numeric: false,
	},
];

const headerContent = (channel: string) => {
	return (
		<TableRow>
			{channelHeader.map((column) => (
				<TableCell
					key={column.dataKey}
					variant="head"
					align={"center"}
					style={{ width: column.width }}
					sx={{
						backgroundColor: "background.paper",
					}}
				>
					{`${channel} ${column.label}`}
				</TableCell>
			))}
		</TableRow>
	);
};

const ChannelTableComponents: TableComponents<ITimyData> = {
	Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
		<TableContainer component={Paper} {...props} ref={ref} />
	)),
	Table: (props: any) => (
		<Table
			{...props}
			sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
			size="small"
		/>
	),
	TableHead,
	TableRow: ({ item: _item, ...props }) => <TableRow {...props} hover />,
	TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
		<TableBody {...props} ref={ref} />
	)),
};

function dataRowContent(_index: number, row: ITimyData) {
	return (
		<React.Fragment>
			{channelHeader.map((column) => (
				<TableCell key={column.dataKey} align={"center"}>
					{row[column.dataKey]}
				</TableCell>
			))}
		</React.Fragment>
	);
}

const ChannelData: React.FC<ChannelDataProps> = (props) => {
	const { channel } = props;
	const {
		channelAData,
		setChannelAMessage,
		channelBData,
		setChannelBMessage,
	} = ConnectorDataContainer.useContainer();

	const [channelConnected, setChannelConnected] = useState<boolean>(false);
	const [channelIP, setChannelIP] = useState<string>(
		channel === "A" ? "192.168.21.17" : "192.168.21.18"
	);

	let channelEventSource: EventSource;

	const connectToChannel = () => {
		if (channelConnected) {
			setChannelConnected(false);
		} else {
			setChannelConnected(true);
			connectToServer();
		}
	};

	const connectToServer = () => {
		// opening a connection to the server to begin receiving events from it
		channelEventSource = new EventSource(
			`http://localhost:${channel === "A" ? "3300" : "3301"}/listen`
		);
		// attaching a handler to receive message events
		channelEventSource.onmessage = (event: any) => {
			const channelTime: string = event.data.replace("message", "");
			if (channel === "A") {
				setChannelAMessage({ timyTime: channelTime });
			} else {
				setChannelBMessage({ timyTime: channelTime });
			}
		};
	};

	const handleIPChange = (e: any) => {
		setChannelIP(e.target.value);
	};

	return (
		<Grid alignItems="center" display="flex" direction="column" item xs={2}>
			<IpEntry
				channel={channel}
				channelConnected={channelConnected}
				connectToChannel={connectToChannel}
				onChange={handleIPChange}
				value={channelIP}
			/>
			<Paper style={{ height: 500, width: "100%" }}>
				<TableVirtuoso
					data={channel === "A" ? channelAData : channelBData}
					components={ChannelTableComponents}
					fixedHeaderContent={() => headerContent(channel)}
					itemContent={dataRowContent}
				/>
			</Paper>
		</Grid>
	);
};

export default ChannelData;

import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
	Grid,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import { TableVirtuoso, TableComponents } from "react-virtuoso";
import IpEntry from "components/IpEntry";
import UrlEntry from "components/urlEntry";

interface Data {
	bib: number;
	name: string;
	assignedStart: string;
	assignedStartSeconds: number;
	actualStart: string;
	actualStartSeconds: number;
	chipStart: string;
	chipStartSeconds: number;
	actualStop: string;
	actualStopSeconds: number;
	chipStop: string;
	chipStopSeconds: number;
	channelAStart: string;
	channelAStartSeconds: number;
	channelAStop: string;
	channelAStopSeconds: number;
	channelBStart: string;
	channelBStartSeconds: number;
	channelBStop: string;
	channelBStopSeconds: number;
	timyTime: string;
}

interface ChannelData {
	timyTime: string;
}

interface ColumnData {
	dataKey: keyof Data;
	label: string;
	numeric?: boolean;
	width: number;
}

interface ChannelColumnData {
	dataKey: keyof ChannelData;
	label: string;
	numeric?: boolean;
	width: number;
}

let channelAEventSource: EventSource;
let channelBEventSource: EventSource;

const raceDataColumn: ColumnData[] = [
	{
		width: 20,
		label: "Bib",
		dataKey: "bib",
	},
	{
		width: 100,
		label: "Name",
		dataKey: "name",
		numeric: false,
	},
	{
		width: 40,
		label: "Assgn\u00A0Start",
		dataKey: "assignedStart",
		numeric: true,
	},
	{
		width: 40,
		label: "Act\u00A0Start",
		dataKey: "actualStart",
		numeric: true,
	},
	{
		width: 40,
		label: "Act\u00A0Stop",
		dataKey: "actualStop",
		numeric: true,
	},
	{
		width: 40,
		label: "A\u00A0Start",
		dataKey: "channelAStart",
		numeric: true,
	},
	{
		width: 40,
		label: "A\u00A0Stop",
		dataKey: "channelAStop",
		numeric: true,
	},
	{
		width: 40,
		label: "B\u00A0Start",
		dataKey: "channelBStart",
		numeric: true,
	},
	{
		width: 40,
		label: "B\u00A0Stop",
		dataKey: "channelBStop",
		numeric: true,
	},
];

const channelHeader: ChannelColumnData[] = [
	{
		width: 40,
		label: "Channel",
		dataKey: "timyTime",
		numeric: false,
	},
];

const RaceDataTableComponents: TableComponents<Data> = {
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
	TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
	TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
		<TableBody {...props} ref={ref} />
	)),
};

const ChannelTableComponents: TableComponents<ChannelData> = {
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
	TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
	TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
		<TableBody {...props} ref={ref} />
	)),
};

function raceDataHeaderContent() {
	return (
		<TableRow>
			{raceDataColumn.map((column) => (
				<TableCell
					key={column.dataKey}
					variant="head"
					align={column.numeric || false ? "right" : "left"}
					style={{ width: column.width }}
					sx={{
						backgroundColor: "background.paper",
					}}
				>
					{column.label}
				</TableCell>
			))}
		</TableRow>
	);
}

function raceDataRowContent(_index: number, row: Data) {
	return (
		<React.Fragment>
			{raceDataColumn.map((column) => (
				<TableCell
					key={column.dataKey}
					align={column.numeric || false ? "right" : "left"}
				>
					{row[column.dataKey]}
				</TableCell>
			))}
		</React.Fragment>
	);
}

const channelHeaderContent = (channel: string) => {
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

function channelDataRowContent(_index: number, row: ChannelData) {
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

export default function Connector() {
	const [channelAConnected, setChannelAConnected] = useState<boolean>(false);
	const [channelAData, setChannelAData] = useState<ChannelData[]>([]);
	const [channelAIP, setChannelAIP] = useState<string>("192.168.21.17");
	const [channelBConnected, setChannelBConnected] = useState<boolean>(false);
	const [channelBIP, setChannelBIP] = useState<string>("192.168.21.18");
	const [channelBData, setChannelBData] = useState<ChannelData[]>([]);
	const [data, setData] = useState<Data[]>();
	const [rrAPIURL, setRrAPIURL] = useState<string>();

	const connectToChannelA = () => {
		if (channelAConnected) {
			channelAEventSource.close();
			setChannelAConnected(false);
		} else {
			connectToChannelAServer();
			setChannelAConnected(true);
		}
	};

	const connectToChannelB = () => {
		if (channelBConnected) {
			channelAEventSource.close();
			setChannelBConnected(false);
		} else {
			connectToChannelBServer(channelBIP);
			setChannelBConnected(true);
		}
	};

	const handleChannelIPChange = (channel: string, ip: string) => {
		if (channel === "A") {
			setChannelAIP(ip);
		} else {
			setChannelBIP(ip);
		}
	};

	useEffect(() => {
		if (rrAPIURL) {
			axios
				.get(rrAPIURL)
				.then(function (response) {
					// handle success
					setData(response.data);
				})
				.catch(function (error) {
					// handle error
					console.log(error);
				});
		}
	}, [rrAPIURL]);

	const connectToChannelAServer = () => {
		// opening a connection to the server to begin receiving events from it
		try {
			channelAEventSource = new EventSource(
				`http://localhost:3300/listen?ipAddr=${channelAIP}&port=8234`
			);
			// attaching a handler to receive message events
			channelAEventSource.onmessage = (event: any) => {
				// const tempChannelAData: ChannelData[] = [...channelAData];
				const channelTime: string = event.data.replace("message", "");
				// tempChannelAData.push({ timyTime: channelTime });
				setChannelAData([...channelAData, { timyTime: channelTime }]);
			};
		} catch (error) {
			console.log(error);
		}
	};

	// I know this is not very DRY
	const connectToChannelBServer = (ipAddr: String) => {
		// opening a connection to the server to begin receiving events from it
		try {
			channelBEventSource = new EventSource(
				`localhost:3300/listen?ipAddr=${ipAddr}&port=8234`
			);
			// attaching a handler to receive message events
			channelBEventSource.onmessage = (event: any) => {
				const tempChannelBData: ChannelData[] = [...channelBData];
				tempChannelBData.push(event.data.replace("message", ""));
				setChannelBData(tempChannelBData);
			};
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Grid container direction="row" spacing={4}>
			<Grid
				alignItems="center"
				direction="column"
				display="flex"
				item
				justifyContent="flex-start"
				xs={8}
			>
				<UrlEntry
					label="r|r Connector Pull Simple API URL"
					onChange={setRrAPIURL}
					value={rrAPIURL}
				/>
				<Grid item width="100%">
					<Paper style={{ height: 500, width: "100%" }}>
						<TableVirtuoso
							data={data}
							components={RaceDataTableComponents}
							fixedHeaderContent={raceDataHeaderContent}
							itemContent={raceDataRowContent}
						/>
					</Paper>
				</Grid>
			</Grid>
			<Grid alignItems="center" display="flex" direction="column" item xs={2}>
				<IpEntry
					channel="A"
					channelConnected={channelAConnected}
					connectToChannel={connectToChannelA}
					onChange={handleChannelIPChange}
					value={channelAIP}
				/>
				<Paper style={{ height: 500, width: "100%" }}>
					<TableVirtuoso
						data={channelAData}
						components={ChannelTableComponents}
						fixedHeaderContent={() => channelHeaderContent("A")}
						itemContent={channelDataRowContent}
					/>
				</Paper>
			</Grid>
			<Grid alignItems="center" display="flex" direction="column" item xs={2}>
				<IpEntry
					channel="B"
					channelConnected={channelBConnected}
					connectToChannel={connectToChannelB}
					onChange={handleChannelIPChange}
					value={channelBIP}
				/>
				<Paper style={{ height: 500, width: "100%" }}>
					<TableVirtuoso
						data={channelBData}
						components={ChannelTableComponents}
						fixedHeaderContent={() => channelHeaderContent("B")}
						itemContent={channelDataRowContent}
					/>
				</Paper>
			</Grid>
		</Grid>
	);
}

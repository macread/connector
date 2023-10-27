import React, { useEffect, useState } from "react";
import axios from "axios";
import {
	FormControl,
	Input,
	InputLabel,
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

interface ColumnData {
	dataKey: keyof Data;
	label: string;
	numeric?: boolean;
	width: number;
}

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

const channelHeader: ColumnData[] = [
	{
		width: 40,
		label: "Channel",
		dataKey: "timyTime",
		numeric: true,
	},
];

const VirtuosoTableComponents: TableComponents<Data> = {
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

function channelDataRowContent(_index: number, row: Data) {
	return (
		<React.Fragment>
			{raceDataColumn.map((column) => (
				<TableCell key={column.dataKey} align={"center"}>
					{row[column.dataKey]}
				</TableCell>
			))}
		</React.Fragment>
	);
}

export default function Connector() {
	const [rrAPI, setRrAPI] = useState<string>();
	const [channelAConnected, setChannelAConnected] = useState<boolean>(false);
	const [channelBConnected, setChannelBConnected] = useState<boolean>(false);
	const [channelAIP, setChannelAIP] = useState<string>();
	const [channelBIP, setChannelBIP] = useState<string>();
	const [data, setData] = useState<Data[]>();

	const connectToChannelA = () => {
		if (channelAConnected) {
			setChannelAConnected(false);
		} else {
			setChannelAConnected(true);
		}
	};

	const connectToChannelB = () => {
		if (channelBConnected) {
			setChannelBConnected(false);
		} else {
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
		if (rrAPI) {
			axios
				.get(rrAPI)
				.then(function (response) {
					// handle success
					console.log("response :>> ", response);
					setData(response.data);
				})
				.catch(function (error) {
					// handle error
					console.log(error);
				});
		}
	}, [rrAPI]);

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
				<FormControl sx={{ m: 1, width: "100%" }} variant="standard">
					<InputLabel htmlFor="channel">r|r API URL</InputLabel>
					<Input
						id="rrAPIURL"
						onChange={(e) => setRrAPI(e.target.value)}
						type="text"
						value={rrAPI}
					/>
				</FormControl>
				<Grid item width="100%">
					<Paper style={{ height: 500, width: "100%" }}>
						<TableVirtuoso
							data={data}
							components={VirtuosoTableComponents}
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
						// data={rows}
						components={VirtuosoTableComponents}
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
						// data={rows}
						components={VirtuosoTableComponents}
						fixedHeaderContent={() => channelHeaderContent("B")}
						itemContent={channelDataRowContent}
					/>
				</Paper>
			</Grid>
		</Grid>
	);
}

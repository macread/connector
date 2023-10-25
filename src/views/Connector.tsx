import * as React from "react";

import {
	Grid,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
} from "@mui/material";
import { TableVirtuoso, TableComponents } from "react-virtuoso";

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
		label: "Chip\u00A0Start",
		dataKey: "chipStart",
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

export default function ReactVirtualizedTable() {
	return (
		<Grid container direction="row" spacing={4}>
			<Grid
				item
				direction="column"
				justifyContent="flex-start"
				alignItems="flex-start"
				xs={8}
			>
				<Grid direction="row" item xs={2}>
					<TextField
						id="rrAPI"
						InputLabelProps={{
							shrink: true,
						}}
						label="r|r API"
						sx={{ width: "75%" }}
					/>
					<TextField
						id="updateRate"
						InputLabelProps={{
							shrink: true,
						}}
						label="Update Rate (sec)"
						sx={{ width: "25%" }}
						type="number"
					/>
				</Grid>
				<Grid item xs={12}>
					<Paper style={{ height: 500, width: "100%" }}>
						<TableVirtuoso
							// data={rows}
							components={VirtuosoTableComponents}
							fixedHeaderContent={raceDataHeaderContent}
							itemContent={raceDataRowContent}
						/>
					</Paper>
				</Grid>
			</Grid>
			<Grid direction="column" item xs={2}>
				<TextField
					id="aChannelIP"
					InputLabelProps={{
						shrink: true,
					}}
					label="A Channel IP"
					sx={{ width: "100%" }}
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
			<Grid direction="column" item xs={2}>
				<TextField
					id="bChannelIP"
					InputLabelProps={{
						shrink: true,
					}}
					label="B Channel IP"
					sx={{ width: "100%" }}
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

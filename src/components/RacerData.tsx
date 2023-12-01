import React from "react";
import { TableVirtuoso, TableComponents } from "react-virtuoso";
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
import { ConnectorDataContainer } from "containers";
import UrlEntry from "./urlEntry";
import { IRacerData } from "types";

interface ColumnData {
	dataKey: keyof IRacerData;
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

const RaceDataTableComponents: TableComponents<IRacerData> = {
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

const raceDataHeaderContent = () => {
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
};

const raceDataRowContent = (_index: number, row: IRacerData) => {
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
};

const RacerData: React.FC = () => {
	const {
		racerData,
		rrAPIURL,
		setRrAPIURL,
	} = ConnectorDataContainer.useContainer();

	return (
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
						data={racerData}
						components={RaceDataTableComponents}
						fixedHeaderContent={raceDataHeaderContent}
						itemContent={raceDataRowContent}
					/>
				</Paper>
			</Grid>
		</Grid>
	);
};

export default RacerData;

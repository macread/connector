export interface IRacerData {
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
};

export interface ITimyData {
	timyTime: string;
};

export interface ITimingData{
	source: string;
	time: string;
	timeInSeconds: number;
};

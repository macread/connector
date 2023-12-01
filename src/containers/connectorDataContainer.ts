import { useEffect, useState } from 'react';
import axios from "axios";
import { createContainer } from 'unstated-next';
import { IRacerData, ITimyData, ITimingData } from '../types';

const convertToSeconds = (time: string): number => {
	const timeParts: string[] = time.split(":");
	const hours: number = parseInt(timeParts[0]);
	const minutes: number = parseInt(timeParts[1]);
	const seconds: number = parseFloat(timeParts[2]);
	return hours * 3600 + minutes * 60 + seconds;
}

const handleMessageData = (time: string): ITimingData => {
	const messageParts: string[] = time.split(": ");
	return {
		source: messageParts[0],
		time: messageParts[1],
		timeInSeconds: convertToSeconds(messageParts[1])
	}
}

const useConnectorDataContainer = () => {
	const [channelAData, setChannelAData] = useState<ITimyData[] | undefined >([]);
	const [channelATimingData, setChannelATimingData] = useState<ITimingData[] >([]);
	const [channelAMessage, setChannelAMessage] = useState<ITimyData | undefined>();
	const [channelBData, setChannelBData] = useState<ITimyData[] | undefined >([]);
	const [channelBTimingData, setChannelBTimingData] = useState<ITimingData[]>([]);
	const [channelBMessage, setChannelBMessage] = useState<ITimyData | undefined>();
	const [racerData, setRacerData] = useState<IRacerData[]>();
	const [rrAPIURL, setRrAPIURL] = useState<string>();

	useEffect(() => {
		if (rrAPIURL) {
			axios
				.get(rrAPIURL)
				.then(function (response) {
					// handle success
					setRacerData(response.data);
				})
				.catch(function (error) {
					// handle error
					console.log(error);
				});
		}
	}, [rrAPIURL]);

	useEffect(() => {
		if (channelAMessage && channelAData)  {
			setChannelAData([...channelAData, ...[channelAMessage]]);
			setChannelATimingData([...channelATimingData, ...[handleMessageData(channelAMessage.timyTime)]]);
		}
	}, [channelAMessage]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (channelBMessage && channelBData)  {
			setChannelBData([...channelBData, ...[channelBMessage]]);
			setChannelBTimingData([...channelBTimingData, ...[handleMessageData(channelBMessage.timyTime)]]);
		}
	}, [channelBMessage]); // eslint-disable-line react-hooks/exhaustive-deps

    return { 
        channelAData,
		setChannelAData,
        setChannelAMessage, 
		setChannelATimingData,
        channelBData,
		setChannelBData,
		setChannelBMessage,
		setChannelBTimingData,
		handleMessageData,
        racerData, 
        setRacerData, 
        rrAPIURL, 
        setRrAPIURL 
    }
};

export const ConnectorDataContainer = createContainer(useConnectorDataContainer);
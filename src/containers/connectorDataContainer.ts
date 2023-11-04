import { useEffect, useState } from 'react';
import axios from "axios";
import { createContainer } from 'unstated-next';
import { IRacerData, ITimyData } from '../types';

const useConnectorDataContainer = () => {
	const [channelAData, setChannelAData] = useState<ITimyData[] | undefined >([]);
	const [channelAMessage, setChannelAMessage] = useState<ITimyData | undefined>();
	const [channelBData, setChannelBData] = useState<ITimyData[] | undefined >([]);
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
		}
	}, [channelAMessage]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (channelBMessage && channelBData)  {
			setChannelBData([...channelBData, ...[channelBMessage]]);
		}
	}, [channelBMessage]); // eslint-disable-line react-hooks/exhaustive-deps

    return { 
        channelAData, 
        setChannelAMessage, 
        channelBData, 
		setChannelBMessage,
        racerData, 
        setRacerData, 
        rrAPIURL, 
        setRrAPIURL 
    }
};

export const ConnectorDataContainer = createContainer(useConnectorDataContainer);
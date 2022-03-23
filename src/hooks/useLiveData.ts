/* eslint-disable no-useless-escape */
import { useEffect, useState } from 'react';
type LiveData = {
    [key: string]: {
        live: number,
        today: number,
    }
}
const useLiveData = () => {
    const [liveData, setLiveData] = useState<LiveData | undefined>();
    useEffect(() => {
        getLiveData().then(res => {
            if (res) {
                setLiveData(res);
            }
        }).catch((e) => {
            // eslint-disable-next-line no-console
            console.log('Failed to fetch live data,', e);
        });
    }, []);
    return liveData;
};

const getLiveData = async (): Promise<LiveData> => {
    const uri = 'https://frisbeegolfradat.fi/wp-json/course-statistics/ajax?activeTab=0';
    const data = await (await fetch(uri)).json();
    const radatHTML = data.html.match(/<tbody>([\s\S]*?)<\/tbody>/ig)[0].split('\n');
    const radat: LiveData = {};
    let radanNimi = '';
    for (const rivi of radatHTML) {
        if (rivi.includes('class=\"title\"')) {
            radanNimi = stripTags(rivi);
            radat[radanNimi] = { live: 0, today: 0 };
        } else if (rivi.includes('class=\"live-indicator')) {
            radat[radanNimi].live = Number.parseInt(stripTags(rivi));
        } else if (rivi.includes('class=\"today')) {
            radat[radanNimi].today = Number.parseInt(stripTags(rivi));
        }
    }
    return radat;
};
const stripTags = (str: string) => {
    return str.replace(/(<([^>]+)>)/gi, "");
};
export default useLiveData;
import { useEffect, useState } from 'react';
export type LiveData = {
    name: string,
    liveNow: number,
    liveToday: number
}
const useLiveData = (enabled = true) => {
    const [liveData, setLiveData] = useState<LiveData[]>([]);
    useEffect(() => {
        if (enabled) fetchLiveData().then(setLiveData);
    }, [enabled]);
    return liveData;
};

const fetchLiveData = async () => {
    const uri = 'https://frisbeegolfradat.fi/wp-json/course-statistics/ajax?activeTab=0';
    const data = fetch(uri).then(response => response.json()).then(data => {
        const radat = data.html.match(/(<tr>)(.*?)(<\/tr>)/igs)
            .map((course: string) => {
                const {name, liveNow, liveToday} = course.split('\n').reduce((acc, curr) => {
                    if (curr.includes('class="title"')) return {...acc, name: stripTags(curr)};
                    if (curr.includes('class="live-indicator')) return {...acc, liveNow: stripTags(curr)};
                    if (curr.includes('class="toda')) return {...acc, liveToday: stripTags(curr)};
                    return acc;
                }, {name: '', liveNow: '', liveToday: ''});
                return {name, liveNow, liveToday};
            });
        return radat;
    }).catch(() => []);
    return data;
};

const stripTags = (str?: string) => str ? str.replace(/(<([^>]+)>)/gi, "") : '';


export default useLiveData;
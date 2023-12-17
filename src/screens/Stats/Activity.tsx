import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { View, Text, Dimensions } from "react-native";
import { Headline } from "react-native-paper";
import { GET_ACTIVITY } from '../../graphql/queries';
import Loading from '../../components/Loading';
import { BarChart } from 'react-native-chart-kit';
import { theme } from '../../utils/theme';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';
import PrevNextSelector from '../../components/PrevNextSelector';

const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];

const Activity = () => {
    const [selectedYear, setSelectedYear] = useState<number>();
    const { data, error, loading } = useQuery<ActivityResponse>(GET_ACTIVITY, {variables: {year: selectedYear}});

    if (loading) {
        return <Loading noFullScreen />;
    }

    if (error) {
        return <><Text style={{ fontWeight: 'bold' }}>Error!</Text><Text>Loading past activity failed :/</Text></>;
    }

    if (!data?.getPastActivity) {
        return <Text>You haven&apos;t played any games apparently.</Text>;
    }

    const chartData = {
        labels: data?.getPastActivity.months.map(month => monthNames[month.month-1]) ?? [],
        datasets: [
            { data: data?.getPastActivity.months.map(month => month.games) ?? []}
        ],
    };

    const selectorOptions = [
        {label: 'Year 2022', value: 2022},
        {label: 'Year 2023', value: 2023},
        {label: 'Last 12 months', value: undefined},
    ];


    return (
        <View>
            <Headline style={{paddingLeft: 15}}>Your activity</Headline>
            <PrevNextSelector
                options={selectorOptions}
                onChange={setSelectedYear}
                selected={selectedYear}
                delay={1000}
            />
            <BarChart
                data={chartData}
                withHorizontalLabels={false}
                style={{ paddingRight: 0}}
                height={250}
                yAxisLabel=""
                width={Dimensions.get('window').width+1}
                chartConfig={chartConfig}
                yAxisSuffix=''
                showValuesOnTopOfBars
            />
            <Text style={{padding: 5}}>
                Total of {data?.getPastActivity.months.reduce((acc, curr) => acc + curr.games, 0)} games between {data.getPastActivity.from} - {data.getPastActivity.to}
            </Text>
        </View>
    );
};

export default Activity;

const chartConfig: AbstractChartConfig = {
    backgroundGradientTo: theme.colors.accent,
    backgroundGradientToOpacity: 0.75,
    backgroundGradientFrom: theme.colors.accent,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    barPercentage: 0.50,
};

type ActivityResponse = {
    getPastActivity: {
        from: number
        to: number
        months: {
            month: number
            games: number
        }[]
    }
}

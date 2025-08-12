import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { View, Text, Dimensions } from "react-native";
import { GET_ACTIVITY } from '../../graphql/queries';
import Loading from '../../components/Loading';
import { BarChart } from 'react-native-chart-kit';
import { theme } from '../../utils/theme';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';
import PrevNextSelector from '../../components/PrevNextSelector';
import { User } from '../../types/user';

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

type Props = {
    selectedUser?: User
}

const Activity = ({selectedUser}: Props) => {
    const [selectedYear, setSelectedYear] = useState<number>();
    const { data, error, loading } = useQuery<ActivityResponse>(GET_ACTIVITY, {
        variables: {
            year: selectedYear,
            userId: selectedUser?.id
        },
        fetchPolicy: 'cache-first'
    });

    if (loading) {
        return <Loading noFullScreen />;
    }

    if (error) {
        return <><Text style={{ fontWeight: 'bold' }}>Error!</Text><Text>Loading past activity failed :/</Text></>;
    }

    const chartData = {
        labels: data?.getPastActivity.months.map(month => monthNames[month.month-1]) ?? [],
        datasets: [
            { data: data?.getPastActivity.months.map(month => month.games) ?? []}
        ],
    };

    const currentYear = new Date().getFullYear();

    const years: {label: string, value: number | undefined}[] = Array
        .from({length: currentYear - 2022 + 1}, (_, i) => ({label: `Year ${2022 + i}`, value: 2022 + i}));

    const selectorOptions = years.concat(
        {label: 'Last 12 months', value: undefined}
    );


    return (
        <View>
            <PrevNextSelector
                options={selectorOptions}
                onChange={setSelectedYear}
                selected={selectedYear}
                delay={500}
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
                Total of {data?.getPastActivity.months.reduce((acc, curr) => acc + curr.games, 0)} games between {data?.getPastActivity.from} - {data?.getPastActivity.to}
            </Text>
        </View>
    );
};

export default Activity;

const chartConfig: AbstractChartConfig = {
    backgroundGradientTo: theme.colors.secondary,
    backgroundGradientToOpacity: 0.75,
    backgroundGradientFrom: theme.colors.primary,
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

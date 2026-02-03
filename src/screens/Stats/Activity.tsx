import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { View, Text, Dimensions } from "react-native";
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
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
        return <><Text style={{ fontWeight: 'bold' }}>{t('screens.stats.activity.error')}</Text><Text>{t('screens.stats.activity.loadingFailed')}</Text></>;
    }

    const chartData = {
        labels: data?.getPastActivity.months.map(month => monthNames[month.month-1]) ?? [],
        datasets: [
            { data: data?.getPastActivity.months.map(month => month.games) ?? []}
        ],
    };

    const currentYear = new Date().getFullYear();

    const years: {label: string, value: number | undefined}[] = Array
        .from({length: currentYear - 2022 + 1}, (_, i) => ({label: t('screens.stats.activity.year', {year: 2022 + i}), value: 2022 + i}));

    const selectorOptions = years.concat(
        {label: t('screens.stats.activity.last12Months'), value: undefined}
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
                {t('screens.stats.activity.totalGames', {games: data?.getPastActivity.months.reduce((acc, curr) => acc + curr.games, 0), from: data?.getPastActivity.from, to: data?.getPastActivity.to})}
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

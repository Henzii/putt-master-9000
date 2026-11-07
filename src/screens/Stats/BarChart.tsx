import React from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { StackedBarChart } from "react-native-chart-kit";
import { useTheme } from 'react-native-paper';
import type { AppTheme } from '../../utils/theme';
import { SingleStats } from '../../types/stats';

const LEFT_MARGIN = 70;

const parseData = (stats: SingleStats[]) => {
    return stats.reduce((prev, curr) => {
        return [...prev, [
            curr.eagle,
            curr.birdie,
            curr.par,
            curr.bogey,
            curr.doubleBogey,
            (curr.count - curr.eagle - curr.birdie - curr.par - curr.bogey - curr.doubleBogey)
        ]];
    }, [] as number[][]);
};

const calcChartWidth = (holes: number) => {
    const singleBarWidth = Dimensions.get('screen').width / holes;
    if (singleBarWidth > 30) return Dimensions.get('screen').width + LEFT_MARGIN;
    return 45 * holes + LEFT_MARGIN;
};

const BarChart = ({stats, holes}: {stats: SingleStats[] | undefined, holes: number}) => {
    const {colors} = useTheme<AppTheme>();
    if (!stats) return null;
    const labels = Array.from({length: holes}, (_, i) => (i + 1).toString());
    const barColors = [
        colors.scoreColors.eagle,
        colors.scoreColors.birdie,
        colors.scoreColors.par,
        colors.scoreColors.bogey,
        colors.scoreColors.doubleBogey,
        colors.scoreColors.other
    ];
    const data = {
        labels,
        legend: [],
        data: parseData(stats),
        barColors,
    };
    const chartConfig = {
        backgroundGradientTo: colors.surface,
        backgroundGradientFrom: colors.surface,
        color: () => colors.onSurface,
        labelColor: () => colors.onSurface,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.75,
        useShadowColorFromDataset: false // optional,
      };
    return (
        <ScrollView horizontal>
            <StackedBarChart
                height={220}
                width={calcChartWidth(holes)}
                hideLegend
                data={data}
                chartConfig={chartConfig}
                withHorizontalLabels={false}
                style={{
                    marginLeft: -LEFT_MARGIN,
                }}
            />
        </ScrollView>
    );
};

export default BarChart;
import React from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { StackedBarChart } from "react-native-chart-kit";
import { useTheme } from 'react-native-paper';
import { SingleStats } from "../../hooks/useStats";
import { scoreColors } from '../../utils/theme';

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

const barColors = [
    scoreColors.eagle,
    scoreColors.birdie,
    scoreColors.par,
    scoreColors.bogey,
    scoreColors.doubleBogey,
    'red'
];

const calcChartWidth = (holes: number) => {
    const width = holes * 45;
    if (width < Dimensions.get('screen').width) return Dimensions.get('screen').width + LEFT_MARGIN;
    return width;
};

const BarChart = ({stats, holes}: {stats: SingleStats[] | undefined, holes: number}) => {
    const {colors} = useTheme();
    if (!stats) return null;
    const labels = Array.from({length: holes}, (_, i) => (i + 1).toString());
    const data = {
        labels,
        legend: [],
        data: parseData(stats),
        barColors,
    };
    const chartConfig = {
        backgroundGradientTo: colors.accent,
        backgroundGradientToOpacity: 0.4,
        backgroundGradientFrom: colors.accent,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
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
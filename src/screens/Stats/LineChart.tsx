import React from 'react';
import { LineChart as NativeLineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

type LineChartProps = {
    data: number[],
    par: number,
}

const LineChart = ({ data, par }: LineChartProps) => {
    const { colors } = useTheme();
    // Haetaan tulosten min ja max arvot ja lisätään/vähennetään 3 jotta käppyrä näyttää enemmän/vähemmän kuin min/max arvo
    let minValue = Math.min(...data) - 3;
    const maxValue = Math.max(...data) + 3;

    if ((minValue-maxValue) % 2 !== 0) minValue += 1;
    return (
        <NativeLineChart
            data={{
                labels: [],
                datasets: [
                    {
                        data
                    },
                    {
                        data: [minValue],
                        withDots: false,
                    },
                    {
                        data: [maxValue],
                        withDots: false
                    },
                    {
                        data: new Array(data.length).fill(par),
                        withDots: false,
                        color: () => '#40ff4080',
                    },
                    {
                        data: new Array(data.length).fill(Math.min(...data)),
                        withDots: false,
                        color: () => '#4c99ef60'
                    }
                ],
            }}
            height={220}
            width={Dimensions.get('screen').width*0.9}
            yAxisInterval={2} // optional, defaults to 1
            chartConfig={{
                backgroundGradientTo: colors.accent,
                backgroundGradientToOpacity: 0.4,
                backgroundGradientFrom: colors.accent,
                decimalPlaces: 0, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                    borderRadius: 7
                },
                propsForDots: {
                    r: "2",
                    strokeWidth: "4",
                    stroke: colors.surface,
                }
            }}
            bezier
            style={{
                marginVertical: 8,
                borderRadius: 7,
            }}
        />);
};
export default LineChart;
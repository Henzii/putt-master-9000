import React from 'react';
import { Dimensions } from 'react-native';
import Svg, { Path } from "react-native-svg";

const RoundBottom = ({fill}: {fill: string}) => {
    const screenWidth = Dimensions.get('window').width;

    return (
        <Svg width={screenWidth} height="40" style={{marginTop: -0.1}}>
            <Path
            d={`M-5,0 Q${screenWidth / 2},80 ${screenWidth+5},0 H0 Z`}
            fill={fill}
            />
        </Svg>
    );
};


export default RoundBottom;
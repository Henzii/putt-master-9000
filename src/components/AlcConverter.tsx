import React, { useMemo, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Headline, TextInput } from "react-native-paper";
import { useTranslation } from 'react-i18next';
import Container from "./ThemedComponents/Container";

type DrinkInputProps = {
    drinkName: string,
    handleChange: (d: Drink, val: string) => void,
    testID?: string,
}
function DrinkInput({ drinkName, handleChange, testID }: DrinkInputProps) {
    return (
        <TextInput
            testID={testID}
            style={styles.input}
            autoComplete='off'
            mode="outlined"
            dense
            onChangeText={(val) => handleChange(drinkName as Drink, val)}
            keyboardType='numeric'
        />
    );
}
type Drink = 'long' | 'wine' | 'strong' | 'normal' | 'longstrong'

export const defaultValues = {
    strong: {
        count: 0,
        multiplier: 1.25,
    },
    longstrong: {
        count: 0,
        multiplier: 1.9,
    },
    wine: {
        count: 0,   // dl
        multiplier: 0.9,
    },
    long: {
        count: 0,
        multiplier: 1.5151,
    },
    normal: {
        count: 0,
        multiplier: 1,
    }
};

export default function AlcConverter() {
    const { t } = useTranslation();
    const [drinks, setDrinks] = useState(defaultValues);
    const beers = useMemo(() => {
        const sum = Object.values(drinks).reduce((prev: number, curr) => {
            return prev + (curr.count * curr.multiplier);
        }, 0);
        return Math.round(sum*100)/100;
    }, [drinks]);
    const handleChange = (drink: Drink, val: string) => {
        const valInt = Number.parseInt(val) || 0;
        if (isNaN(valInt)) return;
        setDrinks({ ...drinks, [drink]: { ...drinks[drink], count: valInt } });
    };
    return (
        <Container noPadding withScrollView>
            <Headline>{t('components.alcConverter.title')}</Headline>
            <View style={styles.row}>
                <Text style={styles.text}>{t('components.alcConverter.beer.long')}</Text>
                <DrinkInput drinkName="long" handleChange={handleChange} testID="long" />
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>{t('components.alcConverter.beer.strong')}</Text>
                <DrinkInput drinkName="strong" handleChange={handleChange} testID="strong" />
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>{t('components.alcConverter.beer.longAndStrong')}</Text>
                <DrinkInput drinkName="longstrong" handleChange={handleChange} testID="longandstrong" />
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>{t('components.alcConverter.wine.title')}</Text>
                <DrinkInput drinkName="wine" handleChange={handleChange} testID="wine" />
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>{t('components.alcConverter.other.normal')}</Text>
                <DrinkInput drinkName="normal" handleChange={handleChange} testID="normal" />
            </View>
            <View style={[{ marginTop: 20 }, styles.row]}>
                <Text style={styles.text}>{t('components.alcConverter.total')}</Text>
                <Text testID="beers">{beers} {t('components.alcConverter.beers')}</Text>
            </View>

        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        minWidth: 120,
    },
    input: {
        width: 100,
    }
});

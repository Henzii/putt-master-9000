import Container from '@components/ThemedComponents/Container';
import Button from '@components/ThemedComponents/Button';
import Spacer from '@components/ThemedComponents/Spacer';
import { Text } from 'react-native-paper';
import React from 'react';
import { useTranslation } from 'react-i18next';

type InfoProps = {
    onCreateGame: () => void;
};

export const Info = ({ onCreateGame }: InfoProps) => {
    const { t } = useTranslation();
    return (
        <Container withScrollView>
            <Text variant="titleMedium">{t("screens.ragePutt.aboutTitle")}</Text>
            <Spacer size={4} />
            <Text>{t("screens.ragePutt.description")}</Text>
            <Spacer size={16} />
            <Text variant="titleMedium">{t("screens.ragePutt.rulesTitle")}</Text>
            <Spacer size={4} />
            <Text>{t("screens.ragePutt.rules")}</Text>
            <Spacer size={16} />
            <Text variant="titleMedium">{t("screens.ragePutt.oldGamesTitle")}</Text>
            <Spacer size={4} />
            <Text>{t("screens.ragePutt.oldGamesInfo")}</Text>
            <Spacer size={16} />
            <Button onPress={onCreateGame}>{t("screens.ragePutt.startNewGame")}</Button>
        </Container>
    );
};
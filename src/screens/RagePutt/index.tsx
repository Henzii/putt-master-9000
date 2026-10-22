import React, { useState } from "react";
import { BottomNavigation } from "react-native-paper";
import { RageputtGame } from "./RageputtGame";
import { OldRages } from "./OldRages";
import { Info } from './Info';
import { useTranslation } from "react-i18next";


export const RagePutt = () => {
    const { t } = useTranslation();
    const [pageIndex, setPageIndex] = useState(0);
    const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
    const routes = [
        { key: 'info', title: t("screens.ragePutt.tabs.info"), focusedIcon: 'information-outline', unfocusedIcon: 'information-outline'},
        { key: 'game', title: t("screens.ragePutt.tabs.game"), focusedIcon: 'golf', unfocusedIcon: 'golf' },
        { key: 'oldGames', title: t("screens.ragePutt.tabs.oldGames"), focusedIcon: 'history', unfocusedIcon: 'history' },
    ];

    return <BottomNavigation
        navigationState={{ index: pageIndex, routes }}
        onIndexChange={setPageIndex}
        renderScene={({ route }) => {
            switch (route.key) {
                case "game":
                    return <RageputtGame gameId={selectedGameId} onGameIdChange={setSelectedGameId} />;
                case "oldGames":
                    return (
                        <OldRages
                            onSelectGame={(gameId) => {
                                setSelectedGameId(gameId);
                                setPageIndex(1);
                            }}
                            onDeleteGame={(gameId) => {
                                setSelectedGameId((selectedId) => selectedId === gameId ? null : selectedId);
                            }}
                        />
                    );
                case "info":
                    return (
                        <Info
                            onCreateGame={() => {
                                setSelectedGameId(null);
                                setPageIndex(1);
                            }}
                        />
                    );
                default:
                    return null;
            }
        }}
    />;
};
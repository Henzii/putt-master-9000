import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { format } from "date-fns";
import { Alert, FlatList, Pressable, StyleSheet, View } from "react-native";
import { Chip, IconButton, Text, useTheme } from "react-native-paper";
import Loading from "@components/Loading";
import { GET_RAGE_PUTT_GAMES } from "src/graphql/queries";
import ErrorScreen from "@components/ErrorScreen";
import { RagePuttGame } from "src/types/ragetputt";
import { useAuthenticatedUser } from "src/context/AuthenticatedUserContext";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import { DELETE_RAGE_PUTT_GAME } from "src/graphql/mutation";
import { addNotification } from "src/reducers/notificationReducer";
import { useDispatch } from "react-redux";
import { extractApolloErrorMessage } from "src/utils/apollo";
import { useTranslation } from "react-i18next";

type GetRageputtGamesResponse = {
    getRagePuttGames: RagePuttGame[];
};

type OldRagesProps = {
    onSelectGame: (gameId: string) => void;
    onDeleteGame: (gameId: string) => void;
};

export const OldRages = ({ onSelectGame, onDeleteGame }: OldRagesProps) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const user = useAuthenticatedUser();
    const dispatch = useDispatch();
    const { data, loading, error } = useQuery<GetRageputtGamesResponse>(GET_RAGE_PUTT_GAMES, {
        fetchPolicy: "cache-and-network",
    });
    const [deleteGame, { loading: deleting }] = useMutation<{ deleteRagePuttGame: boolean }, { gameId: string }>(
        DELETE_RAGE_PUTT_GAME,
        { refetchQueries: [{ query: GET_RAGE_PUTT_GAMES }], awaitRefetchQueries: true }
    );

    const games = data?.getRagePuttGames;

    const confirmDeleteGame = (game: RagePuttGame) => {
        Alert.alert(
            t("screens.ragePutt.deleteTitle"),
            t("screens.ragePutt.deleteConfirmation"),
            [
                { text: t("common.cancel"), style: "cancel" },
                {
                    text: t("common.delete"),
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const result = await deleteGame({ variables: { gameId: game.id } });
                            if (!result.data?.deleteRagePuttGame) {
                                throw new Error(t("screens.ragePutt.deleteNotConfirmed"));
                            }
                            onDeleteGame(game.id);
                            dispatch(addNotification(t("screens.ragePutt.gameDeleted"), "success"));
                        } catch (deleteError) {
                            const message = extractApolloErrorMessage(deleteError)
                                ?? (deleteError instanceof Error ? deleteError.message : t("screens.ragePutt.unknownError"));
                            dispatch(addNotification(t("screens.ragePutt.deleteFailed", { message }), "alert"));
                        }
                    },
                },
            ]
        );
    };

    if (loading && !games) {
        return <Loading />;
    }

    if (error && !games) {
        return <ErrorScreen errorMessage={error.message} />;
    }

    if (!games?.length) {
        return (
            <View style={styles.empty}>
                <Text>{t("screens.ragePutt.noGames")}</Text>
            </View>
        );
    }

    return (
        <FlatList
            contentContainerStyle={styles.list}
            data={games}
            keyExtractor={(game) => game.id}
            renderItem={({ item: game }) => {
                const myScorecard = game.scorecards.find((scorecard) => String(scorecard.user.id) === String(user.id));
                const otherScorecards = game.scorecards.filter((scorecard) => String(scorecard.user.id) !== String(user.id));
                const timestamp = Number(game.startTime);
                const date = new Date(Number.isNaN(timestamp) ? game.startTime : timestamp);
                const startedAt = Number.isNaN(date.getTime()) ? t("screens.ragePutt.unknownDate") : format(date, "dd.MM.yyyy HH:mm");

                return (
                    <View style={styles.game}>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={t("screens.ragePutt.openGameAccessibility", { date: startedAt })}
                            onPress={() => onSelectGame(game.id)}
                            style={styles.gameContent}
                        >
                            <View style={styles.gameHeader}>
                                <View>
                                    <Text variant="titleMedium" style={styles.gameTitle}>RagePutt</Text>
                                    <Text variant="bodySmall" style={styles.gameDate}>{startedAt}</Text>
                                </View>
                                {!game.isFinished && (
                                <Chip compact icon={"lock-open-variant"}>
                                    {t("screens.ragePutt.inProgress")}
                                </Chip>
                                )}
                                {game.mode === "quick" && (
                                    <Chip compact>{t("screens.ragePutt.quickGame")}</Chip>
                                )}
                            </View>
                            <Text variant="headlineMedium" style={styles.myPoints}>
                                {myScorecard?.points ?? "—"}
                            </Text>
                            <Text variant="labelMedium" style={styles.myPointsLabel}>{t("screens.ragePutt.yourPoints")}</Text>
                            {otherScorecards.length > 0 && (
                                <View style={styles.otherPlayers}>
                                    {otherScorecards.map((scorecard) => (
                                        <Chip key={scorecard.id} compact>
                                            {scorecard.user.name}: {scorecard.points ?? "—"}
                                        </Chip>
                                    ))}
                                </View>
                            )}
                        </Pressable>
                        <IconButton
                            accessibilityLabel={t("screens.ragePutt.deleteGameAccessibility")}
                            icon="delete-outline"
                            onPress={() => confirmDeleteGame(game)}
                            disabled={deleting}
                        />
                    </View>
                );
            }}
        />
    );
};

const createStyles = (colors: MD3Colors) => StyleSheet.create({
    list: {
        padding: 16,
        gap: 12,
    },
    empty: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    game: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 12,
        backgroundColor: colors.surface,
        elevation: 2,
    },
    gameContent: {
        flex: 1,
    },
    gameHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
    },
    gameTitle: {
        color: colors.onSurface,
        fontWeight: "600",
    },
    gameDate: {
        color: colors.onSurfaceVariant,
    },
    myPoints: {
        marginTop: 12,
        color: colors.primary,
        fontWeight: "bold",
    },
    myPointsLabel: {
        color: colors.onSurfaceVariant,
    },
    otherPlayers: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 12,
    },
});
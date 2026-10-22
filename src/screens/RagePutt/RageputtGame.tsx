
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useMutation, useQuery } from "@apollo/client";
import { ActivityIndicator, Chip, Text, useTheme } from "react-native-paper";
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import Button from "@components/ThemedComponents/Button";
import Container from "@components/ThemedComponents/Container";
import Loading from "@components/Loading";
import ErrorScreen from "@components/ErrorScreen";
import Spacer from "@components/ThemedComponents/Spacer";
import { UPDATE_RAGE_PUTT_SCORECARD } from "src/graphql/mutation";
import { GET_RAGE_PUTT_GAME } from "src/graphql/queries";
import { addNotification } from "src/reducers/notificationReducer";
import { useDispatch } from "react-redux";
import { RagePuttGame as RagePuttGameType } from "src/types/ragetputt";
import { updateRagePuttScorecardCache, UpdatedRagePuttScorecard } from "src/utils/ragePuttCacheUpdates";
import { CreateRagePuttGame } from "./CreateRagePuttGame";
import { useTranslation } from "react-i18next";

const DEFAULT_TOTAL_ROUNDS = 20;
const QUICK_TOTAL_ROUNDS = 10;
const PUTTS_PER_ROUND = 5;

type RageputtGameProps = {
    gameId: string | null;
    onGameIdChange: (gameId: string | null) => void;
};

type RagePuttGameResponse = {
    getRagePuttGame: RagePuttGameType | null;
};

type UpdateScorecardResponse = {
    updateRagePuttScorecard: UpdatedRagePuttScorecard;
};

type UpdateScorecardVariables = {
    gameId: string;
    playerId: string | number;
    scores: number[];
};

export const RageputtGame = ({ gameId, onGameIdChange }: RageputtGameProps) => {
    const { t } = useTranslation();
    const savingPlayers = useRef(new Set<string>());
    const [pendingScoresByPlayer, setPendingScoresByPlayer] = useState<Record<string, number | null>>({});
    const [selectedRound, setSelectedRound] = useState<number | null>(null);
    const dispatch = useDispatch();
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const { data, loading, error } = useQuery<RagePuttGameResponse>(GET_RAGE_PUTT_GAME, {
        variables: { gameId },
        skip: !gameId,
        fetchPolicy: "cache-and-network",
    });
    const [updateScorecard, { loading: saving }] = useMutation<UpdateScorecardResponse, UpdateScorecardVariables>(
        UPDATE_RAGE_PUTT_SCORECARD,
        {
            update: (cache, { data: mutationData }) => {
                const updatedScorecard = mutationData?.updateRagePuttScorecard;
                if (gameId && updatedScorecard) {
                    updateRagePuttScorecardCache(cache, gameId, updatedScorecard);
                }
            },
        }
    );

    const game = data?.getRagePuttGame;
    const totalRounds = game?.mode === "quick" ? QUICK_TOTAL_ROUNDS : DEFAULT_TOTAL_ROUNDS;

    useEffect(() => {
        setSelectedRound(null);
    }, [gameId]);

    const currentRound = selectedRound ?? 1;
    const currentRoundIndex = currentRound - 1;

    const selectRoundScore = async (scorecard: RagePuttGameType["scorecards"][number], score: number) => {
        const scores = scorecard.scores ?? [];
        const playerId = String(scorecard.user.id);
        const isEditingExistingRound = currentRoundIndex < scores.length;
        if (
            !game ||
            (game.isFinished && !isEditingExistingRound) ||
            currentRoundIndex > scores.length ||
            scores[currentRoundIndex] === score ||
            savingPlayers.current.has(playerId)
        ) return;

        savingPlayers.current.add(playerId);
        setPendingScoresByPlayer((current) => ({ ...current, [playerId]: score }));
        try {
            const updatedScores = [...scores];
            updatedScores[currentRoundIndex] = score;
            await updateScorecard({
                variables: {
                    gameId: game.id,
                    playerId: scorecard.user.id,
                    scores: updatedScores,
                },
            });
        } catch (saveError) {
            const message = saveError instanceof Error ? saveError.message : t("screens.ragePutt.unknownError");
            dispatch(addNotification(t("screens.ragePutt.scoreSaveFailed", { name: scorecard.user.name, message }), "alert"));
        } finally {
            savingPlayers.current.delete(playerId);
            setPendingScoresByPlayer((current) => ({ ...current, [playerId]: null }));
        }
    };

    if (!gameId) {
        return <CreateRagePuttGame onGameCreated={onGameIdChange} />;
    }

    if (loading && !game) {
        return <Loading />;
    }

    if (error && !game) {
        return <ErrorScreen errorMessage={error.message} />;
    }

    if (!game) {
        return (
            <Container>
                <Text>{t("screens.ragePutt.gameNotFound")}</Text>
                <Spacer />
                <Button onPress={() => onGameIdChange(null)}>{t("common.back")}</Button>
            </Container>
        );
    }

    return (
        <Container withScrollView>
            <View style={styles.header}>
                <View>
                    <Text variant="titleLarge">RagePutt</Text>
                    <Text variant="bodyMedium">{t("screens.ragePutt.roundsSummary", { rounds: totalRounds, putts: PUTTS_PER_ROUND })}</Text>
                </View>
                <Chip compact>
                    {!game.isFinished ? t("screens.ragePutt.inProgress") : t("screens.ragePutt.completed")}
                </Chip>
            </View>

            <View style={styles.roundControls}>
                <Button
                    variant="secondary"
                    onPress={() => setSelectedRound(currentRound - 1)}
                    disabled={currentRound <= 1 || saving}
                >
                    {t("screens.ragePutt.previous")}
                </Button>
                <Text variant="titleMedium">{t("screens.ragePutt.roundPosition", { current: currentRound, total: totalRounds })}</Text>
                <Button
                    variant="secondary"
                    onPress={() => setSelectedRound(currentRound + 1)}
                    disabled={currentRound >= totalRounds || saving}
                >
                    {t("common.next")}
                </Button>
            </View>

            <Spacer size={12} />
            {game.scorecards.map((scorecard) => {
                const scores = scorecard.scores ?? [];
                const roundIndex = scores.length;
                const isRoundAvailable = currentRoundIndex <= scores.length;
                const currentScore = scores[currentRoundIndex];
                const canEditRound = currentRoundIndex < scores.length || !game.isFinished;
                const previousScore = currentRoundIndex > 0 ? scores[currentRoundIndex - 1] : undefined;
                const distance = currentRoundIndex === 0 ? 10 : previousScore === undefined ? null : 5 + previousScore;
                const totalPoints = scorecard.points ?? scores.reduce((total, score) => total + score, 0);
                const playerId = String(scorecard.user.id);
                const pendingScore = pendingScoresByPlayer[playerId];
                const isSavingPlayer = pendingScore !== undefined && pendingScore !== null;

                return (
                    <View key={scorecard.id} style={styles.playerCard}>
                        <View style={styles.playerHeader}>
                            <View>
                                <Text variant="titleMedium">{scorecard.user.name}</Text>
                                <Text variant="bodySmall">
                                    {t("screens.ragePutt.playerProgress", {
                                        points: totalPoints,
                                        current: Math.min(roundIndex + 1, totalRounds),
                                        total: totalRounds,
                                    })}
                                </Text>
                            </View>
                            <Chip compact>
                                {roundIndex >= totalRounds
                                    ? t("screens.ragePutt.complete")
                                    : t("screens.ragePutt.roundCount", { current: roundIndex, total: totalRounds })}
                            </Chip>
                        </View>

                        {currentRound <= totalRounds && isRoundAvailable && distance !== null && canEditRound ? (
                            <>
                                <Spacer size={10} />
                                <Text variant="titleMedium" style={styles.distance}>{t("screens.ragePutt.distance", { distance })}</Text>
                                {game.isFinished && (
                                    <Text style={styles.message}>{t("screens.ragePutt.gameClosedScoreEditable")}</Text>
                                )}
                                <Text variant="bodySmall">{t("screens.ragePutt.scoreQuestion", { putts: PUTTS_PER_ROUND })}</Text>
                                <Spacer size={8} />
                                <View style={styles.putts}>
                                    {Array.from({ length: PUTTS_PER_ROUND + 1 }, (_, score) => (
                                        <Pressable
                                            key={score}
                                            accessibilityRole="button"
                                            accessibilityLabel={t("screens.ragePutt.setScoreAccessibility", { name: scorecard.user.name, round: currentRound, score })}
                                            accessibilityState={{
                                                selected: currentScore === score,
                                                disabled: saving || !canEditRound,
                                            }}
                                            style={[
                                                styles.scoreButton,
                                                currentScore === score ? styles.selectedScoreButton : styles.unselectedScoreButton,
                                            ]}
                                            onPress={() => selectRoundScore(scorecard, score)}
                                            disabled={saving || !canEditRound}
                                        >
                                            {isSavingPlayer && pendingScore === score ? (
                                                <ActivityIndicator
                                                    size={18}
                                                    color={currentScore === score ? colors.onPrimary : colors.primary}
                                                />
                                            ) : (
                                                <Text style={[
                                                    styles.scoreButtonText,
                                                    currentScore === score ? styles.selectedScoreButtonText : styles.unselectedScoreButtonText,
                                                ]}>
                                                    {String(score)}
                                                </Text>
                                            )}
                                        </Pressable>
                                    ))}
                                </View>
                            </>
                        ) : (
                            <Text style={styles.message}>
                                {game.isFinished
                                    ? t("screens.ragePutt.gameClosed")
                                    : currentRoundIndex > scores.length
                                    ? t("screens.ragePutt.completePreviousRounds")
                                    : distance === null
                                        ? t("screens.ragePutt.previousScoreUnavailable")
                                        : t("screens.ragePutt.allRoundsCompleted")}
                            </Text>
                        )}

                    </View>
                );
            })}
            {!game.scorecards.length && <Text style={styles.message}>{t("screens.ragePutt.noPlayers")}</Text>}
            {loading && <Loading noFullScreen />}
        </Container>
    );
};

const createStyles = (colors: MD3Colors) => StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    roundControls: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
        marginTop: 12,
    },
    distance: {
        color: colors.primary,
        fontWeight: "bold",
    },
    putts: {
        flexDirection: "row",
        gap: 8,
    },
    scoreButton: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderRadius: 22,
    },
    unselectedScoreButton: {
        backgroundColor: colors.surface,
        borderColor: colors.outline,
    },
    selectedScoreButton: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    scoreButtonText: {
        fontSize: 16,
        fontWeight: "600",
    },
    unselectedScoreButtonText: {
        color: colors.onSurface,
    },
    selectedScoreButtonText: {
        color: colors.onPrimary,
    },
    playerCard: {
        padding: 14,
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: colors.surface,
        elevation: 2,
    },
    playerHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
    },
    message: {
        marginTop: 12,
        color: colors.onSurfaceVariant,
    },
});

/*
import gql from "graphql-tag";

export default gql`
    type RagePuttScorecard {
        id: ID!
        user: SafeUser!
        scores: [Int]
        points: Int
    }
    type RagePuttGame {
        id: ID!
        startTime: String!
        endTime: String
        scorecards: [RagePuttScorecard!]!
        isFinished: Boolean!
        mode: String!
    }

    type Mutation {
        createRagePuttGame(mode: String = "default", playerIds: [ID!]!): ID!
        updateRagePuttScorecard(gameId: ID!, playerId: ID!, scores: [Int]): RagePuttScorecard!
        deleteRagePuttGame(gameId: ID!): Boolean!
    }

    type Query {
        getRagePuttGame(gameId: ID!): RagePuttGame
        getRagePuttGames: [RagePuttGame!]!
    }
`;
*/
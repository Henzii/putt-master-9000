import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Dimensions, Pressable, ScrollView, View } from "react-native";
import { LineChart as NativeLineChart } from "react-native-chart-kit";
import { Checkbox, Text, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import ErrorScreen from "@components/ErrorScreen";
import Loading from "@components/Loading";
import { useAuthenticatedUser } from "src/context/AuthenticatedUserContext";
import { GET_RAGE_PUTT_GAMES } from "src/graphql/queries";
import { RagePuttGame } from "src/types/ragetputt";
import { getPuttingPercentages } from "./utils";

type GetRageputtGamesResponse = {
    getRagePuttGames: RagePuttGame[];
};

const PUTT_DISTANCES = [5, 6, 7, 8, 9, 10];
const DISTANCE_COLORS = ["#ef5350", "#ab47bc", "#5c6bc0", "#29b6f6", "#66bb6a", "#ffa726"];

export const Statistics = () => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const user = useAuthenticatedUser();
    const [selectedDistances, setSelectedDistances] = useState<number[]>([10]);
    const { data, loading, error } = useQuery<GetRageputtGamesResponse>(GET_RAGE_PUTT_GAMES, {
        fetchPolicy: "cache-and-network",
    });
    if (loading && !data) {
        return <Loading />;
    }

    if (error && !data) {
        return <ErrorScreen errorMessage={error.message} />;
    }

    const scores = (data?.getRagePuttGames ?? [])
        .filter((game) => game.mode === "default")
        .flatMap((game) => {
            const scorecard = game.scorecards.find((entry) => String(entry.user.id) === String(user.id));
            if (!scorecard) {
                return [];
            }

            const points = scorecard.points ?? (
                scorecard.scores.length > 0
                    ? scorecard.scores.reduce((total, score) => total + score, 0)
                    : null
            );
            if (points === null || !Number.isFinite(points)) {
                return [];
            }

            const numericStartTime = Number(game.startTime);
            const timestamp = Number.isFinite(numericStartTime)
                ? numericStartTime
                : Date.parse(game.startTime);
            if (!Number.isFinite(timestamp)) {
                return [];
            }

            return [{
                timestamp,
                points,
                percentages: getPuttingPercentages(scorecard.scores),
            }];
        })
        .sort((first, second) => first.timestamp - second.timestamp);

    if (!scores.length) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
                <Text>{t("screens.ragePutt.noDefaultGamesWithPoints")}</Text>
            </View>
        );
    }

    // Each distance omits games without attempts, so these datasets are not aligned with the full game list.
    const puttingDatasets = selectedDistances
        .map((distance) => {
            let attempts = 0;
            const data: number[] = [];

            scores.forEach(({ percentages }) => {
                const result = percentages[distance];
                if (!result) {
                    return;
                }
                attempts += result.attempts;
                data.push(result.percentage);
            });

            const dataset = {
                data,
                color: () => DISTANCE_COLORS[distance - 5],
                key: distance,
                withDots: true,
            };

            return { dataset, attempts };
        })
        .filter(({ attempts }) => attempts > 0)
        .map(({ dataset }) => dataset);
    const hasPuttingData = puttingDatasets.length > 0;

    const toggleDistance = (distance: number) => {
        setSelectedDistances((selected) => selected.includes(distance)
            ? selected.filter((selectedDistance) => selectedDistance !== distance)
            : [...selected, distance]);
    };

    return (
        <ScrollView contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}>
            <Text variant="titleLarge" style={{ marginHorizontal: 16, marginBottom: 8 }}>
                {t("screens.ragePutt.yourPoints")}
            </Text>
            <Text variant="bodySmall" style={{ marginHorizontal: 16, marginBottom: 8 }}>
                {t("screens.ragePutt.defaultGamesOnly")}
            </Text>
            <NativeLineChart
                data={{
                    labels: scores.map(() => ""),
                    datasets: [{ data: scores.map(({ points }) => points) }],
                }}
                width={Dimensions.get("window").width - 32}
                height={240}
                yAxisInterval={1}
                chartConfig={{
                    backgroundGradientFrom: colors.surface,
                    backgroundGradientTo: colors.surface,
                    backgroundGradientFromOpacity: 1,
                    backgroundGradientToOpacity: 1,
                    decimalPlaces: 0,
                    color: () => colors.primary,
                    labelColor: () => colors.onSurface,
                    propsForDots: {
                        r: "3",
                        strokeWidth: "2",
                        stroke: colors.onSurface,
                    },
                }}
                style={{ marginHorizontal: 16, borderRadius: 8 }}
            />
            <Text variant="titleLarge" style={{ marginHorizontal: 16, marginTop: 20, marginBottom: 8 }}>
                {t("screens.ragePutt.puttingPercentage")}
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: 12, marginBottom: 8 }}>
                {PUTT_DISTANCES.map((distance) => {
                    const checked = selectedDistances.includes(distance);
                    return (
                        <Pressable
                            key={distance}
                            accessibilityRole="checkbox"
                            accessibilityState={{ checked }}
                            onPress={() => toggleDistance(distance)}
                            style={{ flexDirection: "row", alignItems: "center", marginRight: 8 }}
                        >
                            <Checkbox status={checked ? "checked" : "unchecked"} />
                            <Text style={{ color: DISTANCE_COLORS[distance - 5] }}>
                                {t("screens.ragePutt.distance", { distance })}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
            {hasPuttingData ? (
                <NativeLineChart
                    data={{
                        labels: scores.map(() => ""),
                        datasets: puttingDatasets,
                    }}
                    width={Dimensions.get("window").width - 32}
                    height={240}
                    yAxisSuffix="%"
                    fromZero
                    withShadow={false}
                    yAxisInterval={1}
                    chartConfig={{
                        backgroundGradientFrom: colors.surface,
                        backgroundGradientTo: colors.surface,
                        backgroundGradientFromOpacity: 1,
                        backgroundGradientToOpacity: 1,
                        decimalPlaces: 0,
                        color: () => colors.primary,
                        labelColor: () => colors.onSurface,
                        propsForDots: {
                            r: "3",
                            strokeWidth: "2",
                            stroke: colors.onSurface,
                        },
                    }}
                    style={{ marginHorizontal: 16, borderRadius: 8 }}
                />
            ) : (
                <Text style={{ marginHorizontal: 16 }}>
                    {t("screens.ragePutt.noPuttingPercentageData")}
                </Text>
            )}
        </ScrollView>
    );
};

import React from "react";
import { View } from "react-native";
import { Chip, Menu, Text } from "react-native-paper";
import { useMutation } from "@apollo/client";
import { useDispatch } from "react-redux";
import Button from "@components/ThemedComponents/Button";
import Spacer from "@components/ThemedComponents/Spacer";
import FriendsList, { Friend } from "@components/FriendsList";
import { useAuthenticatedUser } from "src/context/AuthenticatedUserContext";
import { CREATE_RAGE_PUTT_GAME } from "src/graphql/mutation";
import { GET_RAGE_PUTT_GAMES } from "src/graphql/queries";
import { addNotification } from "src/reducers/notificationReducer";
import { extractApolloErrorMessage } from "src/utils/apollo";
import Container from "@components/ThemedComponents/Container";
import { useTranslation } from "react-i18next";
import { RagePuttGameMode } from "src/types/ragetputt";

type CreateRagePuttGameResponse = {
    createRagePuttGame: string;
};

type CreateRagePuttGameVariables = {
    mode: RagePuttGameMode;
    playerIds: Array<string | number>;
};

type CreateRagePuttGameProps = {
    onGameCreated: (gameId: string) => void;
};

export const CreateRagePuttGame = ({ onGameCreated }: CreateRagePuttGameProps) => {
    const { t } = useTranslation();
    const [players, setPlayers] = React.useState<Friend[]>([]);
    const [showAddPlayers, setShowAddPlayers] = React.useState(false);
    const [mode, setMode] = React.useState<RagePuttGameMode>("default");
    const [modeMenuVisible, setModeMenuVisible] = React.useState(false);
    const user = useAuthenticatedUser();
    const dispatch = useDispatch();
    const [createGame, { loading: creatingGame }] = useMutation<CreateRagePuttGameResponse, CreateRagePuttGameVariables>(
        CREATE_RAGE_PUTT_GAME,
        { refetchQueries: [{ query: GET_RAGE_PUTT_GAMES }] }
    );

    const handleSetPlayer = (friends: Friend[]) => {
        const uniqueFriends = [...players, ...friends.filter((friend) => !players.some((player) => player.id === friend.id))];
        setPlayers(uniqueFriends);
        setShowAddPlayers(false);
    };

    const handleCreateGame = async () => {
        try {
            const result = await createGame({
                variables: {
                    mode,
                    playerIds: [...new Set([user.id, ...players.map((player) => player.id)])]
                }
            });
            const gameId = result.data?.createRagePuttGame;
            if (!gameId) {
                throw new Error(t("screens.ragePutt.createMissingId"));
            }
            dispatch(addNotification(t("screens.ragePutt.gameCreated"), "success"));
            onGameCreated(gameId);
        } catch (error) {
            const message = extractApolloErrorMessage(error);
            dispatch(addNotification(t("screens.ragePutt.createFailed", { message: message ? `: ${message}` : "" }), "alert"));
        }
    };

    if (showAddPlayers) {
        return <FriendsList onBackAction={() => setShowAddPlayers(false)} multiSelect onClick={handleSetPlayer} hideRemoveButton />;
    }

    return (
        <Container>
            <Text variant="titleLarge">{t("screens.ragePutt.players")}</Text>
            <Spacer />
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                <Chip>{user.name}</Chip>
                {players.map((player) => (
                    <Chip key={player.id}>{player.name}</Chip>
                ))}
            </View>
            <Spacer />
            <View style={{ flexDirection: "row", gap: 8, width: "100%" }}>
                <Button onPress={() => setShowAddPlayers(true)} style={{ flex: 1.5 }} variant="secondary">
                    {t("screens.ragePutt.addPlayers")}
                </Button>
                <Button variant="tertiary" style={{ flex: 1 }} onPress={() => setPlayers([])}>
                    {t("screens.ragePutt.clearPlayers")}
                </Button>
            </View>
            <Spacer size={15} />
            <Text variant="titleMedium">{t("screens.ragePutt.gameMode")}</Text>
            <Spacer size={4} />
            <Menu
                visible={modeMenuVisible}
                onDismiss={() => setModeMenuVisible(false)}
                anchor={
                    <Button
                        variant="secondary"
                        icon="chevron-down"
                        onPress={() => setModeMenuVisible(true)}
                    >
                        {t(mode === "quick" ? "screens.ragePutt.quickMode" : "screens.ragePutt.defaultMode")}
                    </Button>
                }
            >
                <Menu.Item
                    title={t("screens.ragePutt.defaultMode")}
                    onPress={() => {
                        setMode("default");
                        setModeMenuVisible(false);
                    }}
                />
                <Menu.Item
                    title={t("screens.ragePutt.quickMode")}
                    onPress={() => {
                        setMode("quick");
                        setModeMenuVisible(false);
                    }}
                />
            </Menu>
            <Spacer size={15} />
            <Text variant="titleLarge">RagePutt</Text>
            <Spacer />
            <Button onPress={handleCreateGame} loading={creatingGame} disabled={creatingGame}>
                {t("screens.ragePutt.startNewGame")}
            </Button>
        </Container>
    );
};

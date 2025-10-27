/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Linking, ScrollView, Image } from "react-native";
import { Button, Divider, List, Paragraph, Text, useTheme } from "react-native-paper";
import { Link, useNavigate } from "react-router-native";
import Loading from "@components/Loading";
import Login from "@components/Login";
import Container from "@components/ThemedComponents/Container";
import ErrorScreen from "@components/ErrorScreen";
import { useQuery } from "@apollo/client";
import { GET_OLD_GAMES } from "../../graphql/queries";
import firstTimeLaunched from "../../utils/firstTimeLaunched";
import Spacer from "@components/ThemedComponents/Spacer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SESSION_STATE, useSession } from "../../hooks/useSession";
import * as ExpoUpdates from "expo-updates";
import FrontpageHeader from "./Header/Header";
import { MD3Colors } from "react-native-paper/lib/typescript/types";

import play from "@icons/play.png";
import maali from "@icons/checklist.png";
import courses from "@icons/place.png";
import friends from "@icons/friends.png";
import stats from "@icons/stats.png";
import settings from "@icons/settings.png";
import achievement from "@icons/achievement.png";
import signout from "@icons/sign-out.png";
import www from "@icons/www.png";
import feedback from "@icons/feedback.png";
import group from "@icons/group.png";
import distance from "@icons/distance.png";
import { GetGames } from "src/types/queries";
import GameItem from "../OldGames/GameItem";

const Frontpage = () => {
  const openGames = useQuery<GetGames>(GET_OLD_GAMES, {
    fetchPolicy: "cache-and-network",
  });
  const navi = useNavigate();
  const [spacing, setSpacing] = useState(50);
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const session = useSession();

  const handleOpenWebsite = async () => {
    const token = await AsyncStorage.getItem("token");
    Linking.openURL(`https://fudisc.henzi.fi/login?token=${token}`);
  };

  useEffect(() => {
    (async function IIFE() {
      if (
        !session.isLoggedIn &&
        session.state === SESSION_STATE.FINISHED &&
        (await firstTimeLaunched())
      ) {
        navi("/firstTime");
      }
    })();
  }, [session]);
  if (session.state === SESSION_STATE.LOADING) {
    return <Loading loadingText="Connecting to server..." showTexts />;
  }
  if (session.state === SESSION_STATE.ERROR) {
    return (
      <ErrorScreen errorMessage="Session failed" showBackToFrontpage={false}>
        <Spacer />
        <Paragraph>
          Some things you might want to try to fix this error:
        </Paragraph>
        <Button onPress={() => session.clear()}>Clear session</Button>
        <Button onPress={() => ExpoUpdates.reloadAsync()}>
          Reload the app
        </Button>
      </ErrorScreen>
    );
  }

  if (!session.isLoggedIn) {
    return (
      <Container>
        <Login />
        <Link to="/signUp">
          <Button>Sign up!</Button>
        </Link>
        {process.env.NODE_ENV === "development" && (
          <>
            <Link to="/firstTime">
              <Button>FirstTime</Button>
            </Link>
          </>
        )}
      </Container>
    );
  }

  const ongoingGames = openGames.data?.getGames?.games.filter(
    (game) => game.isOpen
  );

  const latestGame = openGames.data?.getGames?.games.find(
    (game) => !game.isOpen
  );


  return (
    <View>
      <FrontpageHeader openGames={ongoingGames} setSpacing={setSpacing} />
      <ScrollView>
        <Spacer size={spacing - 20} />
        <View style={styles.container}>
          <List.Item
            title="New game"
            description="Start a new game"
            left={() => <Image source={play} style={styles.icon} />}
            onPress={() => navi("/game?force")}
          />
          <Divider />
          <List.Item
            title="Old games"
            left={() => <Image source={maali} style={styles.icon} />}
            onPress={() => navi("/games")}
          />
          <Divider />
          <List.Item
            title="Courses"
            left={() => <Image source={courses} style={styles.icon} />}
            onPress={() => navi("/courses")}
          />
          <Divider />
          <List.Item
            title="Friends"
            left={() => <Image source={friends} style={styles.icon} />}
            onPress={() => navi("/friends")}
          />
          <Divider />
          <View>
            {latestGame && (
              <>
                <Text variant="titleMedium">Latest game</Text>
                <GameItem
                  game={latestGame}
                  onClick={() => null}
                  myId={session.id ?? ""}
                />
              </>
            )}
          </View>
          <List.Item
            title="Stats"
            left={() => <Image source={stats} style={styles.icon} />}
            onPress={() => navi("/stats")}
          />
          <List.Item
            title="Achievements"
            left={() => <Image source={achievement} style={styles.icon} />}
            onPress={() => navi("/achievements")}
          />
          <List.Item
            title="Group"
            left={() => <Image source={group} style={styles.icon} />}
            onPress={() => navi("/group")}
          />
          <List.Item
            title="Settings"
            left={() => <Image source={settings} style={styles.icon} />}
            onPress={() => navi("/settings")}
          />
          <List.Item
            title="Website"
            left={() => <Image source={www} style={styles.icon} />}
            onPress={handleOpenWebsite}
          />
          <List.Item
            title="Distance"
            left={() => <Image source={distance} style={styles.icon} />}
            onPress={() => navi("/distance")}
          />
          <List.Item
            title="Feedback"
            left={() => <Image source={feedback} style={styles.icon} />}
            onPress={() => navi("feedback")}
          />
          <List.Item
            title="Logout"
            left={() => <Image source={signout} style={styles.icon} />}
            onPress={() => session.clear()}
          />
        </View>
        <Spacer size={80} />
      </ScrollView>
    </View>
  );
};

const createStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
    },
    icon: {
      height: 30,
      width: 30,
      alignSelf: "center",
    },
  });

export default Frontpage;

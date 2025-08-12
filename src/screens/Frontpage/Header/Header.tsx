import React from "react";
import { Game } from "../../../types/game";
import OpenGames from "./OpenGames";
import LoggedIn from "./LoggedIn";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/store";
import UpdateAvailable from "./UpdateAvailable";
import Header from "../../../components/RoundedHeader/Header";

type Props = {
    openGames?: Game[]
    setSpacing: (spacing: number) => void
}
const FrontpageHeader = ({openGames = [], setSpacing}: Props) => {
    const isUpdateAvailable = useSelector<RootState>(state => state.common.isUpdateAvailable) as boolean | undefined;

    const showOpenGames = openGames.length;
    const showUpdate = !showOpenGames && isUpdateAvailable;
    const showLoggedIn = !showOpenGames && !showUpdate;

    return (
        <Header setSpacing={setSpacing}>
            {showOpenGames ? <OpenGames openGames={openGames} /> : null}
            {showUpdate ? <UpdateAvailable /> : null}
            {showLoggedIn ? <LoggedIn /> : null}
        </Header>
    );
};

export default FrontpageHeader;
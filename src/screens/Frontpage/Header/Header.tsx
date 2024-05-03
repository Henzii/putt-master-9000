import React from "react";
import { Game } from "../../../types/game";
import OpenGames from "./OpenGames";
import LoggedIn from "./LoggedIn";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/store";
import UpdateAvailable from "./UpdateAvailable";

type Props = {
    openGames?: Game[]
}
const Header = ({openGames = []}: Props) => {
    const isUpdateAvailable = useSelector<RootState>(state => state.common.isUpdateAvailable) as boolean | undefined;
    if (openGames.length) {
        return <OpenGames openGames={openGames} />;
    }

    if (isUpdateAvailable) {
        return <UpdateAvailable />;
    }

    return <LoggedIn />;
};

export default Header;
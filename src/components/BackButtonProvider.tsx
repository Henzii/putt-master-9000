import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-native";

const BackContext = createContext<BackActions>({} as BackActions);

export const useBackButton = () => useContext(BackContext);

interface BackActions {
    setDestination: (dest: string) => void,
    setCallBack: (cb: () => void) => void,
    goBack: () => void,
}

export default function BackButtonProvider ( {children}: { children: React.ReactElement | Element | false | null }) {
    const [destination, setDestination] = useState<string | undefined>();
    const [callBack, setStateCallBack] = useState<() => void | undefined>();
    const navigate = useNavigate();

    const backActions = {
        setDestination: (dest: string | undefined) => {
            setDestination(dest);
        },
        setCallBack: (cb: () => void | undefined) => {
            setStateCallBack(() => cb);
        },
        goBack: () => {
            if (callBack) {
                callBack();
                setStateCallBack(undefined);
            } else if (destination) {
                navigate(destination);
                setDestination(undefined);
            } else {
                navigate(-1);
            }
            return true;
        }
    };
    return (
        <BackContext.Provider value={backActions}>
            {children}
        </BackContext.Provider>
    );
}
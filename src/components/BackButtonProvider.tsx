import React, { PropsWithChildren, createContext, useContext, useRef } from "react";
import { useNavigate } from "react-router-native";

const BackContext = createContext<BackActions>({} as BackActions);

export const useBackButton = () => useContext(BackContext);

interface BackActions {
    setDestination: (dest: string) => void,
    setCallBack: (cb?: () => void) => void,
    goBack: () => void,
}

export default function BackButtonProvider ( {children}: PropsWithChildren) {
    const destination = useRef<string | null>(null);
    const callBack = useRef<() => void>(null);
    const navigate = useNavigate();

    const backActions = {
        setDestination: (dest: string | null) => {
            destination.current = dest;
        },
        setCallBack: (cb?: () => void) => {
            callBack.current = cb ?? null;
        },
        goBack: () => {
            if (callBack.current) {
                callBack.current();
                callBack.current = null;
            } else if (destination.current) {
                navigate(destination.current);
                destination.current = null;
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
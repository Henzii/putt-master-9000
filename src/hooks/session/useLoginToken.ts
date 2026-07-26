import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/utils/store";

export const useLoginToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const storeToken = useSelector(
    (state: RootState) => state.common.loginToken
  );

  useEffect(() => {
    let isCancelled = false;

    const getToken = async () => {
      try {
        if (storeToken) {
          if (!isCancelled) {
            setToken(storeToken);
            setLoading(false);
          }
          return;
        }

        const storageToken = await AsyncStorage.getItem("token");

        if (!isCancelled) {
          setToken(storageToken);
          setLoading(false);
        }
      } catch {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    getToken();

    return () => {
      isCancelled = true;
    };
  }, [storeToken]);

  return {
    token,
    loading,
  };
};
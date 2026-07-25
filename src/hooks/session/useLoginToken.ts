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
    const getToken = async () => {
      if (storeToken) {
        setToken(storeToken);
        setLoading(false);
        return;
      }

      const storageToken = await AsyncStorage.getItem("token");

      setToken(storageToken);
      setLoading(false);
    };

    getToken();
  }, [storeToken]);

  return {
    token,
    loading,
  };
};
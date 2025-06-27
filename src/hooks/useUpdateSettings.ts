import { useMutation } from "@apollo/client";
import { UPDATE_MY_SETTINGS } from "../graphql/mutation";
import { GET_ME } from "../graphql/queries";
import { User } from "../types/user";

type GetMeResponse = { getMe: User }

export const useUpdateSettings = () => {
    const [updateSettingsMutation] = useMutation(UPDATE_MY_SETTINGS, {
        update: (cache, result) => {
            const newSettingsResult = result.data.changeSettings;
            const oldCache = cache.readQuery<GetMeResponse>({ query: GET_ME });
            cache.writeQuery({
                query: GET_ME,
                data: {
                    getMe: {
                        ...oldCache?.getMe,
                        ...newSettingsResult,
                    }
                }
            });
        }
    });
    return updateSettingsMutation;
};
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { GET_UPLOAD_SIGNATURE } from "src/graphql/mutation";
import { GET_GAME, GET_LAYOUT } from "src/graphql/queries";
import { addNotification } from "src/reducers/notificationReducer";
import { Game } from "src/types/game";
import { extractApolloErrorMessage } from "src/utils/apollo";
import { useGameStore } from "src/zustand/gameStore";


type UploadSignatureResponse = {
        getTeeSignUploadSignature: {
        signature: string
        publicId: string
        apiKey: string
        timestamp: number
        overwrite: string
        cloudName: string
        folder: string
    }
}

export const useHoleMapUpload = () => {
    const [gameId, selectedRound] = useGameStore(state => [state.gameId, state.selectedRound]);
    const {data} = useQuery<{getGame: Game}>(GET_GAME, {variables: {gameId}, skip: !gameId, fetchPolicy: 'cache-first'});
    const [getUploadSignature] = useMutation<UploadSignatureResponse>(GET_UPLOAD_SIGNATURE);
    const client = useApolloClient();
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const game = data?.getGame;

    const uploadImage = async (imageUri: string) => {
        if (game) {
            try {
                const response = await getUploadSignature({variables: {layoutId: game.layout_id, holeNumber: selectedRound}});
                if (!response.data?.getTeeSignUploadSignature) {
                    throw new Error("Failed to get upload signature");
                }

                dispatch(addNotification(t('screens.game.holeMap.imageUploading'), 'info'));

                const {signature, publicId, apiKey, timestamp, overwrite, cloudName, folder} = response.data?.getTeeSignUploadSignature ?? {};
                const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;


                const formData = new FormData();
                formData.append("file", {
                    uri: imageUri,
                    name: `holemap_${game.layout_id}_${selectedRound}.jpg`,
                    type: 'image/jpeg'
                } as unknown as Blob);
                formData.append("api_key", apiKey);
                formData.append("signature", signature);
                formData.append("public_id", publicId);
                formData.append('overwrite', overwrite);
                formData.append('timestamp', timestamp.toString());
                formData.append('folder', folder);

                const cloudinaryResponse = await fetch(CLOUDINARY_API_URL, {
                    method: "POST",
                    body: formData,
                });

                if (!cloudinaryResponse.ok) {
                    throw new Error("Failed to upload image to Cloudinary!");
                } else {
                    dispatch(addNotification(t('screens.game.holeMap.imageUploadSuccess'), 'success'));
                    client.refetchQueries({include: [GET_LAYOUT]});
                }

            } catch (e) {
                const message = extractApolloErrorMessage(e) || (e instanceof Error ? e.message : null);
                dispatch(addNotification(`Error!${message ? ` ${message}` : ''}`, 'alert'));
            }
        } else {
            dispatch(addNotification(`Active game not found or something :P`, 'warning'));

        }
    };

    return uploadImage;
};

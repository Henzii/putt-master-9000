import React, { useState, useEffect } from "react";
import { Headline, Subheading, Caption, Switch, Button, Paragraph } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Container from "./ThemedComponents/Container";
import Spacer from "./ThemedComponents/Spacer";
import SplitContainer from "./ThemedComponents/SplitContainer";
import { View } from "react-native";
import { addNotification } from "../reducers/notificationReducer";
import { useDispatch } from "react-redux";
import { getAPIUrl } from "../graphql/apolloClient";

export default function DevPage() {
    const [env, setEnvState] = useState<string | undefined>();
    const [api, setApi] = useState('');
    useEffect(() => {
        (async function IIFE () {
            const env = await AsyncStorage.getItem('apiEnv') || process.env.NODE_ENV as string;
            setEnvState(env);
        })();
    }, []);
    useEffect(() => {
        getAPIUrl().then(setApi);
    }, [env]);

    const dispatch = useDispatch();
    const setEnv = (env: string) => {
        AsyncStorage.setItem('apiEnv', env);
        setEnvState(env);
    };
    return (
        <Container withScrollView>
            <Headline>DevPage</Headline>
            <Spacer />
            <Subheading>NODE_ENV</Subheading>
            <SplitContainer>
                <Caption>Development</Caption><Switch value={env === 'development'} onChange={() => setEnv('development')} />
            </SplitContainer>
            <SplitContainer>
                <Caption>Preview</Caption>
                <Switch
                    value={env === 'preview'}
                    onChange={() => setEnv('preview')}
                />
            </SplitContainer>
            <SplitContainer>
                <Caption>Production</Caption><Switch value={env === 'production'} onChange={() => setEnv('production')} />
            </SplitContainer>
            <Spacer />
            <Caption>API: {api}</Caption>
            <Spacer />
            <Subheading>Poista firstTime flag</Subheading>
            <Paragraph>
                Etusivulla First time using FuDisc...
            </Paragraph>
            <Button onPress={() => {
                AsyncStorage.removeItem('firstTime');
            }} mode="contained">Clear</Button>
                        <Spacer />
            <Subheading>Tyhjennä AsyncStorage</Subheading>
            <Paragraph>
                firsTime, token, settings...
            </Paragraph>
            <Button onPress={() => {
                AsyncStorage.clear();
            }} mode="contained">Clear</Button>
            <Spacer />
            <Subheading>Notifikaatiotesti</Subheading>
            <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
                <Button onPress={() => dispatch(addNotification('Testiviesti', 'info'))}>Info</Button>
                <Button onPress={() => dispatch(addNotification('Testiviesti', 'alert'))}>Alert</Button>
                <Button onPress={() => dispatch(addNotification('Testiviesti', 'success'))}>Success</Button>
                <Button onPress={() => dispatch(addNotification('Testiviesti', 'warning'))}>Warning</Button>
            </View>
            <Subheading>
                <Button onPress={() => {
                    throw new Error('Test error');
                }}>Throw error</Button>
            </Subheading>

        </Container>
    );
}
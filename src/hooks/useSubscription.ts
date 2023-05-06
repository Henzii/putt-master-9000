import { DocumentNode, FetchResult, useApolloClient } from "@apollo/client";
import { useEffect, useState, useRef } from "react";

type Args = { query: DocumentNode, variables: Record<string, string>, dependency: unknown}
type OnDataReceived = (data: FetchResult) => void
type OnError = ((error: unknown) => void) | null

export const useSubscription = (onData: OnDataReceived, onError: OnError, {query, variables, dependency}: Args) => {
    const [retryAttempts, setRetryAttempts] = useState(0);
    const consecutiveFails = useRef(0);
    const resetFailsTimeoutId = useRef<NodeJS.Timeout>();
    const client = useApolloClient();
    useEffect(() => {
        if (!dependency) return;
        try {
            const observer = client.subscribe({ query, variables, fetchPolicy: 'no-cache' });
            const sub = observer.subscribe(onData, (error) => {
                if(consecutiveFails.current > 10) {
                    onError?.(error);
                    return;
                }

                if (resetFailsTimeoutId.current) clearTimeout(resetFailsTimeoutId.current);
                setTimeout(() => setRetryAttempts(v => v + 1), 250);
                consecutiveFails.current++;
                resetFailsTimeoutId.current = setTimeout(() => { consecutiveFails.current=0; }, 500);
            });
            return () => sub.unsubscribe();
        } catch (e) {
            onError?.(e);
            // eslint-disable-next-line no-console
            console.log(e);
        }
    }, [retryAttempts, dependency]);
};

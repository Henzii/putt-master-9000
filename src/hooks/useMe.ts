import { useState } from 'react';
import { useQuery } from 'react-apollo';
import { GET_ME } from '../graphql/queries';

const useMe = () => {
    const { data, loading, error} = useQuery<{ getMe: User}>(GET_ME);
    const login = (username: string, password: string): boolean => {
        return true;
    }
    return { me: data?.getMe ?? null, logged: (!!data?.getMe ), login }
}


export type User = {
    name: string,
    id: number | string,
    friends?: User[]
}

export default useMe;
import { useState, useEffect } from 'react';

type Options = {
    numeric?: boolean
    callBackDelay?: number,
    defaultValue?: string,
}
type HookReturn = {
    value: string,
    onChangeText: (text: string) => void,
    keyboardType: 'numeric' | 'default',
}
/**
* Palauttaa arrayn ensimmäisessä alkiossa value, onChangeText ja keyboardType
*
* @param options
* objekti joka sisältää callBackDelay (ms), numeric (boolean) ja callBack -funktion
*
* @param callback
* Funktio jota kutsutaan tekstikenttää muokattaessa. Palauttaa tekstikentän arvon parametrinä.
*
* @example
* const textInputs = useTextInput({ callBackDelay: 1000 }, (value) => console.log('Value: ', value ));
* return <TextInput {...textInputs} />;
**/
const useTextInput = (options: Options, callback?: (value: string) => void): HookReturn => {
    const [value, setValue] = useState(options.defaultValue || '');
    const [timerId, setTimerId] = useState<undefined | NodeJS.Timeout>();
    const onChangeText = (text: string) => {
        if (options.numeric) {
            if (!Number.parseInt(text) && text !== '') return;
        }
        if (callback) {
            if (timerId) clearTimeout(timerId);
            setTimerId(setTimeout(() => callback(text), options.callBackDelay || 500));
        }
        setValue(text);
    };
    useEffect(() => {
        return () => {
            if (timerId) clearTimeout(timerId);
        };
    });
    return {
        value,
        onChangeText,
        keyboardType: (options.numeric ? 'numeric' : 'default'),
    };
};

export default useTextInput;

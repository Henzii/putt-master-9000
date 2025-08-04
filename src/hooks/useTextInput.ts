import { useState, useEffect, createRef } from 'react';
import { TextInput } from 'react-native';

type Options = {
    numeric?: boolean
    callBackDelay?: number,
    defaultValue?: string,
}
type HookReturn = {
    value: string,
    onChangeText: (text: string) => void,
    keyboardType: 'numeric' | 'default',
    ref?: React.RefObject<TextInput | null>
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
    const ref = createRef<TextInput>();
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
        ref,
        onChangeText,
        keyboardType: (options.numeric ? 'numeric' : 'default'),
    };
};

export default useTextInput;

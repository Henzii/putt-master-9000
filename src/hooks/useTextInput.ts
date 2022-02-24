import { useState, useEffect } from 'react';

type Options = {
    numeric?: boolean
    callBack?: (value: string) => void,
    callBackDelay?: number,
    defaultValue?: string,
}
type HookReturn = [{
    value: string,
    onChangeText: (text: string) => void,
    keyboardType: 'numeric' | 'default',
}]
/**
* Palauttaa arrayn ensimmäisessä alkiossa value, onChangeText ja keyboardType
*
* @param options
* objekti joka sisältää callBackDelay (ms), numeric (boolean) ja callBack -funktion
*
* @example
* const [textInputs] = useTextInput({ callBackDelay: 1000, callBack: (value) => console.log('Value: ', value )});
* return <TextInput {...textInputs} />;
**/
const useTextInput = (options: Options): HookReturn => {
    const [value, setValue] = useState(options.defaultValue || '');
    const [timerId, setTimerId] = useState<undefined | NodeJS.Timeout>();
    const onChangeText = (text: string) => {
        if (options.numeric) {
            if (!Number.parseInt(text) && text !== '') return;
        }
        if (typeof options.callBack === 'function') {
            if (timerId) clearTimeout(timerId);
            const cb = options.callBack;
            setTimerId(setTimeout(() => cb(text), options.callBackDelay || 500));
        }
        setValue(text);
    };
    useEffect(() => {
        return () => {
            if (timerId) clearTimeout(timerId);
        };
    });
    return [{
        value,
        onChangeText,
        keyboardType: (options.numeric ? 'numeric' : 'default'),
    }];
};

export default useTextInput;

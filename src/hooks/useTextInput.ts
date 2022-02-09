import React, { useState, useRef, useEffect } from 'react';

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
const useTextInput = (options: Options): HookReturn => {
    const [value, setValue] = useState(options.defaultValue || '');
    const [timerId, setTimerId] = useState<undefined | NodeJS.Timeout>();
    const onChangeText = (text: string) => {
        if (options.numeric) {
            if (!Number.parseInt(text) && text !== '') return;
        }
        if (options.callBack) {
            if (timerId) clearTimeout(timerId)
            setTimerId(setTimeout(() => options.callBack!(text), options.callBackDelay || 500));
        }
        setValue(text);
    }
    useEffect(() => {
        return () => {
            if (timerId) clearTimeout(timerId)
        }
    })
    return [{
        value,
        onChangeText,
        keyboardType: (options.numeric ? 'numeric' : 'default'),
    }]
}

export default useTextInput;

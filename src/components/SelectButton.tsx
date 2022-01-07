import React, { useState } from 'react'
import { View, Text } from 'react-native'
import Button, { ButtonProps } from './Button'

export default function SelectButton({selected, pending, ...props}: SelectButtonProps) {
    return (
        <Button
            {...props}
            borderColor={(selected ? 'darkgreen' : "rgba(0,0,0,1)") }
            backgroundColor={(selected ? 'green' : (pending ? 'orange' : undefined))}
            shadowOffcet={(selected ? { width: -1, height: -1 } : undefined ) }
            borderWidth={3}
            color="secondary"
            />
    )
}

interface SelectButtonProps extends ButtonProps {
    selected?: boolean,
    pending?: boolean
}
import React, { useState } from 'react'
import { View, Text } from 'react-native'
import Button, { ButtonProps } from './Button'

export default function SelectButton({selected, ...props}: SelectButtonProps) {
    return (
        <Button
            {...props}
            borederColor={(selected ? 'darkgreen' : "rgba(0,0,0,1)") }
            backgroundColor={(selected ? 'green' : undefined)}
            shadowOffcet={(selected ? { width: -1, height: -1 } : undefined ) }
            borderWidth={3}
            />
    )
}

interface SelectButtonProps extends ButtonProps {
    selected?: boolean
}
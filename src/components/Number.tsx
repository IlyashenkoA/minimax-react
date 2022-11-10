import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Box, Checkbox } from "@mui/material";

import { addCombination, removeCombination } from "../store/action-creators/action-creators";

interface NumberProps {
    position: number,
    value: number,
    disabled: boolean,
    reset: boolean,
    setReset: Dispatch<SetStateAction<boolean>>
}

interface CheckboxHandleProps {
    position: number;
    value: number;
    checked: boolean;
}

const Number = React.memo(({ position, value, disabled, reset, setReset }: NumberProps) => {
    const dispatch = useDispatch();
    const [checked, setChecked] = useState(false);

    // Check if the checkbox should be reset after move
    useEffect(() => {
        if (reset && checked) {
            setChecked(false);
            setReset(false);
        }
    }, [reset])


    const handleChange = (props: CheckboxHandleProps) => {
        const { position, value, checked } = props;
        setChecked(!checked);

        if (!checked) {
            dispatch(addCombination({ key: position, value: value }))
        } else {
            dispatch(removeCombination({ key: position, value: value }))
        }
    };

    return (
        <Box sx={
            {
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                height: '100%',
                alignItems: 'space-between',
                justifyContent: 'center'
            }
        }
        >
            <span style={{ fontSize: '100px', alignSelf: 'center' }}>{value}</span>
            <Checkbox
                key={position}
                value={value}
                onChange={() => { handleChange({ position, value, checked }) }}
                checked={checked}
                disabled={disabled}
            />
        </Box>
    )
});

export default Number;
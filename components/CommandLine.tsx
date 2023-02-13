import { TextInput } from '@mantine/core';
import { IconCurrencyDollar } from '@tabler/icons';
import { useEffect, useRef, useState } from 'react';

type Props = {
    onEnter?: (command: string) => void;
    triggerFocus?: boolean;
    disabled?: boolean;
};

const CommandLine: React.FC<Props> = (props) => {
    const [value, setValue] = useState('');
    const inputReference = useRef<HTMLInputElement>(null);

    const handleKeyDown = (event: { key: string; }) => {
        if (event.key === 'Enter' && props.onEnter) {
            props.onEnter(value);
        }
    };

    useEffect(() => {
        if (inputReference.current)
            inputReference.current.focus();
            
    }, [props.triggerFocus]);

    return (<TextInput
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        icon={<IconCurrencyDollar />}
        onKeyDown={handleKeyDown}
        size="xl"
        disabled={props.disabled}
        ref={inputReference}
        autoComplete='off'
        sx={{ 'input': { fontFamily: 'monospace' } }}
    />);
};

export default CommandLine;

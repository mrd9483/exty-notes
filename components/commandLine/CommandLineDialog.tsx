import { Dialog } from '@mantine/core';
import { CommandLine } from './CommandLine';

type Props = {
    onEnter?: (command: string) => void;
    opened: boolean;
    triggerFocus?: boolean;
    disabled?: boolean;
};

export const CommandLineDialog = (props: Props) => {

    return (<Dialog opened={props.opened} w={700} withCloseButton shadow='xl'>
        <CommandLine disabled={props.disabled} triggerFocus={props.triggerFocus} onEnter={props.onEnter} />
    </Dialog>);
};

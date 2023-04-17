import { ActionIcon, Badge, Button, Group, Popover, TextInput } from '@mantine/core';
import { IconPlus, IconX } from '@tabler/icons';
import { useState } from 'react';

type Props = {
    values: string[],
    remove: (index: string) => void,
    add: (index: string) => void
}

export const TagList = (props: Props) => {
    const [addValue, setAddValue] = useState('');

    const removeButton = (index: string) => (
        <ActionIcon size="xs" radius="xl" variant="transparent" onClick={() => props.remove(index)}>
            <IconX color='white' />
        </ActionIcon>
    );

    return (
        <Group spacing="xs">
            {props.values.map((value) => (
                <Badge key={value} variant="gradient" size="lg" rightSection={removeButton(value)}>{value}</Badge>
            ))}
            <Badge variant="gradient" size="lg">
                <Popover width={300} trapFocus position="bottom" withArrow shadow="md">
                    <Popover.Target>
                        <ActionIcon radius="xl" variant="transparent">
                            <IconPlus color="white" />
                        </ActionIcon>
                    </Popover.Target>
                    <Popover.Dropdown sx={(theme) => ({ background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white })}>
                        <Group>
                            <TextInput value={addValue} onChange={(event) => setAddValue(event.currentTarget.value)} placeholder="New Tag" />
                            <Button variant="gradient" onClick={() => props.add(addValue)}>Add</Button>
                        </Group>
                    </Popover.Dropdown>
                </Popover>

            </Badge>

        </Group>
    );
};

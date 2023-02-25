const URL = `${process.env.NEXT_PUBLIC_API_URL}/tasks`;

const saveTask = async (userId: string, task: string, dateCompleted?: Date) => {
    const res = await fetch(URL,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: userId, task, dateCompleted })
        });

    return await res.json();
};

const getTasks = async (userId?: string, returnComplete?: boolean) => {

    return await fetch(`${URL}/user/${userId}?returnComplete=${returnComplete}`)
        .then(res => res.json());
};

const setTaskComplete = async (taskId: string) => {
    const res = await fetch(`${URL}/${taskId}?setComplete=true`,
        { method: 'POST' }).then((obj) => obj.json());

    return res;
};

export { saveTask, getTasks, setTaskComplete };

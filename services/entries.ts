import moment from 'moment';

const getEntries = async (userId?: string, dateFrom?: Date | null, dateTo?: Date | null) => {
    let dateQuery = '';

    if (dateFrom && dateTo) {
        dateQuery = `?dateFrom=${moment(dateFrom).format('YYYY-MM-DD')}&dateTo=${moment(dateTo).format('YYYY-MM-DD')}`;
    }

    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/timeEntries/user/${userId}${dateQuery}`)
        .then(res => res.json());
};

const saveEntry = (userId: string, date: Date, entry: string, hours: number, category: string) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/timeEntries/`,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: userId, entry, date, hours, category })
        });
};

const deleteEntry = (entryId: string) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/timeEntries/${entryId}`, { method: 'DELETE' })
        .then(res => res.json());
};

export { getEntries, saveEntry, deleteEntry };

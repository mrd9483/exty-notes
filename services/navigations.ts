const getNavigationsByUser = async (userId: string) => {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/navigations/user/${userId}`)
        .then(res => res.json());
};

export { getNavigationsByUser };

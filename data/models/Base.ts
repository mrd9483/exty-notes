export interface IBase {
    _id?: string,
    updated?: Date,
}

export interface IUserBase extends IBase {
    user: string,
}

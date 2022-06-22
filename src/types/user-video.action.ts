import { UserEntity } from 'types';
export enum UserVideoAction {
    pause,
    play,
    forward,
    url,
}
export interface UserVideoActionEntity {
    userVideoAction: UserVideoAction;
    user: UserEntity;
}
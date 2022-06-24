import { UserEntity, UserVideoAction } from 'types';
export interface UserVideoActionEntity {
    userVideoAction: UserVideoAction;
    user: UserEntity;
    hidden?: boolean;
}
import { UserEntity, UserRoomAction } from 'types';
export interface UserRoomActionEntity {
    userRoomAction: UserRoomAction;
    user: UserEntity;
    hidden?: boolean;
}
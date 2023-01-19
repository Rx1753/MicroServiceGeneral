import { Subjects } from '../enums/subjects';
export interface AdminPermissionUserCreatedEvent {
  subject: Subjects.AdminPermissionCreated;
  data: {
    id: string;

    tableName: string;
    isCreate: boolean;
    isDelete: boolean;
    isUpdate: boolean;
    isRead: boolean;
  };
}

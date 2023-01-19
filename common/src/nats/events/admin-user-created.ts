import { Subjects } from '../enums/subjects';
export interface AdminUserCreatedEvent {
  subject: Subjects.AdminUserCreated;
  data: {
    id: string;
    userName: string;
    email?: string | null;
    phoneNumber?: number | null;
    createdBy?: string | null;
    permissionId?: { _id: string }[];
    allowChangePassword: boolean;
  };
}

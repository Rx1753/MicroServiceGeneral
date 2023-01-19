import { Subjects } from '../enums/subjects';
export interface AdminUserUpdatedEvent {
    subject: Subjects.AdminUserUpdated;
    data: {
        id: string;
        userName: string;
        email?: string | null;
        phoneNumber?: number | null;
        createdBy?: string | null;
        permissionId?: {
            _id: string;
        }[];
        allowChangePassword: boolean;
        isActive: boolean;
    };
}

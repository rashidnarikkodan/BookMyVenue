export interface IUser extends Document {
    fullName: string;
    email: string;
    password?: string;
    phoneNumber: string;
    role: 'user' | 'owner' | 'admin';
    isVerified: boolean;
    isBlocked: boolean;
    createdAt: Date;
    updatedAt: Date;
}

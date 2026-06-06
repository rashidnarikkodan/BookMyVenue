import { HydratedDocument } from 'mongoose';

export interface ICategory {
  name: string;
  description: string;
  image?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CategoryDocument = HydratedDocument<ICategory>;

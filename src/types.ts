export type UserRole = 'user' | 'admin';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  phoneNumber?: string;
  balance: number;
  role: UserRole;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  createdAt: string;
  lastBonusClaimedAt?: string;
  bonusStreak?: number;
  turnover?: number;
  totalDeposited?: number;
  turnoverTarget?: number;
}

export type TransactionType = 'deposit' | 'withdrawal' | 'bonus';
export type TransactionStatus = 'pending' | 'approved' | 'rejected';

export interface Transaction {
  id?: string;
  userId: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  bankInfo?: any;
  receiptUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Game {
  id: string;
  name: string;
  category: 'slot' | 'casino' | 'sport' | 'fishing';
  imageUrl: string;
  provider: string;
  isActive: boolean;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  bonusPercentage?: number;
  isActive: boolean;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export enum EstimateStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export interface Item {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  rate: number;
  tax: number;
  discount: number;
}

export interface Estimate {
  id: string;
  refNo: number;
  date: string;
  customerName: string;
  items: Item[];
  status: EstimateStatus;
  discountValue: number;
  discountType: 'percentage' | 'fixed';
  taxType: string;
  description: string;
  totalAmount: number;
  balance: number;
  isSale?: boolean;
  receivedAmount?: number;
  paymentType?: 'Cash' | 'Cheque' | 'Online';
}

export interface CompanyData {
  name: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
  signature?: string;
  terms?: string;
}

export type View = 'HOME' | 'MENU' | 'ESTIMATE_LIST' | 'ESTIMATE_FORM' | 'INVOICE_VIEW' | 'PROFILE_EDIT' | 'SALE_FORM';

export enum PaymentProcessingCode {
  SUCCESS = 1000,
  BLIP_CREDIT = 1001,
  ACCOUNT_DOES_NOT_EXIST = 1101,
  AUTHORIZATION_DECLINED = 1102,
  CREDIT_CARD_EXPIRED = 1103,
  INSUFFICIENT_FUNDS = 1104,
  TRANSACTION_FAILED = 1105,
  SERVER_ERROR = 1106,
  CARD_LOST_STOLEN = 1107,
  TRANSACTION_DECLINED = 1108,
  BANK_RESTRICTION = 1109,
  FAILED_AUTHENTICATION = 1110,
  PAYMENT_METHOD_REDACTED = 1111,
  UNKNOWN_SUCCESS = 2000,
  UNKNOWN_FAILURE = 3000,
}

export interface Payment {
  id: string;
  organization: string;
  card: string;
  amount: string;
  created: number;
  processing_code: PaymentProcessingCode;
  message: string;
  transaction_id?: string;
  paid?: string;
  type: string;
}

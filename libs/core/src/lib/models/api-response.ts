export interface ApiResponse {
  version: string;
  status: number;
  message: string;
  meta?: any;
  result?: any;
}

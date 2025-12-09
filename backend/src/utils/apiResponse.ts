
class ApiResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: any;
  constructor(statusCode: number, message: string, data: any = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode >= 200 && statusCode < 400;
  }
}

export default ApiResponse;
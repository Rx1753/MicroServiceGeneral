export class ResponseModel {

  static success(response: any, message?: string) {
    return {
      status: true,
      message: message ?? 'success',
      response: response,
    };
  }
  
}

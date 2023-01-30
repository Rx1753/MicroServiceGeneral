export class HtmlTemplate {
  static sendEmailWithCredentials(
    userName: string,
    email: string,
    password: string
  ) {
    return (
      '<h1>Hello,' +
      userName +
      '</h1><p>Here is your admin credentials, Please enter it when you login to application as admin/roles</p><p><strong> Email: ' +
      '<span style="color: #339966;">' +
      email +
      '</span>' +
      '</strong></p><p><strong> Password: ' +
      '<span style="color: #339966;">' +
      password +
      '</span>' +
      '</strong></p>'
    );
  }

  static sendOtpOnForgotPassword(userName: string, code: string) {
    return (
      '<h3 style="color: #2b2301;"> Hi, ' +
      userName +
      '</h3>' +
      '<p>Please use this verification code to change your password : <strong class="demoClass">' +
      code +
      '</strong> <br /></p>'
    );
  }
}

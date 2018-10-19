export default class Auth {
  /**
   * Get token
   * @returns {String}
   */
  static getToken() {
    return localStorage.getItem('token');
  }

  /**
   * Check auth
   * @returns {Bool}
   */
  static isLogin() {
    return this.getToken() !== null;
  }

  /**
   * Check is admin or not
   * @returns {Bool}
   */
  static isAdmin() {
    const user = this.parseJwt();

    return user.is_admin === true;
  }

  /**
   * Paser Jwt to object
   * @returns {Object}
   */
  static parseJwt() {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');

    return JSON.parse(window.atob(base64));
  }

  /**
   * Log out
   * @returns {Bool}
   */
  static logout() {
    if (localStorage.getItem('email') && localStorage.getItem('token')) {
      localStorage.removeItem('email');
      localStorage.removeItem('token');
      window.location.href = `${window.app.baseUrl}login`;
    }
  }
}

import swal from 'sweetalert';
import Auth from '../middlewares/Auth';
import i18n from '../i18n';

class BaseRepository {
  constructor() {
    this.BASE_URL = window.app.apiUrl;
    this.PATH = '/';
  }

  index(offset, limit, order, direction, searchWord = '', params = {}) {
    return this.get(this.PATH, Object.assign({
      offset: offset || 0,
      limit: limit || 0,
      direction: direction || 'id',
      order: order || 'asc',
      query: searchWord || '',
    }, params));
  }

  show(id, params = {}) {
    return this.get(`${this.PATH}/${id}`, params);
  }

  store(params = {}) {
    return this.post(this.PATH, params);
  }

  update(id, params = {}) {
    return this.put(`${this.PATH}/${id}`, params);
  }

  destroy(id, params = {}) {
    return this.delete(`${this.PATH}/${id}`, params);
  }

  get(url, params = {}, headers = {}) {
    return this.request('GET', url, params, headers);
  }

  post(url, params = {}, headers = {}) {
    return this.request('POST', url, params, headers);
  }

  put(url, params = {}, headers = {}) {
    const newParams = params;
    newParams._method = 'put';

    return this.request('PUT', url, newParams, headers);
  }

  delete(url, params = {}) {
    const newParams = params;
    newParams._method = 'delete';

    return this.request('DELETE', url, newParams);
  }

  request(method, url, params = {}, headers) {
    let realUrl = this.BASE_URL + url;
    if (headers && headers['Content-Type'] && headers['Content-Type'] === 'application/json') {
      return fetch(realUrl, {
        credentials: 'same-origin',
        method,
        headers: {
          ...headers,
          Authorization: `Bearer ${Auth.getToken()}`,
        },
        body: JSON.stringify(params),
      })
        .then((response) => {
          if (response.status === 401 && Auth.isLogin()) {
            Auth.logout();
          }

          return response.json();
        });
    }
    let formData = new FormData();
    if (method === 'GET' || method === 'HEAD') {
      const query = Object
        .keys(params)
        .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
        .join('&');
      realUrl = `${realUrl}?${query}`;

      return fetch(realUrl, {
        credentials: 'same-origin',
        method,
        headers: {
          ...headers,
          Authorization: `Bearer ${Auth.getToken()}`,
        },
      })
        .then((response) => {
          if (response.status === 401 && Auth.isLogin()) {
            response.json().then((data) => {
              swal({
                text: i18n.t(`error:${data.error_code || ''}`),
                icon: 'warning',
                button: i18n.t('error:ok_button'),
                closeOnConfirm: false,
                closeOnCancel: false,
                closeOnClickOutside: false,
                closeOnEsc: false,
              }).then(() => {
                Auth.logout();
              });
            });

            return false;
          }

          return response.json();
        });
    }

    if (params instanceof FormData) {
      formData = params;
    } else {
      Object
        .keys(params)
        .forEach((key) => {
          if (Array.isArray(params[key]) && params[key].length > 0) {
            params[key].forEach((kParam, iParam) => {
              formData.append(`${key}[${iParam}]`, kParam);
            });
          } else {
            formData.append(key, params[key]);
          }
        });
    }

    return fetch(realUrl, {
      credentials: 'same-origin',
      headers: {
        ...headers,
        Authorization: `Bearer ${Auth.getToken()}`,
      },
      method,
      body: formData,
    }).then((response) => {
      if (response.status === 401 && Auth.isLogin()) {
        response.json().then((data) => {
          swal({
            text: i18n.t(`error:${data.error_code || ''}`),
            icon: 'warning',
            button: i18n.t('error:ok_button'),
            closeOnConfirm: false,
            closeOnCancel: false,
            closeOnClickOutside: false,
            closeOnEsc: false,
          }).then(() => {
            Auth.logout();
          });
        });

        return false;
      }

      return response.json();
    });
  }

  download(url, fileName, headers) {
    const realUrl = this.BASE_URL + url;

    return fetch(realUrl, {
      credentials: 'same-origin',
      headers: {
        ...headers,
        Authorization: `Bearer ${Auth.getToken()}`,
      },
      method: 'GET',
    }).then((response) => {
      if (response.status === 401 && Auth.isLogin()) {
        Auth.logout();
      }

      return response.blob();
    }).then((blob) => {
      const urlDownload = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = urlDownload;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      // remove element
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(urlDownload);
      }, 100);
    });
  }
}

export default BaseRepository;

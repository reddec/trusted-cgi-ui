import {API} from './client'


let baseUrl = process.env.API_URL;
if (!baseUrl) {
  baseUrl = [location.protocol, '//', location.host, location.pathname].join('');
  if (!baseUrl.endsWith('/')) {
    baseUrl += '/'
  }
}

export const baseURL = baseUrl;
export default new API(baseUrl + 'u/');

import {LambdaAPI} from "src/api/lambda_api";
import {ProjectAPI} from "src/api/project_api";
import {UserAPI} from "src/api/user_api";
import {QueuesAPI} from "src/api/queues_api";
import {PoliciesAPI} from "src/api/policies_api";

let baseUrl = process.env.API_URL;
if (!baseUrl) {
  baseUrl = [location.protocol, '//', location.host, location.pathname].join('');
  if (!baseUrl.endsWith('/')) {
    baseUrl += '/'
  }
}

export const baseURL = baseUrl;
export const apiURL = baseURL + 'u/'
export const lambdaAPI = new LambdaAPI(apiURL);
export const projectAPI = new ProjectAPI(apiURL);
export const userAPI = new UserAPI(apiURL);
export const queuesAPI = new QueuesAPI(apiURL);
export const policiesAPI = new PoliciesAPI(apiURL);

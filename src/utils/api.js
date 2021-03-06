import axios from 'axios';

const prefix = '/bi/';

function fire(method, URL, data) {
  if (method === 'POST') {
    return axios.post(prefix + URL, data)
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  }
  // if (method === 'GET') {
  //   return axios.get(prefix + URL, data)
  //     .then((res) => res.data)
  //     .catch((error) => {
  //       throw error;
  //     });
  // }
  return Promise.resolve();
}
export const fetchDashboardTitle = (params) => fire('POST', 'getDashboardTitle', params);
export const updateDashboard = (params) => fire('POST', 'updateDashboard', params);
export const getDashboardComponents = (params) => fire('POST', 'getDashboardComponents', params);
export const delDashboard = (params) => fire('POST', 'delDashboard', params);

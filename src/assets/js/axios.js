import axios from 'axios';
import Qs from 'qs';

export function axiosGet (url, data, successFn, failFn, finallyFn) {
  axios({
    method: 'get',
    url: url,
    params: data
  }).then(successFn).catch(failFn).finally(finallyFn);
}

export function axiosPost (url, data, successFn, failFn, finallyFn, qs) {
  axios({
    method: 'post',
    url: url,
    data: qs ? Qs.stringify(data) : data,
    /*     transformRequest: [
      function (data) {
        return Qs.stringify(data)
      }
    ], */
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(successFn).catch(failFn).finally(finallyFn);
}

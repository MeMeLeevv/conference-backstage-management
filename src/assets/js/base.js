export function storeLocalData (stateArr) {
  /* 需要的参数格式为: [[key, value]] */
  stateArr.forEach(e => {
    localStorage.setItem(e[0], JSON.stringify(e[1]));
  });
}

export function getLocalData (stateArr) {
  /* 需要的参数格式为: [[key, value] */
  let result = [];
  stateArr.forEach(e => {
    result.push(JSON.parse(localStorage.getItem(e)));
  });
  return result;
}

export function concatDataStr (arr) { /* [key, value, key, value] 拼接多对参数值对 */
  let result = '';
  let len = arr.length;
  for (let i = 0; i < len; i += 2) {
    result += `${arr[i]}=${arr[i + 1]}`;
    result += i === len - 2 ? '' : '&';
  }
  return result;
}

export function getherMSg (data, needChangeArr) { /* [[key, value]]  收集所有需要的参数并修改对应值 */
/* data是这个q请求的一些必备的数据，由于每次请求提交时如果对应值为空则就为空，所以需要将已知的储存起来
弄成数组形式而不是更规范一点的对象数组或者二维数组是方便查找到要更改的key值 */
  needChangeArr.forEach(item => {
    let index = data.indexOf(item[0]);
    if (index !== -1) {
      data[index + 1] = item[1]; /* 更换value */
    }
  });
  return concatDataStr(data);
}

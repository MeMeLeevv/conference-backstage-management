export function storeLocalData (stateArr) {
  /* 需要的参数格式为: [[key, value]] */
  stateArr.forEach(e => {
    localStorage.setItem(e[0], JSON.stringify(e[1]));
  });
}

export function getLocalData (stateArr) {
  /* 需要的参数格式为: [key] */
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

/*
    作用：浅拷贝
    @obj: Object/Array
    @return Object/Array
    */
export function shadowCopy (obj) {
  let result
  if (obj instanceof Object) {
    result = {}
  } else if (obj instanceof Array) {
    result = []
  } else {
    return obj
  }
  /* for (let i in obj) { // 以任意顺序遍历一个对象的除Symbol以外的可枚举属性
    if (obj.hasOwnProperty(i)) { // 这个方法可以用来检测一个对象是否含有特定的自身属性；和 in 运算符不同，该方法会忽略掉那些从原型链上继承到的属性。
      result[i] = obj[i]
    }
  } */
  // 总的来说，操作中引入继承的属性会让问题复杂化，大多数时候，我们只关心对象自身的属性。所以，尽量不要用for...in循环，而用Object.keys()代替。
  let keys = Object.keys(obj) // Object.keys返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名。
  for (let i = 0; i < keys.length; i++) {
    result[keys[i]] = obj[keys[i]]
  }
  return result
}
/*
  作用：深拷贝外壳，识别obj的类型，传参给真正的深拷贝函数
  @obj: Object/Array
  @return Object/Array
  */
export function deepCopy (obj) {
  let result
  if (obj instanceof Object) {
    result = {}
  } else if (obj instanceof Array) {
    result = []
  } else {
    return obj
  }
  return trueDeepCopy(result, obj)
}
/*
  作用：深拷贝
  @obj: Object
  @return Object
  var obj1 = {
    'name': 'zhangsan',
    'age': '18',
    'language': [1, [2, 3], [4, 5]]
  };
  */
function trueDeepCopy (result, source) {
  /* for (let i in source) {
    if (source.hasOwnProperty(i)) {
      if (source[i] instanceof Object) {
        result[i] = {}
        this.trueDeepCopy(result[i], source[i])
      } else if (source[i] instanceof Array) {
        result[i] = []
        this.trueDeepCopy(result[i], source[i])
      } else {
        result[i] = source[i]
      }
    }
  } */
  // 使用Object.keys
  let keys = Object.keys(source)
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i] // 取得键名
    if (source[key] instanceof Object) {
      result[key] = {}
      this.trueDeepCopy(result[key], source[key])
    } else if (source[key] instanceof Array) {
      result[key] = []
      this.trueDeepCopy(result[key], source[key])
    } else {
      result[key] = source[key]
    }
  }

  return result
}

/*
    作用：批量修改图片字段信息，基于后台字段统一，如果不统一反而会更麻烦，需要一个一个赋值
    @name: String 图片url字段，其他字段都是在这个基础上加上_xxx
    @imgMsgArr: Array 图片信息
    @return object
    */
export function getImgMsg (name, imgMsgArr) {
  if (imgMsgArr.length === 1) {
    let img = {}
    img[name] = imgMsgArr[0].img_url
    img[`${name}_jumpurl`] = imgMsgArr[0].jump_url
    img[`${name}_width`] = imgMsgArr[0].width
    img[`${name}_height`] = imgMsgArr[0].height
    img[`${name}_id`] = imgMsgArr[0].img_id
    return img
  }
}

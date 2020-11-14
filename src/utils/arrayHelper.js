/*
 * @Descripttion: 常用数组函数
 * @version: 1.0
 * @Author: wenchao.chai
 * @LastEditors: wenchao.chai
 * @Date: 2019-04-04 15:23:29
 * @LastEditTime: 2020-06-29 16:17:43
 */

/**
 * 复杂对象数组去重
 * @param  {arr} 数组本身
 * @param  {id} 用于去重判断的属性
 */
export function dealDistinct(arr, id) {
  var obj = {};
  if (arr instanceof Array) {
    return arr.reduce(function(item, next) {
      obj[next[id]] ? "" : (obj[next[id]] = true && item.push(next));
      return item;
    }, []);
  }
  return [];
}

/**
 * 递归查找
 * @param  {} source 数据源
 * @param  {} targetId 支持单id跟id数组
 * @param  {} result 返回值
 * @param  {} propsId Identified key default:id
 * @param  {} propsChildren  Identified children key default:children
 */
export function findTarget(
  source,
  targetId,
  result,
  propsId = "id",
  propsChildren = "children"
) {
  if (targetId instanceof Array) {
    for (let id of targetId) {
      findTargetArr(source, id, result, propsId, propsChildren);
    }
  } else {
    findTargetArr(source, targetId, result, propsId, propsChildren);
  }
}
function findTargetArr(source, targetId, result, propsId, propsChildren) {
  if (source && source.length) {
    for (let item of source) {
      if (item[propsId] === targetId) {
        result.push(item);
      } else if (item[propsChildren] && item[propsChildren].length) {
        findTargetArr(
          item[propsChildren],
          targetId,
          result,
          propsId,
          propsChildren
        );
      }
    }
  }
}

/**
 * @name: 获取递归数组总个数
 * @param {type}
 * @return:
 * @other:
 */
export function getRecursiveSize (source, propsChildren = "children") { //获取树长度
    let max = 0
    function each (data) {
        for(let i = 0;i<data.length;i++){
            max++;
            if(data[i][propsChildren]){
                each(data[i][propsChildren]);
            }
        }
    }
    each(source);
    return max
}

/**
 * @name: 获取递归数组中某个属性最大的那个item
 * @param {type} attr 注意需为数值型
 * @return:
 * @other:
 */
export function getRecursiveMaxId (source, attr = "id",propsChildren = "children") { //获取树长度
    let max = 0
    function each (data) {
        for(let i = 0;i<data.length;i++){
            if (max < parseInt(data[i][attr])){
                max = parseInt(data[i][attr])
            }
            if(data[i][propsChildren]){
                each(data[i][propsChildren]);
            }
        }
    }
    each(source);
    return max;
}

/**
 * @name: 深度拷贝
 * @param {obj} 对象 支持数组或对象
 * @return:
 * @other:
 */
export function deepCopy(obj) {
  // 只拷贝对象
  if (!obj && typeof obj !== "object") {
    throw new Error("error arguments", "deepClone");
  }
  // 根据obj的类型判断是新建一个数组还是一个对象
  var newObj = obj == null ? null : obj instanceof Array ? [] : {};
  for (var key in obj) {
    // 遍历obj,并且判断是obj的属性才拷贝
    if (obj.hasOwnProperty(key)) {
      // 判断属性值的类型，如果是对象递归调用深拷贝
      newObj[key] =
        typeof obj[key] === "object" ? deepCopy(obj[key]) : obj[key];
    }
  }
  return newObj;
}


/**
 * @name: 原系统的树节点数据清洗 version2.0
 * @param {data}
 * @return:
 * @other:
 */
export function buildTreeData(source, id="id", parentId="pId", name="name", rootParentId=null){
    let cloneData = JSON.parse(JSON.stringify(source))
    return cloneData.filter(father=>{
        let branchArr = cloneData.filter(child => father[id] == child[parentId]);
        if (branchArr.length > 0) {
          branchArr.forEach(branch => {
               branch.pLabel = father[name];
               branch.pId = father[id];
          });
          father["children"] = branchArr
        }
         father.label = father[name];
         father.id = father[id];

        return father[parentId] == rootParentId       // 如果第一层不是parentId=0，请自行修改
    })
}

/**
 * @name: 原系统的树节点数据清洗 version1.0
 * @param {data}
 * @return:
 * @other:
 */
export function buildTree(data, id = "id", pId = "pId", name="name", pIdValue ="pIdValue") {
  let  parents = [];
  let childrens = [];
  if(pIdValue != "pIdValue"){
    parents = data.filter(
      value => value[pId] == pIdValue
    );
    childrens = data.filter(
      value => value[pId] !== pIdValue
    );
  }else{
    parents = data.filter(
      value => value[pId] == "undefined" || value[pId] == null || value[pId] == "0" || value[pId] == ""
    );
    childrens = data.filter(
      value => value[pId] !== "undefined" && value[pId] != null && value[pId] != "0" && value[pId] != ""
    );
  }


  let translator = (parents, children) => {
    parents.forEach(parent => {
      parent.label = parent[name];
      parent.id = parent[id];
      children.forEach((current, index) => {
        if (current[pId] === parent[id]) {
          let temp = deepCopy(children);
          temp.splice(index, 1);
          translator([current], temp);
          current.label = current[name];
          current.id = current[id];
          current.pLabel = parent[name];
          current.pId = parent[id];
          typeof parent.children !== "undefined"
            ? parent.children.push(current)
            : (parent.children = [current]);
        }
      });
    });
  };
  translator(parents, childrens);

  return parents;
}

/**
 * @name: 树结构转数组返回
 * @param {type}
 * @return:
 * @other:
 */
export function treeToArr(data) {
    let arr = [];
    let level = 0;
    let translator = (parents,pId) => {
        parents.forEach(item => {
          arr.push({
            ...item,
            pId:pId,
            level:level
          });
          if (item.children && item.children.length > 0) {
              level++;
              translator(item.children, item.id);
              level--;
          }
        });
    }
    translator(data,"");

    return arr;
}


/**
 * @name: 递归tree insert item
 * @param {type}
 * @return:
 * @other:
 */
export function insertTree(data, item, id = "id", pId = "pId") {
  data = deepCopy(data);//不copy一份，直接修改原数组会导致视图有时不重渲染，这是因为vue对数组跟对象属性变化的监听缺陷
  let is_mount = false;
  let iteration = (data, item) => {
    if (is_mount) {
      return;
    }
    for (let index = 0; index < data.length; index++) {
      let current = data[index];
      if (current[id] == item[pId]) {
          if(current.children && current.children.length > 0){
            current.children.push(item);
          }else{
            current.children = [item];
          }
          is_mount = true;
          return;
      }
      if(current.children && current.children.length > 0){
           iteration(current.children, item);
      }
    }
  };
  iteration(data, item);

  return data;
}


/**
 * @name: 递归tree delete item
 * @param {type}
 * @return:
 * @other:
 */
export function deleteTree (data, targetId, id = "id") {
  var newData = data.filter(x => x[id] !== targetId)
  newData.forEach(x => x.children && (x.children = deleteTree(x.children, targetId)))
  return newData;
}


/**
 * @name: 深度优先遍历获取对应id的节点
 * @param {type}
 * @return:
 * @other:
 */
export function treeDeepQuery(tree, targetId, id = "id") {
    var isGet = false;
    var retNode = null;
    function deepSearch(tree,targetId){
        for(var i = 0; i<tree.length; i++) {
            if(tree[i].children && tree[i].children.length>0) {
                deepSearch(tree[i].children,targetId);
            }
            if(targetId === tree[i][id] || isGet) {
                isGet||(retNode = tree[i]);
                isGet = true;
                break;
            }
        }
    }
    deepSearch(tree,targetId);
    return retNode;
}
/**
 * @name: 树节点展开
 * @param {type}
 * @return:
 * @other:
 */
export function treeConvertToList(root,id = "id", pId = "pId"){
  const list = [];
  if (root) {
    const Root = JSON.parse(JSON.stringify(root));
    const queue = [];
    queue.push(Root);
    while (queue.length) {
      const node = queue.shift();
      if (node.children && node.children.length) {
        queue.push(...node.children);
      }
      delete node.children;
      if (node[pId] !== null && node[pId] !== undefined) {
        list.push(node);
      }
    }
  }
  return list;
}
/**
 * @name: 列表转化为多个根的树
 * @param {type}
 * @return:
 * @other:
 */
export function list2Tree(list, id = "id", pId = "pId", name) {
  list.forEach(function (item) {
    delete item.children;
  });
  let map = {};
  list.forEach(function (item) {
    map[item[id]] = item;
    if(name) {
      item.label = item[name];
      item.id = item[id];
    }
  });
  let val = [];
  list.forEach(function (item) {
    let parent = map[item[pId]];
    if (parent) {
      (parent.children || (parent.children = [])).push(item);
      item.pId = parent[id];
      item.pLable = parent[name];
    } else {
      val.push(item);
    }
  });
  return val;
}

 /**
  * @name: 数组按id分组
  * @param {id} 分组标识
  * @param {groupAttr} 可选分组显示字段 从循环的第一个item中取
  * @return: 
  * @other: 
  */
 export function arrayGroup(arr, id = "id", groupAttr=[]){
    var map = {},
    dest = [];
    for(var i = 0; i < arr.length; i++){
        var ai = arr[i];
        if(!map[ai[id]]){
            let obj = {
                id: ai[id], 
                data: [ai]
            };
            groupAttr.forEach(attr => {
              obj[attr] = ai[attr];
            });
            dest.push(obj);
            
            map[ai[id]] = ai;
        }else{
            for(var j = 0; j < dest.length; j++){
                var dj = dest[j];
                if(dj.id == ai[id]){
                    dj.data.push(ai);
                    break;
                }
            }
        }
    }
    return dest;
}

/*
 * @Descripttion: 监听 dom 的size change  name:绑定的回调方法名称 id:domId(可空) 
 * @version: 1.0
 * @Author: wenchao.chai
 * @LastEditors: wenchao.chai
 * @Date: 2019-04-12 16:22:37
 * @LastEditTime: 2019-09-18 14:13:26
 */

import {
  addResizeListener,
  removeResizeListener
} from "element-ui/src/utils/resize-event";

let timer = {};//key: vnode.context._uid,value: timer

const doResize = (el, binding, vnode) => { 
  const { value } = binding;
  let tag = value && value.tag;
  if (!tag) {
    tag = vnode.context._uid
  } 
  if (timer[tag]) {
    clearTimeout(timer[tag]);
  }
  timer[tag] = setTimeout(() => {  
    const { componentInstance: $dom } = vnode; 
    let name = value && value.name;
    let id = value && value.id;

    let windowClientHeight = window.document.documentElement.clientHeight;
    let windowClientWidth = window.document.documentElement.clientWidth;
      
    if (id) {
      id = vnode.elm.id;
      if (document.getElementById(id)) {  
        let domClientWidth = document.getElementById(id).clientWidth;
        let domClientHeight = document.getElementById(id).clientHeight;

        vnode.context[name](
          domClientWidth,
          domClientHeight,
          windowClientWidth,
          windowClientHeight
        ); // newWidth作为参数回调绑定的方法
      }else{
        //tagview切换时候，document.getElementById(id) == null
        // console.log(id);
      }
    } else { 
      //未设置id 只返回window client
      vnode.context[name](0, 0, windowClientWidth, windowClientHeight); // newWidth作为参数回调绑定的方法
    }
  }, 200);
};

export default {
  bind(el, binding, vnode) {
    el.resizeListener = () => {
      doResize(el, binding, vnode);
    };
    addResizeListener(el, el.resizeListener);//页面内部变动引起dom长宽变化触发事件
    addResizeListener(window.document.body, el.resizeListener)//浏览器变动触发事件
  },
  inserted(el, binding, vnode) {
    doResize(el, binding, vnode);
  },
  unbind(el) {
    removeResizeListener(el, el.resizeListener);
    removeResizeListener(window.document.body, el.resizeListener)
  }
};

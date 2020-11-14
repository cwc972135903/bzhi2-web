import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css'

import Element from 'element-ui'
//
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

// 数据字典
import dict from './components/Dict'

// 权限指令
import permission from './components/Permission'
import './assets/styles/element-variables.scss'
// global css
import './assets/styles/index.scss'

// 代码高亮
import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/atom-one-dark.css'

import App from './App'
import store from './store'
import router from './router/routers'
import * as filters from "./filters"; // global filters

import './assets/icons' // icon
import './router/index' // permission control
import 'echarts-gl'

Vue.use(VueHighlightJS)
Vue.use(mavonEditor)
Vue.use(permission)
Vue.use(dict)
Vue.use(Element, {
  size: Cookies.get('size') || 'small' // set element-ui default size
})
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
}); 
/**
 * @name: 手动删除keep-alive对应key的缓存 version 0.2
 * @param {type}
 * @return:
 * @other: 与tagsView.js结合实现对于keep-alive缓存的维护操作。
 tagsView中利用 
 this.$router.replace({
   path: '/redirect' + fullPath
 })
 实现触发deleteCache，deleteCache中利用that.$parent.$children获取所有keep-alive下的缓存实例，
 that.$store.getters.visitedViews获取tagsView维护的数据，两者进行同步操作。同步时的变化点用
 visitedViews内部的属性（如刷新用到的is_current）进行判别。
 */
function deleteCache(that, to, from) { 
  let nodeChildren = that.$parent.$children;
  if (nodeChildren && nodeChildren.length > 0) {
      for (let index = 0; index < nodeChildren.length; index++) {
         //判断每个node实例还在不在visitedViews中，若不在，则销毁。在不在是通过key来匹配判断
        let node = nodeChildren[index];
        if (!node.$vnode || !node.$vnode.key) {
           continue;
        }
        let nodeKey = node.$vnode.key; 
        const fullPathList = that.$store.getters.visitedViews.filter(c => !c.is_current).map(v => v.fullPath);
        if (fullPathList.indexOf(nodeKey.replace(nodeKey.split("/")[0],"")) == -1) {
          //不在visitedViews中
          deleteNodeCache(node);
        } 
      } 
  } 
}

function deleteNodeCache(node) {
   //删除from的缓存
    if (node.$vnode && node.$vnode.data && node.$vnode.data.keepAlive) {
      if (
        node.$vnode.parent &&
        node.$vnode.parent.componentInstance &&
        node.$vnode.parent.componentInstance.cache
      ) {
        if (node.$vnode.componentOptions) {
          var key =
            node.$vnode.key == null
              ? node.$vnode.componentOptions.Ctor.cid +
                (node.$vnode.componentOptions.tag
                  ? `::${node.$vnode.componentOptions.tag}`
                  : "")
              : node.$vnode.key;
          var cache = node.$vnode.parent.componentInstance.cache;
          var keys = node.$vnode.parent.componentInstance.keys;
          if (cache[key]) {
            if (keys.length) {
              var index = keys.indexOf(key);
              if (index > -1) {
                keys.splice(index, 1);
              }
            }
            delete cache[key]; 
            if (node._watchers && key.indexOf("=") == -1) {//JSON.stringify(from.params) == "{}"
                node.$destroy();//from.params不为空的组件不进行销毁(隐藏的更新 新增页面)
            } 
          }
        }
      }
    }
}

Vue.mixin({
  // created(){
  //   window.console.log('global mixin')
  // }
  beforeRouteUpdate(to, from, next) {
    deleteCache(this, to, from);
    next();
  },
  beforeRouteLeave: function(to, from, next) {
    deleteCache(this, to, from);
    next();
  }
});
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

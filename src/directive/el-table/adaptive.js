/*
 * @Descripttion: el-table adaptive 注意 
 ! 注意 此directive已弃用 统一用el-doresize
 * @version: 2.0
 * @Author: wenchao.chai
 * @LastEditors: wenchao.chai
 * @Date: 2019-04-02 09:34:12
 * @LastEditTime: 2019-11-05 16:14:34
 */


import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'

/**
 * How to use
 * <el-table height="100px" v-el-height-adaptive-table="{topDomId:'complexTableContainer',bottomOffset:30}">...</el-table>
 * el-table height is must be set 不设置的话，内部滚动条就没了 自动根据页面高度确定需设置为字符串形式:"..px" 若手动指定高度，则设置为number
 * topDomId: 其上方邻近的dom元素id，需通过其确定相对高度
 * bottomOffset: 30(default)   //底部留余区域高度
 * document.getElementById(topDomId).getBoundingClientRect().top // 对应元素上边距离页面上边的距离
 */ 
const doResize = (el, binding, vnode) => { 
  const { componentInstance: $table } = vnode

  const { value } = binding

  if (!$table || typeof($table.height) == "undefined") {
    throw new Error(`el-$table must set the height. Such as height='100px'`)
  }
    
  if (!$table) return
   
  const bottomOffset = (value && value.bottomOffset) || 30  

  let top;
  let topDomId = (value && value.topDomId)
  if (!topDomId) {
    top = el.getBoundingClientRect().top
  }else{
    if (!document.getElementById(topDomId)) {
        return;//切换页面的时候也会触发，但此时页面已经切换，domid是找不到的
    }
    top = el.getBoundingClientRect().top - document.getElementById(topDomId).getBoundingClientRect().top
  } 

  let innerHeight = $table.height
   
  if (typeof($table.height) != "number") {//此时组件作为非布局组件 innerHeight取window.innerHeight
      //window.innerHeight:	返回窗口的文档显示区的高度。 我们需要的是内容框的高度，是相对高度.
      innerHeight = window.innerHeight - document.getElementById(topDomId).getBoundingClientRect().top 
  }else{
    //此时组件作为布局组件存在 innerHeight取布局父组件传递进来的高度
  } 

  const height = innerHeight - top - bottomOffset
   
  $table.layout.setHeight(height)
  $table.doLayout() // 对 Table 进行重新布局。当 Table 或其祖先元素由隐藏切换为显示时，可能需要调用此方法
}

export default {
  bind(el, binding, vnode) {
    el.resizeListener = () => {
      doResize(el, binding, vnode)
    }

    addResizeListener(el, el.resizeListener)
  },
  inserted(el, binding, vnode) {
    doResize(el, binding, vnode)
  },
  unbind(el) {
    removeResizeListener(el, el.resizeListener)
  }
}


import doresize from './doresize'

const install = function(Vue) {
  Vue.directive('el-resize', doresize)
}

if (window.Vue) {
  window['el-resize'] = doresize
  Vue.use(install); 
}

doresize.install = install
export default doresize

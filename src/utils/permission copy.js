/*
 * @Descripttion: 
 * @version: 
 * @Author: wenchao.chai
 * @Date: 2019-04-02 09:34:12
 * @LastEditors: wenchao.chai
 * @LastEditTime: 2019-04-02 09:34:12
 */
import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    }) 
    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}

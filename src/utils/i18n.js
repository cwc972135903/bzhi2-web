/*
 * @Descripttion: 国际化helper
 * @version: 
 * @Author: wenchao.chai
 * @Date: 2019-09-20 17:43:13
 * @LastEditors: wenchao.chai
 * @LastEditTime: 2020-05-07 16:39:09
 */

/**
 * @name: translate router.meta.title, be used in breadcrumb sidebar tagsview
 * @param {type} 
 * @return: 
 * @other: 
 */
export function generateTitle(title) {
  const hasKey = this.$te('route.' + title)

  if (hasKey) {
    // $t :this method from vue-i18n, inject in @/lang/index.js
    const translatedTitle = this.$t('route.' + title)

    return translatedTitle
  }
  return title
}

/**
 * @name: 根据key获取国际化对应value
 * @param {key} route.demo
 * @return: 
 * @other: 
 */
export function generateKey(key) {
  const hasKey = this.$te(key)

  if (hasKey) {
    // $t :this method from vue-i18n, inject in @/lang/index.js
    const translatedTitle = this.$t(key)

    return translatedTitle
  }
  return key
}
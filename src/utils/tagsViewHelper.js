/*
 * @Descripttion: tagsView相关方法封装， 包括主动调用页面刷新、关闭
 * @version: 1.0
 * @Author: wenchao.chai
 * @Date: 2020-01-03 09:55:00
 * @LastEditors: wenchao.chai
 * @LastEditTime: 2020-05-22 11:01:07
 */

/**
 * @name: tag上的更新
 * @param {type} 
 * @return: 
 * @other: 
 */
export function refreshTag(that){
    let view = that.$route;
    //version 0.2
    that.$store.dispatch('tagsView/setCurrentRefreshView',view).then(() => {
        //再打开tag
    const { fullPath } = view 
        that.$nextTick(() => {
            that.$router.replace({
                path: '/redirect' + fullPath
            })
            that.$nextTick(() => {
                that.$store.dispatch('tagsView/restoreCurrentRefreshView')
            })
        }) 
    }) 
}

/**
 * @name: tag关闭
 * @param {type} 
 * @return: 
 * @other: 
 */
export function closeSelectedTag(that) {
    let view = that.$route;
    that.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) => { 
        toLastView(visitedViews,that) 
    })
}

function toLastView(visitedViews,that) {
    const latestView = visitedViews.slice(-1)[0]
    if (latestView) {
        that.$router.push(latestView)
    } else {
        // You can set another route
        that.$router.push('/')
    }
}

/**
 * @name: tag 关闭所有
 * @param {type} 
 * @return: 
 * @other: 
 */
export function closeAllTags(that) {  
    that.$store.dispatch('tagsView/delAllViews').then(() => { 
        that.$nextTick(() => {
            that.$router.replace({
                path: '/'
            }) 
        }) 
    })
}
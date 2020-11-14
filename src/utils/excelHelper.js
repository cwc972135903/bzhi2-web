/*
 * @Descripttion: excel 相关方法 
 ! 已弃用，现参考import('@/vendor/Export2Excel') 
 * @version: 1.0
 * @Author: wenchao.chai
 * @Date: 2019-07-23 09:58:05
 * @LastEditors: wenchao.chai
 * @LastEditTime: 2020-02-28 15:37:28
    导出数据重复：
    使用了el-table的fixed属性来让某一列固定，但elementui的实现方式是：创建了两个tabledom，
    通过一个隐藏一个显示来实现交互效果。当我导出整个el-table 就会将两个div内的table都导出，导致数据重复。
    解决办法：定义一个属性进行fixed，导出过程中该属性设置为false，$nexttick中进行导出操作，导完该属性再改回来
 */


import fileSaver from 'file-saver'
import xlsx from 'xlsx' 
import { getDate } from "@/utils/dateHelper";

/**
* @name: export 
* @param {tableId} domId "#tableId"
* @param {fileName} export file name "123.xlsx"
* @return: 
* @other: 
*/
export function exportTable(tableId, fileName) {  
    let box=xlsx.utils.table_to_book(document.querySelector(tableId))
    let out=xlsx.write(box,{
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
    })
    try {
        fileSaver.saveAs(
            new Blob([out],{
            type: 'application/octet-stream'
            }),
            fileName || '列表导出_'+getDate()+'.xlsx'
        )
    } catch(e) {
        // 错误处理方式
    }
    return out
}
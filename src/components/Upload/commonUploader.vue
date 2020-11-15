<!--
 * @Descripttion: 通用导入组件
 * @version: 1.0
 * @Author: wenchao.chai
 * @Date: 2019-07-17 11:30:39
 * @LastEditors: wenchao.chai
 * @LastEditTime: 2020-11-05 13:38:55
 -->

<template>
  <div class="common-upload-container">
    <el-upload
      ref="upload"
      class="upload-demo"
      :headers="headers"
      :data="data"
      :accept="accept"
      :action="baseUrl+action"
      :multiple="multiple"
      :disabled="disabled"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-error="handleError"
      :on-success="handleSuccess"
      :before-upload="handleBeforeUpload"
      :file-list="fileList"
      :limit="limit"
      :auto-upload="false"
    >
      <el-button
        slot="trigger"
        size="small"
        type="primary"
      >
        选取文件
      </el-button>
      <el-button
        style="margin-left: 10px;"
        size="small"
        type="success"
        @click="submitUpload"
      >
        上传到服务器
      </el-button>
      <div
        slot="tip"
        class="el-upload__tip"
      >
        {{ tip }} {{ appendTip }}
      </div>
      <!-- <el-button @click="test">test</el-button> -->
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'

const acceptWhiteList = ".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PNG,.GIF,.BMP,.PDF,.XLS,.XLSX,.doc,.docx,.txt,.zip,.rar,.7z";
const acceptTypeList = [{
    id:"jpg",
    value:"image/jpeg"
  },{
    id:"jpeg",
    value:"image/jpeg"
  },{
    id:"png",
    value:"image/png"
  },{
    id:"gif",
    value:"image/gif"
  },{
    id:"bmp",
    value:"image/bmp"
  },{
    id:"pdf",
    value:"application/pdf"
  },{
    id:"xls",
    value:"application/vnd.ms-excel"
  },{
    id:"xlsx",
    value:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  },{
    id:"doc",
    value:"application/msword"
  },{
    id:"docx",
    value:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  },{
    id:"txt",
    value:"text/plain"
  },{
    id:"zip",
    value:"application/x-zip-compressed"
  }
];
export default {
  name: 'CommonUploader',
  props: {
    //-----------------------------可选属性-----------------------------
    /**
     * @name: 上传地址
     */
    action:{
      type:String,
      default(){
        return "";
      }
    },
    /**
     * @name: 上传参数
     */
    data:{
      type:Object,
      default(){
        return {};
      }
    },
    /**
     * @name: 是否多选
     */
    multiple:{
      type:Boolean,
      default(){
        return false;
      }
    },

    /**
     * @name: 最大允许上传个数
     */
    limit:{
      type:Number,
      default(){
        return 10;
      }
    },
    /**
     * @name: 文件类型限制
     * others: 注意这里只是选择文件时限制格式，其实用户还是可以点选“所有文件”选项，上传其他格式。
     如果需要在在上传时再次校验，择需要在:before-upload这个钩子绑定相应的方法来校验
     */
    accept:{
      type:String,
      default(){
        return acceptWhiteList;
      }
    },
    /**
     * @name: 提示文字
     */
    tip:{
      type:String,
      default(){
        return "";
      }
    },
    /**
     * @name: 是否禁用
     */
    disabled:{
      type:Boolean,
      default(){
        return false;
      }
    },
    //-----------------------------钩子函数---------------------------
    /**
     * @name:  点击文件列表中已上传的文件时的钩子
     * @other:
     */
    onPreview:{
       type: Function,
      default: () => {
        return  ()=>{};
      }
    },
    /**
     * @name:  文件列表移除文件时的钩子
     * @other:
     */
    onRemove:{
      type: Function,
      default: () => {
        return  ()=>{};
      }
    },
    /**
     * @name:  文件上传失败时的钩子
     * @other:
     */
    onError:{
      type: Function,
      default: () => {
        return  ()=>{};
      }
    },
    /**
     * @name:   文件上传成功时的钩子
     * @other:
     */
    onSuccess:{
       type: Function,
      default: () => {
        return  ()=>{};
      }
    },
    /**
     * @name:  文件上传前的钩子
     * others:上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
     */
    onBeforeUpload:{
      type: Function,
      default: () => {
        return  ()=>{};
      }
    }
  },
  data() {
    return {
        baseUrl: window.env.VUE_APP_BASE_API_BZHI2_ENTIRE, // process.env.VUE_APP_BASE_API_BZHI2_ENTIRE,
        headers:{
          token:getToken()
        },
        fileList: [],
        uploadLmt: window.env.VUE_APP_UPLOAD_LIMIT,//process.env.VUE_APP_UPLOAD_LIMIT,
        appendTip:` 大小限制：${window.env.VUE_APP_UPLOAD_LIMIT || 100}M`
    };
  },
  computed: {

  },
  methods: {
    submitUpload() {
        this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      if (this.onRemove) {
            this.onRemove(file, fileList);
      }
    },
    handlePreview(file) {
      if (this.onPreview) {
            this.onPreview(file);
      }
    },
    handleError(err, file, fileList){
      if (this.onError) {
          let status = err.status + '';
          let url = err.url;
          this.onError(`status: ${status},url: ${url}`,file, fileList);
      }
    },
    handleSuccess(response, file, fileList){
      if (response.code !== 200 && response.code != 20000) {
          if (this.onError) {
              this.onError(response.message||response.msg,file, fileList);
          }
      }else{
        if (this.onSuccess) {
            this.onSuccess(response, file, fileList);
        }
      }
    },
    handleBeforeUpload(file){
        //1 公共校验 大小限制
        const ltm = this.uploadLmt || 100;
        const isLtM = file.size / 1024 / 1024 < ltm;
        if (!isLtM) {
          this.$message.error(`文件大小不能超过 ${ltm}MB!`);
          return false;
        }
        //2 对accept，进行校验
        let acceptNameSuffixList = this.accept.split(",");
        acceptNameSuffixList = acceptNameSuffixList.map(c=>c.toLowerCase());
        let acceptTypeListFilter = acceptTypeList.filter(c=> acceptNameSuffixList.indexOf(c.id) > -1);
        let acceptTypeListFilterVal = acceptTypeListFilter.map(c=>c.value);//当前accept对应的file type list

        if (acceptTypeListFilterVal.indexOf(file.type) == -1) {
            let fileNameArr = file.name.split(".");
            let fileNameSuffix = "."+fileNameArr[fileNameArr.length - 1];
            if (acceptNameSuffixList.indexOf(fileNameSuffix) == -1) {
              this.$message.error(`文件类型不符合,允许上传类型:${this.accept}`);
              return false;
            }
        }
        //3 各个业务自身校验
        if (this.onBeforeUpload) {
           return this.onBeforeUpload(file);
        }else{
          return true;
        }
    },
    /**
     * @name: 清空已上传的文件列表
     * @param {type}
     * @return:
     * @other: （该方法不支持在 before-upload 中调用）
     */
    clearFiles:function(){
        this.$refs.upload.clearFiles();
    },

  }
}
</script>


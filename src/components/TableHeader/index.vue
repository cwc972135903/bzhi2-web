<!--
 * @Descripttion: Table 的header组件 包括了table title toolbar
 * @version: 1.0
 * @Author: wenchao.chai
 * @LastEditors: wenchao.chai
 * @Date: 2019-04-17 15:05:01
 * @LastEditTime: 2020-04-07 15:27:50
 -->


<template>
    <div class="el-table_header">
      <div class="el-table_title" v-if="title != ''">
          <svg-icon :icon-class="iconClass" v-if="iconClass"/>
          <span>{{title}}</span>
      </div>
      <div class="el-table_toolbar">
         <slot/>
      </div>
  </div>
</template>

<script> 
import waves from "@/directive/waves"; // Waves directive
export default {
  name: "TableHeader",
  props: {   
    /**
     * @name: title text
     */
    title: {
      default: () => {
        return "";
      }
    },
    /**
     * @name: title icon
     */
    iconClass:{
      default: () => {
        return "";
      }
    }
  },
  directives: { waves },
  data() {
    return { 
 
    };
  }, 
  computed: { 
     
  },
  mounted() {  
  },
  watch: {
     
  },
  updated() {
     
  }, 
  methods: {
   
  }
};
</script>

<style scoped>
  .el-button{
    margin: 0px
  } 
</style>

<style> 
  .el-table_header{ 
    padding-bottom: 5px; 
    background-color:#ffffff;
    color: #606266;
  }
  .el-table_title{ 
    padding-left: 5px;
    padding-top: 5px; 
    font-size: 15px;
  }
  .el-table_toolbar{
    margin-top: 1px;
  }
</style>
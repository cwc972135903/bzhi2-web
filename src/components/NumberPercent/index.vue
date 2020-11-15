<!--
 * @Descripttion: 数字百分比控件
 * @version: 1.0
 * @Author: wenchao.chai
 * @Date: 2019-06-18 15:00:38
 * @LastEditors: wenchao.chai
 * @LastEditTime: 2020-08-31 16:39:51
 -->

<template>
  <!-- <div> -->
  <!-- <el-button @click="test">test</el-button>   -->
  <el-input-number
    v-model="number"
    :size="size"
    :precision="precision"
    :step="step"
    :min="min"
    :max="max"
    :disabled="disabled"
    :placeholder="placeholder"
    :controls-position="controlsPosition"
    :controls="controls"
  />
  <!-- </div> -->
</template>
<script>
import { percentFormat } from "@/utils/numberHelper";
import { 
  divide,bignumber
} from 'mathjs'
export default {
  name: 'NumberPercent',
  components: {  },
  /**
   * @name: 用于数据绑定v-model对应的prop跟event。默认是value跟input
   */
  model: {
    prop: "num",
    event: "returnBack"
  },
  props: {
    num: { 
    },
    // eslint-disable-next-line vue/require-default-prop
    size:{  
    },
    step:{ 
        default(){
            return 1;
        }
    },
    /**
     * @name: 默认精度4位
     * @param {type} 
     * @return: 
     * @other: 
     */ 
    precision:{ 
     type:Number,
     default(){ 
            return 4;
      }
    },
    min:{
        default(){ 
            return 0;
        }
    },
    max:{
        default(){ 
            return Infinity;
        }
    },
    disabled:{
        default:false
    },
    placeholder:{ 
      default(){
        return "";
      }
    },
    // eslint-disable-next-line vue/require-default-prop
    controlsPosition:{

    },
    controls:{
        default:false
    }
  },
  data() {
    return {
    }
  },
  computed: { 
    number: {
      get: function() {    
        return (this.num == null || this.num == undefined) ? undefined: percentFormat(this.num, this.precision);
      },
      set: function(newVal) {  
        if (newVal == null || newVal == undefined) {
          this.$emit("returnBack",newVal);
        }else{ 
            this.$emit("returnBack", divide(bignumber(newVal), 100) * 1.0);
        } 
      }
    }
  }, 
  methods:{
      test:function(){
          // eslint-disable-next-line no-debugger
          debugger
      }
  }
}
</script>
<style lang="scss" scoped>
 
</style>


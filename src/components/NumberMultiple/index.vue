<!--
 * @Descripttion: 数字倍数控件 如以百、万单位显示
 * @Version:: 1.0
 * @Author: pengjie.ye
 * @Date: 2020-07-10 13:45:52
 * @LastEditors: pengjie.ye
 * @LastEditTime: 2020-10-15 09:30:40
--> 

<template>
    <!-- <div> -->
        <!-- <el-button @click="test">test</el-button> -->
        <el-input-number v-model="number" :size="size" :precision="precision" :step="step" :min="min"
        :max="max" :disabled="disabled"
        :placeholder="placeholder" :controls-position="controlsPosition" :controls="controls"></el-input-number>
    <!-- </div> -->
</template>
<script>
import { percentFormat,multipleFormat } from "@/utils/numberHelper";
import { 
  bignumber,multiply
} from 'mathjs'
export default {
  name: 'NumberMultiple',
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
    /**
     * @name: 默认显示除以的倍数 10000
     * @param {type} 
     * @return: 
     * @other: 
     */ 
    multiple:{
      type:Number,
      default(){
        return 10000;
      }
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
     * @name: 默认精度6位
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
        return (this.num == null || this.num == undefined) ? undefined:multipleFormat(this.num,this.multiple);
      },
      set: function(newVal) { 
        if (newVal == null || newVal == undefined) {
          this.$emit("returnBack",newVal);
        }else{
          this.$emit("returnBack",multiply(bignumber(newVal), this.multiple) + '');
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

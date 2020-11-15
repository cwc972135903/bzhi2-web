<!--
 * @Descripttion: 树形下拉框 单选 支持v-model、非v-model
 * @version: 1.0
 * @Author: wenchao.chai
 * @LastEditors: wenchao.chai
 * @Date: 2019-04-04 11:09:58
 * @LastEditTime: 2020-06-19 15:47:30
 * @remark: this.$emit('returnBack',"");returnBack对应着props.valueId, props不能直接修改，可用过model的形式修改，同时会触发对应props的watch事件。
             在methods相关操作中，不要直接操作props内字段，而要用data或者computed代替.
             此组件中，valueSelected对应着v-model下的valueId，非v-model下的valueIdNotModel. 变化的地方封装在valueSelected的set get中

             v-model下: this.$emit()==>valueId watch==>updated
 -->

<template>  
  <el-select
    ref="select"
    v-model="valueSelected"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    :filterable="filterable"
    :filter-method="filterMethod"
    @clear="clear"
  >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.label"
      :value="item.id"
      hidden
    />
    <el-option
      value
      label
    >
      <el-tree
        ref="selectTree"
        :accordion="accordion"
        :data="data"
        :node-key="props.value"
        :current-node-key="valueSelected"
        :default-expanded-keys="defaultExpandedKeys"
        :props="props"
        :render-content="renderContent"
        :filter-node-method="filterNode"
        :expand-on-click-node="expandOnClickNode"
        @node-click="handleNodeClick"
      />
    </el-option>
  </el-select> 
</template>

<script>
import { findTarget } from "@/utils/arrayHelper";
export default {
  name: "SelectTreeSingle",
  /**
   * @name: 用于数据绑定v-model对应的prop跟event。默认是value跟input
   */
  model: {
    prop: "valueId",
    event: "returnBack"
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    valueId: null, //父组件如果有传值(v-model="id") 获取valueId为null/value, 如果没有传值则为undefind.
    accordion: { //是否每次只打开一个同级树节点展开,选项多的时候可设置为true
      default: () => {
        return false;
      }
    },
    clearable: {//是否可清空
      default: () => {
        return true;
      }
    },
    data: {
      type: Array,
      default: () => {
        return [];
      }
    },
    props: {
      type: Object,
      default: () => {
        return {
          value: "id", // ID字段名
          label: "label", // 显示名称
          children: "children" // 子级字段名
        };
      }
    },
    placeholder: {
      default: () => {
        return "请选择";
      }
    },
    disabled: {//是否禁用
      default: () => {
        return false;
      }
    },
    /**
     * @name: 自定义显示label
     * @param {type} 
     * @return: 
     * @other: 
     */
    // eslint-disable-next-line vue/require-default-prop
    renderContent: {
      type: Function,
    },
    /**
     * @name: 过滤方法
     * @param {type} 
     * @return: 
     * @other: 
     */
    filterNode: {
      type: Function,
      default: (type,data) => {
        if(!type) {
          return true;
        }
        return data.label.indexOf(type)!==-1;
      }
    },
    /**
     * @name: 是否在点击节点的时候展开或者收缩节点， 默认值为 false，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。
     * @param {type} 
     * @return: 
     * @other: 
     */
    expandOnClickNode: {
      default: () => {
        return false;
      }
    },
    /**
     * @name: 是否开启搜索
     * @param {type} 
     * @return: 
     * @other: 
     */
    filterable: {
      default: () => {
        return true;
      }
    }
  },
  data() {
    return {
      valueIdNotModel: null, //当不是v-model模式下的valueId
      options: [],
      hasChangeValueId: false
    };
  },
  computed: {
    /**
     * @name: true:v-model模式下
     */
    isVModel: {
      get: function() {
        if(typeof this.valueId=="undefined") {
          return false;
        } else {
          return true;
        }
      }
    },
    valueSelected: {
      get: function() {
        if(this.isVModel) {
          return this.valueId;
        } else {
          return this.valueIdNotModel;
        }
      },
      set: function(newVal) {
        if(this.isVModel) {
          this.$emit("returnBack",newVal);
          this.$refs.select.blur();
        } else {
          this.valueIdNotModel=newVal;
          this.initHandle(newVal);
          this.hasChangeValueId=true;
        }
      }
    },
    defaultExpandedKeys: {
      get: function() {
        if(this.valueSelected) {
          return [this.valueSelected];
        } else {
          return [];
        }
      }
    }
  },
  watch: {
    valueId(newVal,oldVal) {
      this.hasChangeValueId=newVal!=oldVal;
      if(this.hasChangeValueId) {
        this.initHandle(newVal);
      }
    },
    /**
     * @name: 监听数据源变化 异步加载数据源时 触发render
     * @param {type} 
     * @return: 
     * @other: 
     */
    data(newVal,oldVal) {
      if(newVal!=oldVal) {
        this.initHandle(this.valueId);
      }
    }
  },
  mounted() {
    this.initHandle(this.valueSelected);
  },
  updated() {
    if(this.hasChangeValueId) {
      //  watch之后，有数据了再调用方法
      this.$refs.selectTree.setCurrentKey(this.valueSelected||null); //注意清空选择要用null，不能用""
      this.hasChangeValueId=false;
    }
  },
  methods: {
    /**
     * @name: 初始化值 options
     */
    initHandle(id) {
      let options=[];
      if(id) {
        let result=[];
        findTarget(this.data,[id],result,this.props.value,this.props.children);
        if(result.length>0) {
          options=[
            {
              id: result[0][this.props.value],
              label: result[0][this.props.label]
            }
          ];
        }
      }
      this.options=options;
    },
    /**
     * @name: filterable mode下 
     * @param {type} 用户输入的搜索词
     * @return: 
     * @other: 
     */
    filterMethod: function(val) {
      this.$refs.selectTree.filter(val);
    },
    //================================暴露事件================================================
    /**
     * @name: tree click
     */
    handleNodeClick: function(data) {
      this.valueSelected=data[this.props.value]; //这里得手工维护 current-node-key只是初始化选中的节点，无绑定作用
      this.$emit("handleNodeClick",data);
    },
    /**
     * @name: select clear
     */
    clear: function() { 
      //element ui 2.9.x selectTree.setCurrentKey(null) 并不会移除当前 class="el-tree-node is-current is-focusable" =》class="el-tree-node is-focusable"
      //导致is-current的样式残留，新版本element ui已修复。这里我们自己实现。
      let nodes = this.$refs.selectTree.$el.querySelectorAll("div[role=treeitem]");
      if (nodes && nodes.length > 0) {
        nodes.forEach(element => {
          element.classList.remove("is-current");
        });
      } 
      this.$emit("clear");
    },
    //================================暴露方法================================================
    /**
     * @name: 获取当前选中key
     */
    getCurrentKey: function() {
      return this.$refs.selectTree.getCurrentKey();
      // 其他返回形式
      // return this.valueId; //只在v-model下有用
      // return this.valueSelected;
    },
    /**
     * @name: 获取当前选中节点
     */
    getCurrentNode: function() {
      return this.$refs.selectTree.getCurrentNode();
    },
    /**
     * @name: 设置当前选中key
     */
    setCurrentKey: function(key) {
      this.valueSelected=key;
    },
    /**
     * @name: 设置当前选择node
     */
    setCurrentNode: function(node) {
      this.valueSelected=node[this.props.value];
    },
    /**
     * @name: 供外部调用主动过滤显示项
     * @param {type} 
     * @return: 
     * @other: 
     */
    filter: function(val) {
      this.$refs.selectTree.filter(val);
    },
    test:function(){
      // eslint-disable-next-line no-debugger
      // debugger
      alert(this.$refs.selectTree.getCurrentKey());
    }
  }
};
</script>

<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  padding: 0;
}
.el-select-dropdown__item.selected {
  font-weight: normal;
}
ul li >>> .el-tree .el-tree-node__content {
  height: auto;
}
.el-tree-node__label,
.el-tree-node__content {
  font-weight: normal;
}
.el-tree >>> .is-current .el-tree-node__label {
  color: #409eff;
  font-weight: 700;
}
.el-tree >>> .is-current .el-tree-node__content {
  color: #409eff;
  font-weight: 700;
}
.el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
  color: #606266;
  font-weight: normal;
}
.el-tree >>> .is-current .el-tree-node__children .el-tree-node__content {
  color: #606266;
  font-weight: normal;
}
</style>
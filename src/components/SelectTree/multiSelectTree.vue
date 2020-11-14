<!--
 * @Descripttion: 树形下拉框 多选
 * @version: 1.0
 * @Author: wenchao.chai
 * @LastEditors: wenchao.chai
 * @Date: 2019-04-04 11:09:58
 * @LastEditTime: 2020-04-08 11:12:19
 -->

<template> 
    <el-select ref="selectInput" v-model="valueSelected" multiple :collapse-tags="collapseTags" :placeholder="placeholder" :disabled="disabled"
      :filterable="filterable" :filter-method="filterMethod" @remove-tag="handleRemoveTag">
      <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item.id" hidden></el-option>

      <el-option value label>
        <el-tree ref="selectTree" :data="dataSource" show-checkbox :node-key="props.value" :default-expanded-keys="valueSelected"
          :default-checked-keys="valueSelected" :props="props" :check-on-click-node="checkOnClickNode" :render-content="renderContent"
          :check-strictly="checkStrictly" :expand-on-click-node="expandOnClickNode" :filter-node-method="filterNode"
          @check-change="handleCheckChange">
        </el-tree>
      </el-option>
    </el-select> 
</template>

<script>
import { findTarget } from "@/utils/arrayHelper";
export default {
  name: "MultiSelectTree",
  /**
   * @name: 用于数据绑定v-model对应的prop跟event。默认是value跟input
   */
  model: {
    prop: "valueIds",
    event: "returnBack"
  },
  props: {
    // 默认选中
    // eslint-disable-next-line vue/require-default-prop
    valueIds: null,
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
    collapseTags: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    checkOnClickNode: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    disabled: {//是否禁用
      default: () => {
        return false;
      }
    },
    // eslint-disable-next-line vue/require-default-prop
    renderContent: {
      type: Function,
    },
    checkStrictly: {//true:父子不联动 false:父子联动
      type: Boolean,
      default: () => {
        return false;
      }
    },
    leafOnly: {//是否只是叶子节点，默认值为 false 针对v-model
      type: Boolean,
      default: () => {
        return false;
      }
    },
    includeHalfChecked: {//是否包含半选节点，默认值为 false 针对v-model
      type: Boolean,
      default: () => {
        return false;
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
     * @name: 第一级节点禁用
     * @param {type} 
     * @return: 
     * @other: 
     */
    disableLevel1: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  data() {
    return {
      valueIdNotModel: [],//当不是v-model模式下的valueId
      options: []
    };
  },
  computed: {
    /**
     * @name:  true:v-model模式下
     */
    isVModel: {
      get: function() {
        if(typeof this.valueIds=="undefined") {
          return false;
        } else {
          return true;
        }
      }
    },
    valueSelected: {
      get: function() {
        if(this.isVModel) {
          return this.valueIds;
        } else {
          return this.valueIdNotModel;
        }
      },
      set: function(newVal) {
        if(this.isVModel) {
          this.$emit("returnBack",newVal);
        } else {
          this.valueIdNotModel=newVal;
          this.initHandle(newVal);
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
    },
    /**
     * @name: 绑定的tree 数据源 
     * @param {type} 
     * @return: 
     * @other: 
     */
    dataSource: {
      get: function() {
        if(this.disableLevel1) {
          let dataSourceLevel=this.data;
          dataSourceLevel.forEach(item => {
            item.disabled=true;
          });
          return dataSourceLevel;
        } else {
          return this.data;
        }
      }
    }
  },
  watch: {
    /**
     * @name:  监听defaultCheckedKeys变化
     * @other: 本质是为了同时变化valueSelected。defaultCheckedKeys跟data都是数据绑定的
     *         只有valueSelected需要手动添加监听维护
     */
    valueIds(newVal,oldVal) {
      let newValArr=[];
      let oldValArr=[];
      if(newVal) {
        newValArr=newVal.slice();
      }
      if(oldVal) {
        oldValArr=oldVal.slice();
      }
      if(newValArr.sort().toString()!=oldValArr.sort().toString()) {
        this.$refs.selectTree.setCheckedKeys(newValArr);
        this.initHandle(newValArr);
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
        this.$refs.selectTree.setCheckedKeys(this.valueIds);
        this.initHandle(this.valueIds);
      }
    }
  },
  mounted() {
    this.initHandle(this.valueSelected);
  },
  methods: {
    /**
     * @name: 初始化值 options
     * @param {ids}  
     */
    initHandle(ids) {
      let options=[];
      if(ids&&ids.length>0) {
        let result=[];
        findTarget(
          this.dataSource,
          ids,
          result,
          this.props.value,
          this.props.children
        );
        if(result.length>0) {
          result.forEach(item => {
            options.push({
              id: item[this.props.value],
              label: item[this.props.label]
            });
          });
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
    handleCheckChange: function(data,checked,indeterminate) {
      if(!checked&&this.valueSelected.findIndex(c => c==data[this.props.value])==-1) {
        //说明引起change事件的item不在当前dataSource内，这是由于dataSource(this.data)动态变动引起
        return;
      }
      //tree 没有v-model=valueSelected 所以这里得手工维护valueSelected 
      let ids=[];
      let checkedNode=this.$refs.selectTree.getCheckedNodes(this.leafOnly,this.includeHalfChecked);
      checkedNode.forEach(node => {
        ids.push(node[this.props.value]);
      });
      let valueSelected=this.valueSelected.slice();
      if(valueSelected.sort().toString()==ids.sort().toString()) {
        return;
      }

      this.valueSelected=ids;
      this.$emit('handleCheckChange',{ data,checked,indeterminate,checkedNode });
    },
    /**
     * @name: select tag remove
     */
    handleRemoveTag: function(tag) {
      //这里由于select v-model="valueSelected" 所以无需手动维护valueSelected
      this.$refs.selectTree.setChecked(tag,false,false); // 会触发handleCheckChange
      this.$emit('handleRemoveTag',tag);
    },
    //================================暴露方法================================================
    /**
     * @name: 获取选中的节点数组
     * @param {leafOnly}  是否只获取叶子节点
     * @return: 
     * @other: 
     */
    getCheckedNodes: function(leafOnly=false,includeHalfChecked=false) {
      return this.$refs.selectTree.getCheckedNodes(leafOnly,includeHalfChecked);
    },
    /**
    * @name: 获取选中的节点key数组
    * @param {leafOnly}  是否只获取叶子节点
    * @return: 
    * @other: 
    */
    getCheckedKeys: function(leafOnly=false) {
      return this.$refs.selectTree.getCheckedKeys(leafOnly);
    },
    /**
    * @name: 设置选中的节点
    * @param {nodes}  节点数组
    * @return: 
    * @other: 
    */
    setCheckedNodes: function(nodes) {
      this.$refs.selectTree.setCheckedNodes(nodes);
      let keys=[];
      nodes.forEach(node => {
        keys.push(node[this.props.value]);
      });
      this.initHandle(keys); //虽然setCheckedNodes会触发handleCheckChange，但某些情况不会触发，所以保险起见，需主动设置一把valueSelected
    },
    /**
     * @name: 设置选中的节点
     * @param {nodes}  节点key数组
     * @return: 
     * @other: 
     */
    setCheckedKeys: function(keys,leafOnly=false) {
      this.$refs.selectTree.setCheckedKeys(keys,leafOnly);
      this.initHandle(keys);
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
.el-tree-node__label {
  font-weight: normal;
}
.el-tree >>> .is-current .el-tree-node__label {
  color: #409eff;
  font-weight: 700;
}
.el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
  color: #606266;
  font-weight: normal;
}
</style>
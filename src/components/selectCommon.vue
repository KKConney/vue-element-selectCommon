<template>
  <div class="select-common" :style="{width: parseInt(width) + 'px'}">
    <el-row>
      <div class="select-common-content">
        <div class="select-inner">
          <el-select
                  v-model="selectValue"
                  :filterable="filterable"
                  :clearable="clearable"
                  :multiple="multiple"
                  :multiple-limit="multipleLimit"
                  :disabled="disabled"
                  :placeholder="placeholder"
                  :size="size"
                  @remove-tag="handleRemoveTag"
                  @clear="handleClear"
                  @change="handleSelectChange">
            <el-option v-for="(item, index) in selectOptions" :label="item.name" :key="item.value" :value="item.value"></el-option>
          </el-select>
        </div>
        <el-button ref="selectCommonBtn" type="primary" :size="size" :disabled="disabled || singleDisabled" icon="el-icon-search" @click="handleSelectOpen"></el-button>
      </div>
    </el-row>

    <selectCommonDialog
            ref="selectCommonDialog"
            :dialogData="selectDialogData"
            :tableData="selectCommonData"
            @dialogSelect="handleSelectData"
            @dialogSearch="handleSearchData"></selectCommonDialog>
  </div>
</template>
<script>
  import { buildCommonSelect } from "@/utils/dialog";
  import selectCommonDialog from './selectCommonDialog'
  export default {

    props:{
      title: String,
      disabled: Boolean,
      value: String | Array,
      selectCommonData: Object,
      filterable: Boolean,
      multiple: Boolean,
      size: String,
      placeholder: String,
      width: String,
      multipleLimit: {
        type: Number,
        default: 0 // 默认0则不限制
      },
      clearable: Boolean
    },
    /**
     * v-model双向绑定相当于做了两个操作：
     * （1）给当前这个组件添加了一个value属性
     * （2）给当前这个组件绑定了一个事件(如input事件)
     * 自定义组件使用v-model传来的值，这里用value接收
     */
    model: {
      prop: 'value',
      event: 'change'
    },
    data() {
      return {
        dialogLoading: false,
        singleDisabled: false,

        currentValue: this.value, // 用来重新定义接收value

        // 选择对话框对象
        selectDialogData: {
          selectTitle: this.title,
          isDialogOpen: false,
          isMultiple: this.multiple,
          multipleLimit: this.multipleLimit
        }
      }
    },

    mounted() {

    },

    watch: {
      /**
       * 因为有时候select要赋初始值
       * value还不能直接拿来用，否则异步请求后回来select拿不到值
       * 所以在data中重新定义接收它的变量currentValue
       */
      value(v) {
        this.currentValue = v
      }
    },

    computed: {
      selectValue: {
        get() {
          // 如果是多选
          if (Object.prototype.toString.call(this.currentValue) === "[object Array]" || this.multiple) {
            // 如果有限制多选个数
            if (this.multipleLimit <= 0 || [...new Set(this.currentValue)].length <= this.multipleLimit) {
              // 达到指定个数则禁用，否则启用
              [...new Set(this.currentValue)].length === this.multipleLimit && this.multipleLimit > 0 ? this.singleDisabled = true : this.singleDisabled = false;
              return [...new Set(this.currentValue)];
            }
            // return [...new Set(this.value)];
          }

          // 如果是单选
          else {
            return this.currentValue;
          }
        },

        set(val) {
          this.currentValue = val
        }
      },

      selectOptions() {
        // 转换数组的字段名
        let curArr = buildCommonSelect(this.selectCommonData.options.optionData, this.selectCommonData.options.name, this.selectCommonData.options.value);

        return curArr

      }
    },

    methods: {
      handleSelectChange(val) {
        this.$emit('change', val);
      },

      handleSelectOpen() {
        this.selectDialogData.isDialogOpen = true;
        this.$emit('search');
      },

      handleSearchData() {
        this.$emit('search');
      },

      handleSelectData(row) {
        this.$emit('select', row);
      },

      handleClear() {
        this.$emit('clear');
      },

      handleRemoveTag() {

      }
    },
    components: {
      selectCommonDialog
    }
  }
</script>
<style lang="scss" scoped>
  /deep/ .el-form--label-left {
    .el-form-item__label {
      text-align: right;
    }
  }
  .el-select, .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }

  .select-common {
    position: relative;
    .select-common-content {
      .select-inner {
        margin-right: 40px;
      }
      .el-select {
        >>> .el-input__inner {
          border-radius: 4px 0 0 4px!important;
        }
      }
    }
    >>> .el-select__tags {
      .el-select__input {
        display: none;
      }
    }
    button {
      position: absolute;
      top: 0;
      right: 0;
      width: 40px;
      padding: 12px 0;
      border-radius: 0 4px 4px 0;
      float: right;
      &.el-button--medium {
        top: 50%;
        margin-top: -17px;
        padding: 10px 0;
        font-size: 14px;
      }
      &.el-button--small {
        top: 50%;
        margin-top: -16px;
        padding: 9px 0;
        font-size: 12px;
      }
      &.el-button--mini {
        top: 50%;
        margin-top: -14px;
        padding: 7px 0;
        font-size: 12px;
      }

    }
  }
</style>

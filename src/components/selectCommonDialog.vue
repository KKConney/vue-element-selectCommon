<template>
    <div>
        <el-dialog :title="dialogData.selectTitle" :visible.sync="dialogData.isDialogOpen" append-to-body width="50%" @close="closeDialog">
            <el-form v-if="dialogData.isDialogOpen" :rules="formRules" ref="formData" style="margin-bottom: 10px">
                <el-input @keyup.enter.native="handleSearch" placeholder="请输入内容" v-model="filterValue">
                    <el-select v-model="filterSelect" clearable slot="prepend" placeholder="请选择">
                        <el-option v-for="(item, index) in tableData.filters" :label="item.label" :value="item.value" :index="index"></el-option>
                    </el-select>
                    <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
                </el-input>
            </el-form>
            <el-table
                    @selection-change="handleSelectionChange"
                    @row-dblclick="handleColumnSelect"
                    size="small"
                    v-loading="tableData.loading"
                    stripe
                    :height="selectCommonTableHeight"
                    :data="tableData.tableList"
                    border
                    highlight-current-row style="width: 100%;">
                <el-table-column
                        type="selection"
                        align="center"
                        v-if="dialogData.isMultiple"
                        width="50">
                </el-table-column>
                <el-table-column
                        v-for="(item, index) in tableData.tableColumns"
                        :align="item.align"
                        :label="item.label"
                        :width="item.width"
                        :min-width="item.minWidth"
                        :prop="item.prop"
                        :index="index">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="100px" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="handleColumnSelect(scope.row)">选择</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="overflow: hidden">
                <pagination class="pagination" style="float: right" v-show="tableData.pageQuery.total > 0"
                            :total="tableData.pageQuery.total"
                            :page.sync="tableData.pageQuery.page"
                            :limit.sync="tableData.pageQuery.limit"
                            @pagination="handleSearch" />
            </div>
            <span v-if="dialogData.isMultiple" slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleBtnSelect">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import Pagination from '@/components/Pagination'
  export default {
    props: {
      dialogData: Object,
      tableData: Object
    },
    data() {
      return {
        selectCommonTableHeight: 300,
        dialogLoading: false,
        formLabelWidth: '120px',
        loading: {
          table: true
        },
        formRules: {

        },
        filterSelect: '',
        filterValue: '',
        multipleSelection: []
      }
    },

    mounted() {

    },

    watch: {

    },

    computed: {
      temp: function() {
        return this.dialogData
      }
    },

    methods: {
      clearValidate() {
        this.$refs['formData'].clearValidate()
      },

      handleSearch() {
        this.$emit('dialogSearch');
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      handleBtnSelect() {
        let rows = JSON.parse(JSON.stringify(this.multipleSelection));
        this.handleColumnSelect(rows);
      },

      handleColumnSelect(rows) {
        if (!rows || rows.length === 0 || rows === []) {
          if (this.dialogData.isMultiple) {
            this.$msg.error({
              message: '请至少选择一项!'
            })
          } else {
            this.$msg.error({
              message: '请选择一项!'
            })
          }
        } else if (Object.prototype.toString.call(rows) === "[object Array]") {
          if (rows.length > this.dialogData.multipleLimit && this.dialogData.multipleLimit > 0) {
            this.$msg.error({
              message: '最多只能选' + this.dialogData.multipleLimit + '项！'
            })
          } else {
            rows.forEach(row => {
              this.$emit('dialogSelect', row);
              this.dialogData.isDialogOpen = false
            })
          }
        } else {
          this.$emit('dialogSelect', rows);
          this.dialogData.isDialogOpen = false
        }
      },

      closeDialog() {
        // this.$emit('closeDialog', 'domainDialog', false)

        this.dialogData.isDialogOpen = false
      }
    },

    components: {
      Pagination
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
    /deep/ .el-select .el-input {
        width: 120px;
        .el-input__suffix {
            > .el-input__icon {
                display: none;
            }
        }
    }
    .pagination {
        >>> .el-input__suffix {
            > .el-input__icon {
                display: none;
            }
        }
    }
</style>

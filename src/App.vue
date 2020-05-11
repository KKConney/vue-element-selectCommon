<template>
  <div id="app">
    <selectCommon
            v-model="value"
            title="选择用户"
            filterable
            clearable
            size="medium"
            :selectCommonData="selectCommonData"
            @select="handleSelect"
            @search="handleSearch"></selectCommon>
  </div>
</template>

<script>
import selectCommon from './components/selectCommon.vue'
import userData from './userData'
export default {
  name: 'App',
  data() {
    return {
      value: '',
      users: [],
      selectCommonData: {
        loading: true,
        pageQuery: { // 分页
          limit: 10, // 每页显示条数
          page: 1, // 当前页
          total: 0
        },
        options: { // 下拉框选项
          name: 'username',
          value: 'id',
          optionData: [], // 下拉框选项数据
        },
        tableColumns: [], // 列表字段项及属性
        filters: [], // 查询条件
        tableList: [] // 列表数据
      }
    }
  },
  methods: {
    handleSelect(row) {
      this.selectCommonData.options.optionData.push(row);
      this.value = row.id // 如果是单选
      // this.users.push(row.id) // 如果是多选
    },

    async handleSearch() {
      let tableColumns = [
        { label: "用户ID", width: "100", minWidth: "", align: 'center', prop: "id" },
        { label: "用户名称", width: "100", minWidth: "", align: 'center', prop: "username" },
        { label: "appName", width: "", minWidth: "150", align: 'center', prop: "appName" }
      ]
      let filters = [
        {label:"用户ID", value:1},
        {label:"用户名称", value:2}
      ]
      this.selectCommonData.filters = filters;
      this.selectCommonData.tableColumns = tableColumns;
      await this.handleGetData()
    },

    async handleGetData() {
      this.selectCommonData.loading = true;
      const user = userData; // 将来获取的数据
      if (user.success === true) {
        this.selectCommonData.loading = false;
        this.selectCommonData.tableList = user.data.data;
        this.selectCommonData.pageQuery.limit = user.data.limit;
        this.selectCommonData.pageQuery.page = user.data.page;
        this.selectCommonData.pageQuery.total = user.data.total;
      } else {
        this.selectCommonData.loading = false;
      }
    }
  },
  components: {
    selectCommon
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

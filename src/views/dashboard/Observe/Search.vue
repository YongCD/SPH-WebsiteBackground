<template>
  <el-card>
    <div slot="header" class="header">
      <span>线上热门搜索</span>
      <el-dropdown>
        <span class="el-dropdown-link">
          <i class="el-icon-more"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item>双皮奶</el-dropdown-item>
          <el-dropdown-item>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-row :gutter="30">
      <el-col :span="12">
        <LineChart title="搜索用户数" :num1="12321" :num2="17.1"/>
      </el-col>
      <el-col :span="12">
        <LineChart title="人均搜索次数" :num1="2.7" :num2="26.2"/>
      </el-col>
    </el-row>
    <el-table
      border
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column label="排名" width="80" type="index"></el-table-column>
      <el-table-column
        label="搜索关键字"
        width="width">
      </el-table-column>
      <el-table-column
        label="用户数"
        sortable
        width="width">
      </el-table-column>
      <el-table-column
        label="周涨幅"
        sortable
        width="width">
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: right;"
      :page-size="2"
      :pager-count="7"
      layout="prev, pager, next"
      :total="200"
      small>
    </el-pagination>
  </el-card>
</template>

<script>
import LineChart from './LineChart.vue'
export default {
  name: 'Search',
  components: {
    LineChart
  },
  data() {
    return {
      tableData: [{}]
    }
  },
  methods: {
  }
}
</script>

<style scoped>
  .header {
    display: flex;
    justify-content: space-between;
  }
</style>
<template>
  <div>
    <div class="header">{{ title }}<i class="el-icon-info"></i></div>
    <div class="main">
      <span class="main-title">{{ num1 }}</span>
      <span calss="main-content">{{ num2 }}
        <i v-if="num2 < 20 " class="el-icon-caret-top" style="color: #F56C6C"></i>
        <i v-else class="el-icon-caret-bottom" style="color: #67C23A"></i>
      </span>
    </div>
    <div class="footer">
      <div class="chart" ref="chart"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'LineChart',
  mounted() {
    const lineChart = echarts.init(this.$refs.chart)
    lineChart.setOption({
      xAxis: {
        show: false,
        type: 'category',
        boundaryGap: false,
      },
      yAxis: {
        show: false
      },
      grid: {
        left:0,
        right:0,
        top:0,
        bottom:0
      },
      series: [
        {
          type: 'line',
          data: [12, 5, 22, 11, 9, 24 , 16, 18],
          itemStyle: {
            opacity: 0
          },
          lineStyle: {
            color: 'skyblue',
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                  offset: 0, color: 'skyblue' // 0% 处的颜色
              }, {
                  offset: 1, color: 'white' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            },
            opacity: 0.3
          },
          smooth: true,
        }
      ]
    })
  },
  props: ['title', 'num1', 'num2']
}
</script>

<style scoped>
  .header {
    color: gray;
    font-size: 15px;
  }
  .el-icon-info {
    margin-left: 10px;
  }
  i {
    margin: 0;
  }

  .main {
    margin: 20px 0;
  }
  .main-title {
    margin-right: 25px;
    font-size: 22px;
  }

  .chart {
    width: 100%;
    height: 50px;
  }
</style>
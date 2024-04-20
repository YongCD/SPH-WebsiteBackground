<template>
  <div id="chart" ref="chart"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'BarChart',
  mounted() {
    const chart = echarts.init(this.$refs.chart)
    chart.setOption({
      grid: {
        top:0,
        bottom:0,
        left:0,
        right:0
      },
      xAxis: {
        type: 'category',
        show: false
      },
      yAxis: {
        show: false
      },
      series: [
        {
          type: 'bar',
          data: [12,11,8,15,5,12,22,12,6,10]
        }
      ]
    })
  }
}
</script>

<style scoped>
  #chart {
    width: 100%;
    height: 100%;
  }
</style>
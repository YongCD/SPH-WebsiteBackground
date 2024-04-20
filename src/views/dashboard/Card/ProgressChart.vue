<template>
  <div id="chart" ref="chart"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'ProgressChart',
  mounted() {
    const chart = echarts.init(this.$refs.chart)
    chart.setOption({
      xAxis: {
        max: 100,
        show: false
      },
      yAxis: {
        type: 'category',
        show: false
      },
      grid: {
        top:0,
        bottom:0,
        left:0,
        right:0
      },
      series: [{
        type: 'bar',
        data: [78],
        showBackground: true,
        barMaxWidth: '25%',
        color: 'yellowgreen',
        label: {
          show: true,
          formatter: '|',
          color: 'yellowgreen',
          position: 'outside'
        }
      }]
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
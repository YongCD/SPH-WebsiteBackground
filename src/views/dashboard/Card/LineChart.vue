<template>
  <div id="chart" ref="chart"></div>
</template>

<script>
import * as echarts from 'echarts';
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
          data: [10, 22, 5, 10, 8, 12, 16, 18],
          itemStyle: {
            opacity: 0
          },
          lineStyle: {
            color: 'purple',
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                  offset: 0, color: 'purple' // 0% 处的颜色
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
  }
}
</script>

<style scoped>
  #chart {
    width: 100%;
    height: 100%;
  }
</style>
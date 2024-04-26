<template>
  <el-card>
    <div slot="header" class="header">
      <span>销售额类别占比</span>
      <el-radio-group size="small" v-model="radio">
        <el-radio-button label="全部渠道"></el-radio-button>
        <el-radio-button label="线上"></el-radio-button>
        <el-radio-button label="门店"></el-radio-button>
      </el-radio-group>
    </div>
    <div class="chart" ref="chart"></div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'Category',
  data() {
    return {
      radio: '全部渠道'
    }
  },
  mounted() {
    const chart = echarts.init(this.$refs.chart)
    chart.setOption({
      title: {
        text: '视频广告',
        subtext: '300',
        left: 'center',
        top: '40%',
        textStyle: {fontSize:14, fontWeight: 'normal'},
        subtextStyle: {fontSize: 30, fontWeight: 'normal', color: 'black'}
      },
      tooltip: {
        trigger: 'none'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          padAngle: 3,
          itemStyle: {
            borderRadius: 5
          },
          label: {
            show: true,
            position: 'outside',
            formatter: '{b}:{c}'
          },
          labelLine: {
            show: true
          },
          data: [
            { value: 1048, name: '搜索引擎' },
            { value: 735, name: '直接访问' },
            { value: 580, name: '邮件营销' },
            { value: 484, name: '联盟广告' },
            { value: 300, name: '视频广告' }
          ]
        }
      ]
    })
    chart.on('mouseover', function (params) {
      chart.setOption({
        title: {
          text: params.data.name,
          subtext: params.data.value
        }
      })
    });
  }
}
</script>

<style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .chart {
    width: 100%;
    height: 265px;
  }
</style>
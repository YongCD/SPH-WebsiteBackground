<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <!-- 头部左侧内容 -->
      <el-tabs v-model="activeName" class="tab">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visit"></el-tab-pane>
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="header-right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker
          style="width: 250px"
          v-model="date"
          value-format="yyyy-MM-dd"
          size="mini"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        >
        </el-date-picker>
      </div>
    </div>
    <div>
      <el-row>
        <el-col :span="19">
          <div class="chart" ref="chart"></div>
        </el-col>
        <el-col :span="5">
          <h3>门店{{ title }}排名</h3>
          <ul>
            <li>
              <span class="rindex">1</span>
              <span>肯德基</span>
              <span class="rvalue">323,234</span>
            </li>
            <li>
              <span class="rindex">2</span>
              <span>麦当劳</span>
              <span class="rvalue">299,132</span>
            </li>
            <li>
              <span class="rindex">3</span>
              <span>宁德时代</span>
              <span class="rvalue">283,998</span>
            </li>
            <li>
              <span class="rindex">4</span>
              <span>海底捞</span>
              <span class="rvalue">266,223</span>
            </li>
            <li>
              <span class="rindex">5</span>
              <span>西贝莜面村</span>
              <span class="rvalue">223,445</span>
            </li>
            <li>
              <span class="rindex">6</span>
              <span>汉堡王</span>
              <span class="rvalue">219,663</span>
            </li>
            <li>
              <span class="rindex">7</span>
              <span>真功夫</span>
              <span class="rvalue">200,997</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts'
import {mapState} from 'vuex'
import dayjs from 'dayjs'
export default {
  name: 'Sale',
  mounted() {
    this.chart = echarts.init(this.$refs.chart)
    this.chart.setOption({
      title: {
        text: `销售额趋势`
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: [],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '30%',
          data: []
        }
      ]
    })
  },
  data() {
    return {
      activeName: 'sale',
      chart: null,
      // date收集日期数据
      date: []
    }
  },
  methods: {
    setDay() {
      const day = dayjs().format('YYYY-MM-DD')
      this.date = [day, day]
    },
    setWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [start, end]
    },
    setMonth() {
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [start, end]
    },
    setYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.date = [start, end]
    }
  },
  computed: {
    title() {
      return this.activeName === 'sale' ? '销售额' : '访问量'
    },
    ...mapState('home', {listState: 'data'})
  },
  watch: {
    activeName() {
      this.chart.setOption({
        title: {text: `${this.title}趋势`},
        xAxis: {data: this.title==='销售额' ? this.listState.orderFullYearAxis : this.listState.userFullYearAxis},
        series: {data: this.title==='销售额' ? this.listState.orderFullYear : this.listState.userFullYear}
      })
    },
    listState() {
      this.chart.setOption({
        xAxis: {data: this.listState.orderFullYearAxis},
        series: {data: this.listState.orderFullYear}
      })
    }
  }
}
</script>

<style scoped>
  .box-card {
    margin: 10px 0;
  }

  .clearfix {
    position: relative;
    display: flex;
    justify-content: space-between;
  }

  .tab {
    width: 100%;
  }

  .header-right {
    position: absolute;
    right: 0;
    top: 5px;
  }

  .header-right span {
    margin: 0 10px;
    font-size: 14px;
  }

  .chart {
    width: 100%;
    height: 300px;
  }

  ul {
    list-style: none;
    width: 100%;
    height: 300px;
    padding: 0;
  }

  ul li {
    height: 8%;
    padding: 18px 0;
  }

  .rindex {
    float: left;
    width: 20px;
    height: 20px;
    background-color: black;
    color: white;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    margin-right: 30px;
  }
  .rvalue {
    float: right;
    margin-right: 20px;
  }

  >>>.el-card__header {
    border-bottom: none;
  }

</style>
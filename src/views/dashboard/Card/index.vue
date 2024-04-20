<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <!-- 一 -->
          <Detail title="总销售额" count="￥126560">
            <template v-slot:chart>
              <span>
                周同比 56.67% <i class="el-icon-caret-top" style="color: #F56C6C;"></i>
                日同比 19.16% <i class="el-icon-caret-bottom" style="color: #67C23A;"></i>
              </span>
            </template>
            <template v-slot:footer>
              日销售额￥ 12423
            </template>
          </Detail>
      </el-col>
      <el-col :span="6">
        <!-- 二 -->
          <Detail title="访问量" count="88460">
            <template v-slot:chart>
              <LineChart/>
            </template>
            <template v-slot:footer>
              日访问量 1234
            </template>
          </Detail>
      </el-col>
      <el-col :span="6">
        <!-- 三 -->
          <Detail title="支付笔数" count="88460">
            <template v-slot:chart>
              <BarChart/>
            </template>
            <template v-slot:footer>
              转化率 65%
            </template>
          </Detail>
      </el-col>
      <el-col :span="6">
        <!-- 四 -->
        <Detail title="运营活动效果" count="78%">
          <template v-slot:chart>
            <ProgressChart/>
          </template>
          <template v-slot:footer>
            <span>
              周同比 12% <i class="el-icon-caret-top" style="color: #F56C6C;"></i>
              日同比 11% <i class="el-icon-caret-bottom" style="color: #67C23A;"></i>
            </span>
          </template>
        </Detail>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from './Detail'
// 引入图表组件
import LineChart from './LineChart'
import BarChart from './BarChart'
import ProgressChart from './ProgressChart'
export default {
  name: 'Card',
  components: {
    Detail,
    LineChart,
    BarChart,
    ProgressChart
  }
}
</script>

<style scoped>

</style>
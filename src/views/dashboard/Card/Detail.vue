<template>
    <el-card>
      <div class="card-header">
        <span>{{ title }}</span>
        <i class="el-icon-info"></i>
      </div>
      <div class="card-content">{{ count }}</div>
      <div class="card-chart">
        <slot name="chart"></slot>
      </div>
      <div class="card-footer">
        <slot name="footer"></slot>
      </div>
    </el-card>
</template>

<script>
export default {
  name: 'Detail',
  props: ['title', 'count']
}
</script>

<style>
  .card-header {
    display: flex;
    justify-content: space-between;
    color: #919090;
    font-size: 14px;
  }
  .card-content {
    font-size: 30px;
    padding: 10px 0;
  }
  .card-chart {
    font-size: 14px;
    height: 50px;
    margin-bottom: 10px;
  }
  .card-chart span {
    line-height: 80px;
  }
  i {
    margin-right: 3px;
  }
  .card-footer {
    padding-top: 10px;
    border-top: 1px solid #eee;
  }
</style>
<template>
  <div>
    <el-card class="box-card">
      <!-- 这是个全局组件 三级联动 -->
      <CategorySelector :show="scene===0" @getCategoryId="getCategoryId" @clearList="clearList"/>
    </el-card>

    <el-card>
      <!-- 展示Spu列表的结构 -->
      <div v-show="scene===0">
        <el-button type="primary" icon="el-icon-plus" :disabled="!cForm.category3Id" @click="addSpu">添加SPU</el-button>
        <el-table style="width: 100%;" border :data="spuList" v-loading="loading">
          <el-table-column width="80px" label="序号" type="index" align="center"></el-table-column>
          <el-table-column width="width" label="spu名称" prop="spuName"></el-table-column>
          <el-table-column width="width" label="spu描述" prop="description"></el-table-column>
          <el-table-column width="width" label="操作">
            <template v-slot="{row}">
              <HintButton type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)"></HintButton>
              <HintButton type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)"></HintButton>
              <HintButton type="info" icon="el-icon-info" size="mini" title="查看当前spu的sku列表" @click="showSkuList(row)" :loading="row.isLoading"></HintButton>
              <el-popconfirm :title="`确定要删除${row.spuName}吗？`" @onConfirm="deleteSpu(row.id)">
                <HintButton type="danger" icon="el-icon-delete" size="mini" title="删除spu" slot="reference"></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- 展示sku列表的dialog -->
        <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible">
          <el-table :data="skuList">
            <el-table-column label="名称" prop="skuName" width="width"></el-table-column>
            <el-table-column label="价格" width="width" prop="price"></el-table-column>
            <el-table-column label="重量" width="width" prop="weight"></el-table-column>
            <el-table-column label="默认图片" width="width">
              <template v-slot="{row}">
                <img :src="row.skuDefaultImg" style="width: 100px; height: 100px;">
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>

        <el-pagination
          style="text-align: center; margin-top: 20px;"
          :page-size="limit"
          :page-sizes="[3,5,10]"
          :current-page="page"
          :pager-count="7"
          :total="total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          layout="prev, pager, next, jumper, ->, sizes, total">
        </el-pagination>
      </div>
      <SpuForm v-show="scene===1" @changeScene="changeScene" @getSpuList="updateSpuList" @cancelLoadingStatus="cancelLoadingStatus" ref="spu"/>
      <SkuForm v-show="scene===2" @changeScene="changeScene" @cancelLoadingStatus="cancelLoadingStatus" ref="sku"/>
    </el-card>
  </div>
</template>

<script>
import SpuForm from './SpuForm.vue'
import SkuForm from './SkuForm.vue'
export default {
  name: 'Spu',
  components: {SpuForm, SkuForm},
  data() {
    return {
      cForm: {},
      page: 1,
      limit: 3,
      total: 0,
      scene: 0, //0：展示SPU列表数据  1：添加SPU|修改SPU  2：添加SKU
      spuList: [],
      skuList: [],
      spu: {},
      loading: false,
      dialogTableVisible: false
    }
  },
  methods: {
    // 获取categoryIds，由子组件触发
    async getCategoryId(cForm) {
      this.cForm = cForm
      this.getSpuList()
    },
    // 当分类数据发生变化时，由子组件触发
    clearList() {
      this.cForm = {}
      this.spuList = []
    },
    // 向服务器请求数据
    async getSpuList(page = 1) {
      try {
        this.page = page
        const result = await this.$API.spu.reqSpuList(page, this.limit, this.cForm.category3Id)
        if(result.code === 200) {
          this.spuList = result.data.records
          this.total = result.data.total
        }
      } catch (error) {}
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.getSpuList()
    },
    // 进入添加Spu的页面结构
    addSpu() {
      this.loading = true
      this.$refs.spu.addSpuInfo(this.cForm.category3Id)
    },
    // 进入修改Spu的页面结构
    updateSpu(row) {
      this.loading = true
      this.$refs.spu.initSpuForm(row)
    },
    // 由子组件触发的自定义事件, 改变页面结构
    changeScene(scene) {
      this.scene = scene
    },
    // 取消加载的事件
    cancelLoadingStatus() {
      this.loading = false
    },
    // 修改完某个spu，发送请求获取最新列表
    updateSpuList(flag) {
      if(flag) this.getSpuList(this.page)
      else this.getSpuList()
    },
    // 删除Spu
    async deleteSpu(spuId) {
      try {
        const result = await this.$API.spu.reqDeleteSpu(spuId)
        if(result.code === 200) {
          if(this.spuList.length === 1) this.getSpuList(this.page - 1)
          else this.getSpuList(this.page)
          this.$message({type:'success', message:'删除成功'})
        }
      } catch (error) {}
    },
    // 给某个spu添加sku
    addSku(spu) {
      this.loading = true
      this.$refs.sku.getData(spu, this.cForm)
    },

    async showSkuList(row) {
      this.spu = row
      this.$set(row, 'isLoading', true)
      try {
        const result = await this.$API.spu.reqGetSkuList(row.id)
        if (result.code === 200) this.skuList = result.data
        this.dialogTableVisible = true
        row.isLoading = false
      } catch (error) {}
    }
  }
}
</script>

<style scoped>
  .box-card {
    margin-bottom: 20px;
  }
</style>
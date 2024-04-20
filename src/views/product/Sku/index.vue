<template>
  <div>
    <el-table border stripe style="width: 100%" :data="skuList">
      <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
      <el-table-column label="名称" width="width" prop="skuName"></el-table-column>
      <el-table-column label="描述" width="width" prop="skuDesc"></el-table-column>
      <el-table-column label="默认图片" width="150" align="center">
        <template v-slot="{row}">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px;">
        </template>
      </el-table-column>
      <el-table-column label="重量(KG)" width="width" prop="weight"></el-table-column>
      <el-table-column label="价格(元)" width="80" prop="price"></el-table-column>
      <el-table-column label="操作" width="width">
        <template v-slot="{row}">
          <el-button type="success" icon="el-icon-bottom" size="mini" v-if="row.isSale===1" @click="cancelSale(row)"></el-button>
          <el-button type="info" icon="el-icon-top" size="mini" v-else @click="onSale(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="$message('正在开发中...')"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuDetail(row)"></el-button>
          <el-popconfirm title="确定要删除吗？" @onConfirm="deleteSku(row.id)" style="margin-left: 10px;">
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" ></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :total="total" 
      :current-page="page" 
      :page-size="limit" 
      :page-sizes="[3, 5, 10]"
      :pager-count="7"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="getSkuList"
      @size-change="handleSizeChange">
    </el-pagination>

    <el-drawer
      title="我是标题"
      :visible.sync="drawer"
      :with-header="false"
      size="50%"
    >
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuDetail.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuDetail.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuDetail.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag type="success" class="tag" size="medium" v-for="attr in skuDetail.skuAttrValueList" :key="attr.id">{{ attr.attrId }}:{{ attr.valueId }}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="300px">
            <el-carousel-item v-for="img in skuDetail.skuImageList" :key="img.id">
              <img :src="img.imgUrl" style="height: 300px; display: block; margin: auto;">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      page: 1,
      limit: 10,
      total: undefined,
      drawer: false,
      skuList: [], // 所有的sku数组列表
      skuDetail: {} // 某个sku的详情
    }
  },
  mounted() {
    this.getSkuList()
  },
  methods: {
    // 控制每页显示多少个
    handleSizeChange(limit) {
      this.limit = limit
      this.getSkuList()
    },
    // 获取sku列表数据
    async getSkuList(page = 1) {
      this.page = page
      try {
        const result = await this.$API.sku.reqGetSkuList(page, this.limit)
        if(result.code === 200) {
          this.total = result.data.total
          this.skuList = result.data.records
        }
      } catch (error) {}
    },
    // 上架操作
    async onSale(sku) {
      try {
        const result = await this.$API.sku.reqOnSale(sku.id)
        if(result.code === 200) {
          this.$message({type: 'success', message: '上架成功'})
          sku.isSale = 1
        }
      } catch (error) {}
    },
    // 下架操作
    async cancelSale(sku) {
      try {
        const result = await this.$API.sku.reqCancelSale(sku.id)
        if(result.code === 200) {
          this.$message({message: '下架成功'})
          sku.isSale = 0
        }
      } catch (error) {}
    },
    // 获取Sku详情
    async getSkuDetail(sku) {
      try {
        this.drawer = true
        const result = await this.$API.sku.reqGetSkuDetail(sku.id)
        if(result.code === 200) {
          this.skuDetail = result.data
        }
      } catch (error) {}
    },
    // 删除sku
    async deleteSku(skuId) {
      try {
        const result = await this.$API.sku.reqDeleteSku(skuId)
        if(result.code === 200) {
          this.getSkuList(this.page)
          this.$message({type: 'success', message: '删除成功'})
        }
      } catch (error) {}
    }
  }
}
</script>

<style>
  .el-row .el-col-5 {
    font-size: 18px;
    text-align: right;
    font-weight: bold;
  }

  .el-col {
    margin: 10px 10px;
  }

  .tag {
    margin-right: 5px;
  }

  .el-carousel__button {
    width: 10px;
    height: 10px;
    background-color: red;
    border-radius: 50%;
  }
</style>
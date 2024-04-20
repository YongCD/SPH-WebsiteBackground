<template>
  <div>
    <el-form label-width="80px" :model="skuInfo">
      <el-form-item label="SPU名称">{{ spuName }}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number" v-model.number="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" :rows="4" placeholder="规格描述" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="90px">
          <el-form-item v-for="attr in attrInfoList" :key="attr.id" :label="attr.attrName">
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option v-for="attrValue in attr.attrValueList" :key="attrValue.id" :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="90px">
          <el-form-item v-for="attr in spuSaleAttrList" :key="attr.id" :label="attr.saleAttrName">
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option v-for="attrValue in attr.spuSaleAttrValueList" :key="attrValue.id" :label="attrValue.saleAttrValueName" :value="`${attr.id}:${attrValue.id}`"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table border :data="spuImageList" ref="multipleTable" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="80"></el-table-column>
          <el-table-column label="图片" width="width">
            <template v-slot="{row}">
              <img :src="row.imgUrl" style="width: 100px; height: 100px;">
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName" width="width"></el-table-column>
          <el-table-column label="操作" width="width">
            <template v-slot="{row}">
              <el-button type="primary" size="mini" v-if="row.isDefault === '0'" @click="handleDefault(row)">设为默认</el-button>
              <el-button size="mini" v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save" :loading="isLoading">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      isLoading: false,
      imageList: [],  // 表格复选框相关
      spuName: undefined,
      spuImageList: [],
      spuSaleAttrList: [],
      attrInfoList: [],
      skuInfo: {
        category3Id: undefined,
        price: undefined,
        spuId: undefined,
        tmId: undefined,
        weight: undefined,
        skuName: undefined,
        skuDesc: undefined,
        skuDefaultImg: undefined,
        // 平台属性
        skuAttrValueList: [
          // {
          //   attrId: undefined,
          //   valueId: undefined
          // }
        ],
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: 'string',
          //   imgUrl: 'string',
          //   isDefault: 'string',
          //   skuId: 0,
          //   spuImgId: 0
          // }
        ],
        // 销售属性
        skuSaleAttrValueList: [
          // {
          //   saleAttrId: 0,
          //   saleAttrValueId: 0,
          // }
        ]
      }
    }
  },
  methods: {
    async getData(spu, cForm) {
      const { category1Id, category2Id, category3Id } = cForm
      this.spuName = spu.spuName
      this.skuInfo.category3Id = category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      try {
        const result = await Promise.all([
          this.$API.spu.reqSpuImageList(spu.id), // 0:获取某个spu图片的列表
          this.$API.spu.reqSpuSaleAttrList(spu.id), // 1:获取某个spu的销售属性列表
          this.$API.attr.reqGetAttrInfoList(
            category1Id,
            category2Id,
            category3Id
          ) // 2:获取属性信息列表
        ])
        this.spuImageList = result[0].data.map(item => ({...item, isDefault: '0'}))
        this.spuSaleAttrList = result[1].data
        this.attrInfoList = result[2].data
        this.$emit('changeScene', 2)
        this.$emit('cancelLoadingStatus')
      } catch (error) {
        this.$emit('cancelLoadingStatus')
      }
    },
    // 控制表格复选框相关
    handleSelectionChange(val) {
      this.imageList = val
    },
    handleDefault(row) {
      this.spuImageList.forEach(item => item.isDefault = '0')
      row.isDefault = '1'
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 当用户点击取消时
    cancel() {
      this.$emit('changeScene', 0)
      Object.assign(this._data, this.$options.data())
    },
    // 当用户点击保存时
    async save() {
      this.isLoading = true
      const {attrInfoList, spuSaleAttrList, skuInfo, imageList} = this  //注意解构赋值的skuInfo是浅拷贝，里面的引用类型还是用的原地址，所以可以这么写
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if(item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':')
          prev.push({attrId, valueId})
        }
        return prev
      }, [])
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if(item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':')
          prev.push({saleAttrId, saleAttrValueId})
        }
        return prev
      }, [])
      skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      try {
        const result = await this.$API.spu.reqAddSku(this.skuInfo)
        if(result.code === 200) {
          this.$message({type: 'success', message: '保存成功'})
          this.$emit('changeScene', 0)
        }
        this.isLoading = false
      } catch (error) {this.isLoading = false}
    }
  }
}
</script>

<style>
</style>
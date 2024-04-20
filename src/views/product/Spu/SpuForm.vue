<template>
  <el-form label-width="80px" :model="spuInfo">
    <el-form-item label="SPU名称">
      <el-input placeholder="SPU名称" v-model="spuInfo.spuName"></el-input>
    </el-form-item>
    <el-form-item label="品牌">
      <el-select placeholder="请选择品牌" v-model="spuInfo.tmId">
        <el-option
          v-for="tm in tradeMarkList"
          :key="tm.id"
          :label="tm.tmName"
          :value="tm.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        placeholder="SPU描述"
        rows="4"
        v-model="spuInfo.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload
        action="/dev-api/admin/product/fileUpload"
        list-type="picture-card"
        :file-list="spuImageList"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-select :placeholder="`还有${unSelectSaleAttr.length}个未选择`" v-model="attrIdAndAttrName">
        <el-option v-for="unSelect in unSelectSaleAttr" :key="unSelect.id" :label="unSelect.name" :value="`${unSelect.id}:${unSelect.name}`"></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
      <el-table border style="width: 100%" :data="spuInfo.spuSaleAttrList">
        <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
        <el-table-column label="属性名" width="150px" prop="saleAttrName"></el-table-column>
        <el-table-column label="属性值名称列表" width="width">
          <template v-slot="{row}">
            <el-tag
              :key="tag.id"
              v-for="tag in row.spuSaleAttrValueList"
              closable
              :disable-transitions="false"
              @close="handleClose(row.spuSaleAttrValueList, tag)"
            >
              {{tag.saleAttrValueName}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="row.inputVisible"
              v-model="row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(row)"
              @blur="handleInputConfirm(row)"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template v-slot="{row, $index}">
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="removeSaleAttrOne($index, row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="addOrUpdateSpu" :loading="isLoading" :disabled="isInputVisible">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      isLoading: false,
      // 关于上传图片的对话框
      dialogImageUrl: '',
      dialogVisible: false,
      // 以下是核心数据
      tradeMarkList: [],
      spuImageList: [],
      saleAttrList: [],
      attrIdAndAttrName: undefined, // 收集未选择的销售属性的id
      spuInfo: {
        category3Id: undefined,
        description: undefined,
        tmId: undefined,
        spuImageList: [],
        spuName: undefined,
        spuSaleAttrList: []
      }
    }
  },
  methods: {
    handleSuccess(response, file, fileList) {
      // fileList代表上传成功后的图片列表
      this.spuImageList = fileList
    },
    handleRemove(file, fileList) {
      // fileList代表点击删除后剩下的图片
      this.spuImageList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 用户点击新增spu
    async addSpuInfo(category3Id) {
      this.spuInfo.category3Id = category3Id
      try {
        const result = await Promise.all([
          this.$API.spu.reqTradeMarkList(),   // 0:获取品牌列表
          this.$API.spu.reqBaseSaleAttrList() // 1:获取所有的销售属性
        ])
        this.tradeMarkList = result[0].data
        this.saleAttrList = result[1].data
        this.$emit('changeScene', 1)
        this.$emit('cancelLoadingStatus')
      } catch (error) {this.$emit('cancelLoadingStatus')}
    },
    // 当用户点击修改spu时，开始初始化
    async initSpuForm(row) {
      try {
        const result = await Promise.all([
          this.$API.spu.reqSpuInfo(row.id), // 0:获取spu信息
          this.$API.spu.reqTradeMarkList(), // 1:获取品牌列表
          this.$API.spu.reqSpuImageList(row.id), // 2:获取spu的品牌图标列表
          this.$API.spu.reqBaseSaleAttrList()    // 3:获取所有的销售属性
        ])
        this.spuInfo = result[0].data
        this.tradeMarkList = result[1].data
        this.spuImageList = result[2].data.map(item => ({name:item.imgName, url:item.imgUrl, ...item}))
        this.saleAttrList = result[3].data
        this.$emit('changeScene', 1)
        this.$emit('cancelLoadingStatus')
      } catch (error) {this.$emit('cancelLoadingStatus')}
    },
    
    // 添加销售属性
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':')
      let newAttrList = {baseSaleAttrId, saleAttrName, spuSaleAttrValueList:[]}
      this.spuInfo.spuSaleAttrList.push(newAttrList)
      this.attrIdAndAttrName = undefined
    },
    // 添加销售属性值
    addSaleAttrValue(row) {
      if(row.hasOwnProperty('inputVisible')) {
        row.inputVisible = true
      } else {
        this.$set(row, 'inputVisible', true)
        this.$set(row, 'inputValue', '')
      }
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 失去焦点时确定添加销售属性值
    handleInputConfirm(row) {
      const {inputValue,baseSaleAttrId,saleAttrName} = row
      if(!inputValue.trim()) { // 属性值不能为空
        row.inputVisible = false
        return row.inputValue = ''
      } else { // 属性值不能重复
        const isRepeat = row.spuSaleAttrValueList.some(item => item.saleAttrValueName === inputValue)
        if(isRepeat) return this.$message({type:'error', message:'属性值不能重复'})
      }
      row.spuSaleAttrValueList.push({
        baseSaleAttrId,
        saleAttrName,
        saleAttrValueName: inputValue
      })
      row.inputVisible = false
      row.inputValue = ''
    },
    // 删除销售属性值
    handleClose(spuSaleAttrValueList, tag) {
      spuSaleAttrValueList.splice(spuSaleAttrValueList.indexOf(tag), 1)
    },
    // 删除销售属性
    removeSaleAttrOne(index) {
      this.spuInfo.spuSaleAttrList.splice(index,1)
    },
    // 添加或修改Spu
    async addOrUpdateSpu() {
      this.isLoading = true
      // 在发送请求之前，需要先整理下图片数据
      this.spuInfo.spuImageList = this.spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: (item.response&&item.response.data) || item.url
        }
      })
      try {
        const result = await this.$API.spu.reqAddOrUpdateSpu(this.spuInfo)
        if(result.code === 200) {
          const flag = this.spuInfo.id ? true : false
          this.$emit('getSpuList', flag) //请求数据，刷新页面
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.$emit('changeScene', 0) //改变结构
          Object.assign(this._data, this.$options.data())
        }
        this.isLoading = false
      } catch (error) {this.isLoading = false}
    },
    // 用户点击取消
    cancel() {
      this.$emit('changeScene', 0)
      Object.assign(this._data, this.$options.data())
    }
  },
  computed: {
    // 计算未选择的销售属性的个数
    unSelectSaleAttr() {
      let result = this.saleAttrList.filter(item => {
        return !this.spuInfo.spuSaleAttrList.some(item1 => item1.saleAttrName === item.name)
      })
      return result
    },
    isInputVisible() {
      return this.spuInfo.spuSaleAttrList.some(item => {
        return item.inputVisible
      })
    }
  }
}
</script>

<style scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
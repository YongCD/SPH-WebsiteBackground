<template>
  <div>
    <el-card class="box-card">
      <CategorySelector @getCategoryId="getCategoryId" @clearList="clearList" :show="isShowTable"/>
    </el-card>

    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!Object.keys(cForm).length" @click="addAttr">添加属性</el-button>
        <el-table :data="attrList" style="width: 100%" border>
          <el-table-column label="序号" align="center" type="index" width="80px"></el-table-column>
          <el-table-column label="属性名称" prop="attrName" width="150px"></el-table-column>
          <el-table-column label="属性值列表" width="width">
            <template v-slot="{row}">
              <el-tag class="valueTag" type="success" v-for="attrValue in row.attrValueList" :key="attrValue.id">{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template v-slot="{row}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="modifyAttr(row)"></el-button>
              <el-popconfirm :title="`确定要删除${row.attrName}吗？`" @onConfirm="deleteAttr(row.id)" style="margin-left: 10px;">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <div v-show="!isShowTable">
        <el-form :inline="true" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
        <el-table :data="attrInfo.attrValueList" border style="width: 100%; margin: 20px 0;">
          <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
          <el-table-column label="属性值名称" width="width">
            <template v-slot="{row}">
              <el-input v-model="row.valueName" 
                size="mini" 
                placeholder="请输入属性值名称" 
                @blur="viewMode(row)" 
                @input="row.isRepeat ? row.isRepeat=false : '' "
                @keyup.native.enter="viewMode(row)" 
                ref="editInput"
                v-if="row.flag"
              >
              </el-input>
              <span v-else>{{ row.valueName }}</span>
            </template>
          </el-table-column>  
          <el-table-column label="操作" width="width">
            <template v-slot="{row, $index}">
              <template v-if="!row.flag">
                <el-button type="warning" size="mini" icon="el-icon-edit" @click="editMode(row)"></el-button>
                <el-popconfirm :title="`确定要删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)" style="margin-left: 10px;">
                  <el-button slot="reference" type="danger" size="mini" icon="el-icon-delete"></el-button>
                </el-popconfirm>
              </template>
              <template v-else>
                <el-button type="danger" size="mini" icon="el-icon-circle-close" 
                  circle style="margin-right: 10px;" v-show="row.isRepeat || !row.valueName.trim()"
                  @click="deleteAttrValue($index)"  
                >
                </el-button>
                <el-tag type="danger" size="mini"  icon="el-icon-error" effect="dark" v-show="!row.valueName.trim()">请输入属性值</el-tag>
                <el-tag type="danger" size="mini"  icon="el-icon-error" effect="dark" v-show="row.isRepeat">属性值不能重复</el-tag>
              </template>
          </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="saveAttrInfo" :disabled="existViewMode" :loading="isLoading">保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data() {
    return {
      attrList: [],
      isShowTable: true,
      isRepeat: false,
      isLoading: false,
      cForm: {},
      // 收集新增数据|修改属性使用的
      attrInfo: {
        attrName: '',
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3
      }
    }
  },
  computed: {
    // 计算有没有数据处于编辑模式与表格中是否有数据
    existViewMode() {
      return this.attrInfo.attrValueList.some(item => item.flag) || !this.attrInfo.attrValueList.length
    }
  },
  methods: {
    // 接收子组件传来的三个Id，并发送请求获取属性列表
    async getCategoryId(cForm) {
      this.cForm = cForm
      this.getAttrList()
    },
    async getAttrList() {
      try {
        const {category1Id,category2Id,category3Id} = this.cForm
        const result = await this.$API.attr.reqGetAttrInfoList(category1Id, category2Id, category3Id)
        if(result.code === 200) this.attrList = result.data
      } catch (error) {}
    },
    // 清除属性列表（由子组件触发的自定义事件）
    clearList() {
      this.attrList = [],
      this.cForm = {}
    },
    // 进入查看模式
    viewMode(row) {
      // 如果用户的输入为空，那么不应该变为查看模式
      if(row.valueName.trim() === '') return
      // 如果输入属性值与之前的重复了，也不行
      const isRepeat = this.attrInfo.attrValueList.some(item => {
        if(row !== item) return row.valueName === item.valueName
      })
      if(isRepeat) {
        return this.$set(row, 'isRepeat', true)
      }else {
        this.attrInfo.attrValueList.forEach(item => {
          if(item.isRepeat) {
            const isRepeat = this.attrInfo.attrValueList.some(item2 => {
              if(item !== item2) return item.valueName === item2.valueName
            } )
            if(!isRepeat) {
              item.isRepeat = false
              item.flag = false
            }
          }
        })
      }
      row.flag = false
    },
    // 进入编辑模式
    editMode(row) {
      row.hasOwnProperty('flag') ? row.flag=true : this.$set(row, 'flag', true)
      this.$nextTick(function() {
        this.$refs.editInput.focus()
      })
    },
    // 添加属性
    addAttr() {
      this.attrInfo = {
        attrName: '',
        attrValueList: [],
        categoryId: this.cForm.category3Id,
        categoryLevel: 3
      }
      this.isShowTable = false
    },
    // 修改属性与属性值
    modifyAttr(row) {
      this.attrInfo = cloneDeep(row)
      this.isShowTable = false
    },
    // 添加或修改属性值
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId:this.attrInfo.id,
        valueName: '',
        flag: true   //flag：给每一个属性值添加一个标记，用于切换查看模式和编辑模式
      })
      this.$nextTick(function() {
        this.$refs.editInput.focus()
      })
    },
    // 向服务器发出保存属性请求
    async saveAttrInfo() {
      try {
        this.isLoading = true
        // 我需要过滤属性值为空的和删除服务器不需要的字段
        this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
          if(item.valueName) {
            delete item.flag
            delete item.isRepeat
            return true
          }
        })
        const result = await this.$API.attr.reqAddAttr(this.attrInfo)
        if(result.code === 200) {
          this.getAttrList() // 发请求
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.isShowTable = true
          this.isLoading = false
        }
      } catch (error) {this.isLoading = false}
    },
    // 删除属性
    async deleteAttr(attrId) {
      try {
        const result = await this.$API.attr.reqDeleteAttr(attrId)
        if (result.code === 200) {
          this.getAttrList()
          this.$message({type:'success', message:'删除成功'})
        }
      } catch (error) {}
    },
    // 删除属性值
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    }
  }
}
</script>

<style scoped>
  .box-card {
    margin-bottom: 20px;
  }
  .valueTag {
    margin-left: 10px;
  }
</style>
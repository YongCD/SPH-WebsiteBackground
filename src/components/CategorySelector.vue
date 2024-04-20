<template>
  <div>
    <el-form :inline="true" :model="cForm" :disabled="!show">
      <el-form-item label="一级分类">
        <el-select placeholder="请选择" v-model="cForm.category1Id" @change="handler1">
          <el-option v-for="c1 in list1" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select placeholder="请选择" v-model="cForm.category2Id" @change="handler2">
          <el-option v-for="c2 in list2" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择" v-model="cForm.category3Id" @change="handler3">
          <el-option v-for="c3 in list3" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelector',
  // 组件一挂载，就获取一级分类的数据
  mounted() {
    this.getCategory1List()
  },
  data() {
    return {
      // 分类的数据
      list1: [],
      list2: [],
      list3: [],
      // 收集相应的一级二级三级分类的id
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  props: ['show'],
  methods: {
    // 获取一级分类数据的方法
    async getCategory1List() {
      try {
        const result = await this.$API.attr.reqGetCategory1()
        if(result.code  === 200) this.list1 = result.data
      } catch (error) {}
    },
    
    // 一级分类select的事件回调（当一级分类的option发生变化时获取相应二级分类的数据）
    async handler1() {
      try {
        this.list2 = []
        this.list3 = []
        this.cForm.category2Id = ''
        this.cForm.category3Id = ''
        this.$emit('clearList')
        // 获取二级分类数据
        const {category1Id} = this.cForm
        const result = await this.$API.attr.reqGetCategory2(category1Id)
        if(result.code === 200) this.list2 = result.data
      } catch (error) {}
    },

    // 二级分类select的事件回调
    async handler2() {
      try {
        this.list3 = []
        this.cForm.category3Id = ''
        this.$emit('clearList')
        const {category2Id} = this.cForm
        const result = await this.$API.attr.reqGetCategory3(category2Id)
        if(result.code === 200) this.list3 = result.data
      } catch (error) {}
    },

    // 三级分类select的事件回调（准备发送请求获取数据）
    async handler3() {
      // 给父组件传递三个ID
      const {cForm} = this
      this.$emit('getCategoryId', cForm)
    }
  }

}
</script>

<style>
</style>
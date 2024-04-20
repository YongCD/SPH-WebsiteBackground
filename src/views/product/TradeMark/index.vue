<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showDialog"
      >添加</el-button
    >
    <el-table style="width: 100%; margin-top: 10px" border :data="list">
      <el-table-column
        type="index"
        label="序号"
        width="80px"
        align="center"
      ></el-table-column>
      <el-table-column prop="tmName" label="品牌名称"></el-table-column>
      <el-table-column label="品牌LOGO">
        <template v-slot="{ row }">
          <img :src="row.logoUrl" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :total="total"
      :current-page="page"
      :page-size="limit"
      :pager-count="7"
      :page-sizes="[3, 5, 10]"
      @current-change="getPageList"
      @size-change="handleSizeChange"
      layout="prev, pager, next, jumper, ->, sizes, total"
    >
    </el-pagination>

    <!-- 对话框内嵌form表单 -->
    <el-dialog
      :title="this.tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleFrom">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 文件上传 -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/upload"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false"
          >
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      list: [],
      dialogFormVisible: false,
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'change'
          }
        ],
        logoUrl: [{ required: true, message: '请选择品牌图片' }]
      }
    }
  },
  mounted() {
    this.getPageList()
  },
  methods: {
    async getPageList(pager = 1) {
      this.page = pager
      try {
        const result = await this.$API.trademark.reqTradeMarkList(
          this.page,
          this.limit
        )
        if (result.code === 200) {
          this.total = result.data.total
          this.list = result.data.records
        }
      } catch (error) {}
    },

    // 操作一页显示多少条数据
    handleSizeChange(limit) {
      this.limit = limit
      this.getPageList()
    },
    showDialog() {
      this.tmForm = { tmName: '', logoUrl: '' }
      this.dialogFormVisible = true
    },
    updateTradeMark(row) {
      this.tmForm = { ...row }
      this.dialogFormVisible = true
    },

    // 文件上传成功
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data
    },
    // 上传前的操作
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },

    // 添加或修改品牌
    addOrUpdateTradeMark() {
      this.$refs.ruleFrom.validate(async (valid) => {
        if (valid) {
          try {
            const result = await this.$API.trademark.reqAddOrUpdateTradeMark(
              this.tmForm
            )
            if (result.code === 200) {
              this.$message({
                message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功',
                type: 'success'
              })
            }
            this.dialogFormVisible = false
            this.getPageList(this.page)
          } catch (error) {}
        } else {
          return false
        }
      })
    },

    // 删除品牌操作
    deleteTradeMark(row) {
      const {id, tmName} = row
      this.$confirm(`确定要删除${tmName}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        roundButton: true
      })
        .then(async () => {
          const result = await this.$API.trademark.reqRemoveTradeMark(id)
          if(result.code === 200) {
            this.getPageList(this.list.length > 1 ? this.page: this.page-1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<template>
  <div>
    <!-- 面包屑 -->
    <Crumbs firstMenu="商品管理" secondMenu="添加商品"></Crumbs>
    <!-- 主体 -->
    <el-card shadow="always" :body-style="{ padding: '20px' }" style="margin: 20px 0px">
      <!-- 提示 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"> </el-alert>

      <!-- 步骤条 -->
      <el-steps :active="active - 0" finish-status="success" style="margin: 20px 0px; font-size: 16px" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 表单 -->
      <el-form :model="addForm" ref="addFormRef" :rules="rules" label-width="80px" label-position="top">
        <!-- 左侧标签栏 -->
        <el-tabs tab-position="left" v-model="active" :before-leave="beforeTabLeave" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" size="normal" prop="goods_name">
              <el-input v-model="addForm.goods_name" placeholder="请输入商品名称" size="normal" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品价格" size="normal" prop="goods_price">
              <el-input v-model="addForm.goods_price" placeholder="请输入商品价格(元)" size="normal" clearable type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" size="normal" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" placeholder="请输入商品重量" size="normal" clearable type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" size="normal" prop="goods_number">
              <el-input v-model="addForm.goods_number" placeholder="请输入商品数量" size="normal" clearable type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" size="normal" prop="goods_cat">
              <el-cascader :options="allCategoriesList" :props="cascaderProps" v-model="addForm.goods_cat" clearable @change="handlerChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="params.attr_name" v-for="params in paramsList" :key="params.attr_id" size="normal">
              <el-checkbox-group v-model="params.attr_vals">
                <el-checkbox :label="attr" v-for="(attr, index) in params.attr_vals" :key="attr" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="attr.attr_name" v-for="attr in attrList" :key="attr.attr_id" size="normal">
              <el-input v-model="attr.attr_vals" size="normal" clearable></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload action="http://127.0.0.1:8888/api/private/v1/upload" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="setHeaders" :on-success="handlerSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加按钮 -->
            <el-button type="primary" size="default" style="margin: 20px 0px" @click="addGood">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 缩略图 预览对话框 -->
    <el-dialog :visible.sync="previewVisible" width="50%" @close="previewClose">
      <div>
        <img :src="previewImage" alt="" style="width: 300px" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
export default {
  name: 'addGood',
  data() {
    return {
      // 控制步骤条和左侧标签页的切换
      active: '0',
      // 添加商品表单
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      // 验证规则
      rules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      },
      // 级联选择器配置
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 设置上传图片的请求头
      setHeaders: {
        Authorization: sessionStorage.getItem('token')
      },
      // 缩略图 预览图片地址
      previewImage: '',
      // 显示隐藏缩略图 对话框
      previewVisible: false
    }
  },
  methods: {
    // 获取所有商品数据列表
    getAllCategoriesList() {
      this.$store.dispatch('getAllCategoriesList')
    },
    // 级联选择器节点发生改变时触发
    handlerChange() {
      const { addForm } = this
      if (addForm.goods_cat.length !== 3) {
        addForm.goods_cat = []
      }
      console.log(addForm.goods_cat)
    },
    // 切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    //  tab 被选中时触发  被选中的标签 tab 实例 获取上一个标签拿到的三级分类ID的参数列表
    tabClick() {
      if (this.active === '1') {
        const data = { id: this.addForm.goods_cat[2], sel: 'many' }
        this.$store.dispatch('getParamsList', data)
      } else if (this.active === '2') {
        const data = { id: this.addForm.goods_cat[2], sel: 'only' }
        this.$store.dispatch('getAttrLists', data)
      }
    },
    // 上传的图片移除事件
    handleRemove(file) {
      // 获取到要删除的图片路径
      const filePath = file.response.data.tmp_path
      // 获取到该图片在 表单的索引
      const index = this.addForm.pics.findIndex((item) => item.pic === filePath)
      // 删除图片路径
      this.addForm.pics.splice(index, 1)
    },
    // 图片预览 事件回调
    handlePreview(file) {
      this.previewImage = file.response.data.url
      this.previewVisible = true
    },
    // 图片上传成功 回调
    handlerSuccess(res) {
      const picInfo = { pic: res.data.tmp_path }
      this.addForm.pics.push(picInfo)
    },
    // 缩略图 关闭回调
    previewClose() {
      this.previewImage = ''
    },
    // 添加商品 回调
    addGood() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请填写必填项(*)')
        }
        // 整理参数
        const form = _.cloneDeep(this.addForm) // lodash 深拷贝
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.paramsList.forEach((item) => {
          const paramsInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(paramsInfo)
        })
        // 处理静态属性
        this.attrList.forEach((item) => {
          const attrInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(attrInfo)
        })
        // 赋值给克隆的form
        form.attrs = this.addForm.attrs

        // 发请求 添加商品
        const result = await this.$store.dispatch('addGood', form)
        if (result === 'ok') {
          this.$message.success('添加商品成功')
          this.$router.push('/goods/goods')
        }
      })
    }
  },
  mounted() {
    this.getAllCategoriesList()
  },
  computed: {
    ...mapState({
      allCategoriesList: (state) => state.Goods.allCategoriesList,
      paramsList: (state) => state.Goods.paramsList,
      attrList: (state) => state.Goods.attrList
    })
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-step__title {
  font-size: 14px;
}
/deep/ .el-checkbox {
  margin: 0px 10px 0px 0px;
}
/deep/ .ql-container {
  height: 300px;
}
</style>

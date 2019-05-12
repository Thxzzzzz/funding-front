// TODO 发起众筹
<template>
  <div>
    <y-shelf title="发起众筹">
      <div slot="content">
        <div class="content">
          <div class="steps">
            <el-steps :active="step"
                      align-center>
              <el-step title="产品信息"
                       description=""></el-step>
              <el-step title="套餐信息"
                       description=""></el-step>
              <el-step title="产品详情"
                       description=""></el-step>
              <el-step title="提交审核"
                       description=""></el-step>
            </el-steps>
          </div>
          <!-- 产品信息 -->
          <div class="editZone"
               v-if="step === 1">
            <el-form :model="productForm"
                     ref="productForm"
                     :rules="productFormRule"
                     label-width="80px">
              <el-form-item label="产品名称"
                            prop="name">
                <el-input v-model="productForm.name"
                          class="mediumInput"
                          placeholder="请输入产品名称"></el-input>
              </el-form-item>
              <el-form-item label="产品类型"
                            prop="product_type">
                <el-select v-model="productForm.product_type"
                           class="mediumInput"
                           placeholder="请选择产品类型">
                  <el-option v-for="(item,i) in productTypeList"
                             :key="item.id"
                             :value="item.id"
                             :label="item.name"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="目标金额"
                            prop="target_price">
                <el-input v-model.number="productForm.target_price"
                          type="number"
                          class="mediumInput"
                          placeholder="请输入目标金额"></el-input>
              </el-form-item>
              <el-form-item label="截止日期"
                            prop="end_time">
                <el-date-picker v-model="productForm.end_time"
                                class="mediumInput"
                                type="date"
                                placeholder="选择截止日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="宣传大图">
                <el-upload :action="uploadImgUrl"
                           list-type="picture-card"
                           :limit="1"
                           :on-success="bigImgUploadSuccess"
                           :on-preview="bigImgPreview"
                           :on-remove="bigImgRemove">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="列表小图">
                <el-upload :action="uploadImgUrl"
                           list-type="picture-card"
                           :limit="1"
                           :on-success="smallImgUploadSuccess"
                           :on-preview="smallImgPreview"
                           :on-remove="smallImgRemove">
                  <i class="el-icon-plus"></i>
                </el-upload>

              </el-form-item>
              <el-form-item label="">
                <el-button type="primary"
                           @click="_saveProduct()">保存</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!-- 套餐信息 -->
          <div class="editZone"
               v-else-if="step === 2">
            套餐信息
          </div>
          <!-- 产品详情 -->
          <div class="editZone"
               v-else-if="step === 3">
            产品详情
          </div>
          <!-- 提交审核 -->
          <div class="editZone"
               v-else-if="step === 4">
            提交审核
          </div>
          <div class="stepControl">
            <el-button type="normal"
                       @click="switchStep(step - 1)"
                       :disabled="lastStepDisable">上一步</el-button>
            <el-button type="normal"
                       @click="switchStep(step + 1)"
                       :disabled="nextStepDisable">下一步</el-button>
          </div>
        </div>
      </div>
    </y-shelf>
    <el-dialog :visible.sync="imgPreviewDialogShow">
      <img width="100%"
           :src="imgPreviewUrl"
           alt="">
    </el-dialog>
  </div>
</template>
<script>
  import { productTypeList, saveProduct } from '/api/goods'
  import YShelf from '/components/shelf'
  export default {
    data () {
      return {
        // 上传图片的 API 地址 本来是 http://127.0.0.1:8080/v1/user/uploadImage，但是这里做了转发
        uploadImgUrl: 'http://localhost:9999/user/uploadImage',
        // 步骤
        step: 1,
        // 是否显示图片预览
        imgPreviewDialogShow: false,
        // 图片预览链接
        imgPreviewUrl: '',
        // 产品类型列表
        productTypeList: [],
        // 产品信息 对应数据库  products
        productForm: {
          id: 0,
          name: '', // 产品名称
          big_img: '', // 大图
          small_img: '', // 小图
          // user_id:'' ,// 这个可以后端自己获取当前 user id
          prodcut_type: 99, // 商品类型 需要从后端读到下拉框里
          target_price: 10000, // 目标金额
          end_time: ''// 截止时间
        },
        detail_html: '', // 详情介绍的 html 字符串
        // 产品信息表单校验
        productFormRule: {
          name: [
            { required: true, message: '请输入产品名称', trigger: 'blur' },
            { min: 2, max: 128, message: '长度在 2 到 128个字符', trigger: 'blur' }
          ],
          product_type: [
            { required: true, message: '选择产品类型', trigger: 'blur' }
          ],
          target_price: [
            { required: true, message: '请输入目标金额', trigger: 'blur' },
            { type: 'number', min: 100, max: 100000000, message: '目标金额需要在 100 ~ 100000000 元之间', trigger: 'blur' }
          ],
          end_time: [
            { required: true, message: '选择截止日期', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
        // 禁用上一步的条件
      lastStepDisable () {
        return this.step < 2
      },
        // 禁用下一步的条件
      nextStepDisable () {
        // 保存了才能下一步
        // if (this.step === 1 && this.productForm.id < 1) return true
        return this.step > 3
      }
    },
    methods: {
      messageSuccess (m) {
        this.$message({
          type: 'success',
          message: m
        })
      },
      messageError (m) {
        this.$message.error({
          message: m
        })
      },
      previewImg (imgUrl) {
        this.imgPreviewUrl = imgUrl
        this.imgPreviewDialogShow = true
      },
      bigImgUploadSuccess (response, file, fileList) {
        if (response.code === 200) {
          this.productForm.big_img = response.data
        }
      },
      bigImgRemove (file, fileList) {
        this.productForm.big_img = ''
      },
      bigImgPreview (file) {
        this.previewImg(this.productForm.big_img)
      },
      // 获取产品类型列表
      _getProductTypeList () {
        productTypeList().then(res => {
          if (res.code === 200) {
            this.productTypeList = res.data
          } else {
            this.messageError(res.message + '获取产品类型列表失败，请刷新重试')
          }
        })
      },
      validForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            return true
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 保存产品信息
      _saveProduct () {
        if (!this.validForm('productForm')) return
        saveProduct({params: this.productForm}).then(res => {
          if (res.code === 200) {
            this.productForm = res.data
            this.messageSuccess('产品信息保存成功')
          } else {
            this.messageError(res.message)
          }
        })
      },
      switchStep (step) {
        console.log(step)
        this.step = step
      }
    },
    created () {
      // 获取产品类型列表
      this._getProductTypeList()
        // 获取 url 中的参数，存在的话就查询数据库（编辑模式）不存在则是新发起众筹
    },
    components: {
      YShelf
    }
  }
</script>
<style lang="scss" scoped>
  .mediumInput {
    width:300px;
  }
  .content {
      margin: 12px;
  }
  .editZone {
      margin:15px;
  }
  .stepControl {
    padding: 10px 10px;
    text-align: center;
  }
  .support {
    line-height: 2em;
    font-size: 22px;
    color: #999;
  }
</style>

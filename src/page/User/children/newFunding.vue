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
              <el-step title="产品详情"
                       description=""></el-step>
              <el-step title="套餐信息"
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
                  <el-option v-for="(item) in productTypeList"
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
              <el-form-item label="宣传大图"
                            prop="big_img">
                <img :src="productForm.big_img"
                     alt=""
                     style="max-height:300px;">
                <el-upload :action="uploadImgUrl"
                           :limit="1"
                           style="width:300px;"
                           :on-success="bigImgUploadSuccess"
                           :on-preview="bigImgPreview"
                           :on-remove="bigImgRemove">
                  <el-button size="small"
                             type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="列表小图"
                            prop="small_img">
                <img :src="productForm.small_img"
                     alt=""
                     style="max-height:300px;">
                <el-upload :action="uploadImgUrl"
                           :limit="1"
                           style="width:300px;"
                           :on-success="smallImgUploadSuccess"
                           :on-preview="smallImgPreview"
                           :on-remove="smallImgRemove">
                  <el-button size="small"
                             type="primary">点击上传</el-button>
                </el-upload>

              </el-form-item>
              <el-form-item label="">
                <el-button type="primary"
                           @click="_saveProduct(productForm)">保存</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!-- 产品详情 -->
          <div class="editZone"
               v-else-if="step === 2">
            <editor :catchData="catchDetailHtml"></editor>
            <el-button v-on:click="showDetail_html">预览</el-button>

            <div class="detail_htmlPreview">
              <div v-html="detail_html">{{ detail_html }}</div>
            </div>
          </div>
          <!-- 套餐信息 -->
          <div class="editZone"
               v-else-if="step === 3">
            套餐信息
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
import { productTypeList, saveProduct, productById, pkgListByProductId } from '/api/goods'
import { uploadImage } from '/api/index'
import Editor from '/components/Editor'
import YShelf from '/components/shelf'
export default {
  components: {
    YShelf, Editor
  },
  data () {
    return {
        // 上传图片的 API 地址 本来是 http://127.0.0.1:8080/v1/user/uploadImage，但是这里做了转发
      uploadImgUrl: 'http://localhost:9999/user/uploadImage',
        // 步骤
      step: 1,
        // 是否显示图片预览
      imgPreviewDialogShow: false,
        // 详情预览是否显示
      showHtmlPreview: false,
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
        product_type: '', // 商品类型 需要从后端读到下拉框里
        target_price: 10000, // 目标金额
        end_time: '' // 截止时间
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
        ],
        big_img: [
            { required: true, message: '请上传宣传大图', trigger: 'blur' }
        ],
        small_img: [
            { required: true, message: '请上传列表小图', trigger: 'blur' }
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
      if (this.step === 1 && this.productForm.id < 1) {
        return true
        // this._saveProduct(this.productForm)
      }
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
      // 上传文件
    _uploadFile (urlReceiver, file) {
      let params = new FormData()
        // 通过append向form对象添加数据
      params.append('file', file)
      uploadImage(params).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },
      // 大图
    bigImgUploadSuccess (response, file, fileList) {
      if (response.code === 200) {
        this.productForm.big_img = response.data
      }
    },
      // 大图
    bigImgRemove (file, fileList) {
      this.productForm.big_img = ''
    },
      // 大图
    bigImgPreview (file) {
      this.previewImg(this.productForm.big_img)
    },
      // 小图
    smallImgUploadSuccess (response, file, fileList) {
      if (response.code === 200) {
        this.productForm.small_img = response.data
      }
    },
      // 小图
    smallImgRemove (file, fileList) {
      this.productForm.small_img = ''
    },
      // 小图
    smallImgPreview (file) {
      this.previewImg(this.productForm.small_img)
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
      let result = false
      this.$refs[formName].validate((valid) => {
        if (valid) {
          result = true
        } else {
          console.log('error submit!!')
          result = false
        }
      })
      return result
    },
      // 保存产品信息
    _saveProduct (params) {
      let valid = this.validForm('productForm')
      if (!valid) return
      saveProduct(params).then(res => {
        if (res.code === 200) {
          this.productForm.id = res.data.id
          this.messageSuccess('产品信息保存成功')
        } else {
          this.messageError(res.message)
        }
      })
    },
    // 保存产品详情信息
    _saveProductDetailHtml () {
      let params = { id: this.productForm.id, detail_html: this.detail_html }
      this._saveProduct(params)
    },
    // 从文本编辑器更新 detail_html
    catchDetailHtml (html) {
      this.detail_html = html
    },
    showDetail_html () {
      this.showHtmlPreview = true
      // alert(this.detail_html)
    },
    // 获取产品信息
    _getProductInfo (productId) {
      productById({params: {id: productId}}).then(res => {
        if (res.code === 200) {
          let data = res.data
          this.productForm.id = data.id
          this.productForm.name = data.name
          this.productForm.big_img = data.big_img
          this.productForm.small_img = data.small_img
          this.productForm.product_type = data.product_type
          this.productForm.target_price = data.target_price
          this.productForm.end_time = data.end_time
          this.detail_html = data.detail_html
          this.messageSuccess('产品信息获取成功')
        } else {
          this.messageError('产品信息获取失败' + res.message)
        }
      })
    },
    // 获取套餐信息
    _pkgListByProductId (productId) {
      pkgListByProductId({params: {id: productId}}).then(res => {
        if (res.code === 200) {
          let data = res.data
          this.product_packages = data
          this.messageSuccess('产品套餐信息获取成功')
        } else {
          this.messageError('产品套餐信息获取失败' + res.message)
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
    let productId = this.$route.query.productId
    console.log(productId)
    if (productId) {
      this._getProductInfo(productId)
      this._pkgListByProductId(productId)
    }
    let step = this.$route.query.step
    if (step) {
      this.step = step
    }
  }
}
</script>
<style lang="scss" scoped>
  .detail_htmlPreview{
    width: 80%;
    border: 1;
    border-color: gray;
    margin: 10px
  }
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

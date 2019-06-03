// TODO 发起众筹
<template>
  <div>
    <y-shelf :title="title">
      <div slot="content">
        <div class="content">
          <div class="steps">
            <el-steps :active="step"
                      align-center>
              <el-step title="产品信息"></el-step>
              <el-step title="产品详情"></el-step>
              <el-step title="套餐信息"></el-step>
              <el-step title="提交审核"></el-step>
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
                <el-button type="success"
                           @click="_saveProductInfo(productForm)">保存</el-button>
                <span style="margin:0 10px;">新发起的众筹保存后才能进入下一步</span>
              </el-form-item>
            </el-form>
          </div>

          <!-- 产品详情 -->
          <div class="editZone"
               v-if="step === 2">
            <editor class="editor"
                    :initContent="detail_html"
                    v-model="detail_html"></editor>
            <!-- <el-button v-on:click="showDetail_html">预览</el-button> -->
            <p style="margin:50px 0px 0px 40px;font-size:18px;">效果预览：</p>
            <div class="detail_htmlPreview">
              <div v-html="detail_html">{{ detail_html }}</div>
            </div>
            <el-button style="margin:10px 0px 0px 40px;"
                       type="success"
                       @click="_saveProductDetailHtml()">保存</el-button>
          </div>

          <!-- 套餐信息 -->
          <div class="editZone"
               v-if="step === 3">
            <!-- 套餐信息-->
            <div style="width:100%;margin:0px auto">
              <div v-for="(item,key) in product_packages"
                   :key="key"
                   class="info-card">
                <y-shelf :title="'￥'+item.price">
                  <div slot="right">
                    <span style="font-size:16px; color:gray;">{{item.backers}} 位支持者</span>
                  </div>
                  <div slot="content"
                       class="info-des"
                       style="padding:25px">
                    <div class="left-label"
                         style="font-size:15px; 
                 font-weight:bold;">
                      <span>限额{{item.total}}份</span>
                      <span>&nbsp;|&nbsp;剩余{{item.stock}}份</span>
                    </div>
                    <div style="clear:both;text-align:left">{{item.description}}</div>
                    <div>
                      <img :src="item.image_url"
                           alt="图片"
                           style="width:70px;height:70px;margin:15px 0px;float:left;">
                    </div>
                    <div style="clear:both;text-align:left">
                      <span>配送费用：</span>
                      <span v-if="item.freight != 0">{{item.freight}}</span>
                      <span v-else
                            style="font-weight:bold;">免运费</span>
                    </div>
                    <div style="clear:both;text-align:left">
                      <span>预计回报发送时间：</span>
                      <span style="font-weight:bold;">
                        <span>项目众筹成功后</span>
                        <span style="color:red;">{{item.delivery_day}}</span>
                        <span>天内</span>
                      </span>
                    </div>
                    <div align="left"
                         style="clear:both;">
                    </div>
                    <el-button style="margin-top:10px"
                               type="normal"
                               @click="editOldPkg(item)">编辑</el-button>
                  </div>
                </y-shelf>
              </div>
            </div>
            <el-button @click="newPkg()"
                       type="primary"
                       class="submitButto"> 新增套餐 </el-button>

            <!-- 新增套餐对话框 -->
            <el-dialog title="新增套餐"
                       :visible.sync="editPkgDialogShow">
              <el-form :model="editPkgForm"
                       :rules="editPkgFormRule"
                       ref="editPkgForm"
                       label-width="80px">
                <el-form-item label="套餐描述"
                              prop="description">
                  <el-input v-model="editPkgForm.description"
                            placeholder="请输入套餐描述"></el-input>
                </el-form-item>
                <el-form-item label="套餐价格"
                              prop="price">
                  <el-input v-model.number="editPkgForm.price"
                            placeholder="请输入套餐价格"
                            type="number"></el-input>
                </el-form-item>
                <el-form-item label="套餐总数"
                              prop="total">
                  <el-input v-model.number="editPkgForm.total"
                            placeholder="请输入套餐总数"
                            type="number"></el-input>
                </el-form-item>
                <el-form-item label="套餐运费"
                              prop="freight">
                  <el-input v-model.number="editPkgForm.freight"
                            placeholder="请输入套餐运费"
                            type="number"></el-input>
                </el-form-item>
                <el-form-item label="发货时间"
                              prop="freight">
                  <el-input v-model.number="editPkgForm.delivery_day"
                            placeholder="请输入发货时间（众筹成功后多少天内）"
                            type="number"></el-input>
                </el-form-item>
                <el-form-item label="套餐图片"
                              prop="image_url">
                  <img :src="editPkgForm.image_url"
                       alt=""
                       style="max-height:100px;" />

                  <el-upload :action="uploadImgUrl"
                             ref="pkgImgUpload"
                             :limit="1"
                             style="width:300px;"
                             :on-success="pkgImgUploadSuccess"
                             :on-preview="pkgImgPreview"
                             :on-remove="pkgImgRemove">
                    <el-button size="small"
                               type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
                <el-form-item>
                  <el-button @click="_saveProductPkg(editPkgForm)"
                             type="success">保存</el-button>
                </el-form-item>

              </el-form>
            </el-dialog>

          </div>

          <!-- 提交审核 -->
          <div class="editZone"
               v-if="step === 4">
            <h1 style="font-size:20px;">当前审核状态:</h1>
            <p style="font-size:40px; margin:10px auto;text-align:center;color:black">{{verifyStatusStr}}</p>
            <!-- 失败原因： -->
            <p v-if="verify_status===4"
               style="font-size:24px; margin:10px auto;text-align:center;color:black;width:500px">{{verify_message}} 请修改后重新提交审核</p>

          </div>

          <div class="stepControl">
            <el-button type="normal"
                       @click="switchStep(step - 1)"
                       :disabled="lastStepDisable">上一步</el-button>
            <el-button type="normal"
                       @click="switchStep(step + 1)"
                       v-if="(step !== 4)"
                       :disabled="nextStepDisable">下一步</el-button>
            <el-button v-if="(step === 4)"
                       :disabled="!neetSubmitVerify"
                       @click="_submitProductVerify()"
                       style="margin:0 auto;text-align:center"
                       type="success">提交审核</el-button>
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
import { productTypeList, saveProduct, productById, pkgListByProductId, saveProductPackage } from '/api/goods'
import { uploadImage } from '/api/index'
import Editor from '/components/Editor'
import YShelf from '/components/shelf'
export default {
  components: {
    YShelf, Editor
  },
  data () {
    return {
      title: '发起众筹',
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
      verify_status: 3, // 验证状态 1：已通过 2：待审核 3: 待提交 4: 未通过
      verify_message: '', // 审核信息
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
            { type: 'number', min: 10000, max: 100000000, message: '目标金额需要在 10000 ~ 100000000 元之间', trigger: 'blur' }
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
      },

      // 套餐相关
      product_packages: [],
      // 新增/编辑 套餐对话框 表单
      editPkgForm: {
        id: 0,
        product_id: 0,
        description: '',
        image_url: '',
        price: '',
        stock: 0,
        total: 0,
        freight: 0,
        delivery_day: ''
      },
      editPkgFormRule: {
        description: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { min: 2, max: 128, message: '长度在 2 到 128个字符', trigger: 'blur' }
        ],
        price: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { type: 'number', min: 1, max: 100000000, message: '目标金额需要在 1 ~ 100000000 元之间', trigger: 'blur' }
        ],
        total: [
             { required: true, message: '不能为空', trigger: 'blur' },
            { type: 'number', min: 1, message: '目标库存需要大于 1', trigger: 'blur' }
        ],
        image_url: [
            { required: true, message: '请上传宣传套餐图片', trigger: 'blur' }
        ]

      },
      // 是否显示编辑套餐对话框
      editPkgDialogShow: false
    }
  },
  computed: {
    verifyStatusStr () {
      // 1：已通过 2：待审核 3: 待提交 4: 未通过
      if (this.verify_status === 0 || this.verify_status === 3) {
        return '待提交审核'
      } else if (this.verify_status === 1) {
        return '审核通过！'
      } else if (this.verify_status === 2) {
        return '待审核'
      } else if (this.verify_status === 4) {
        return '审核失败！'
      }
      return '待提交审核'
    },
    neetSubmitVerify () {
      // 1：已通过 2：待审核 3: 待提交 4: 未通过
      if (this.verify_status === 0 || this.verify_status === 3) {
        return true
      } else if (this.verify_status === 1) {
        return false
      } else if (this.verify_status === 2) {
        return false
      } else if (this.verify_status === 4) {
        return true
      }
      return false
    },
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
      // 上传文件 现在还用不到这个方法(文本编辑器里用到了)，现在是用的 element-ui 自带的上传控件上传的
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
      this.productForm.big_img = response.data
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
      this.productForm.small_img = response.data
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
      saveProduct(params).then(res => {
        if (res.code === 200) {
          this.productForm.id = res.data.id
          this._getProductInfo(res.data.id)
          this.messageSuccess('产品信息保存成功')
        } else {
          this.messageError(res.message)
        }
      })
    },
    // 保存产品基本信息（详情除外）
    _saveProductInfo (params) {
      let valid = this.validForm('productForm')
      if (!valid) return
      this._saveProduct(params)
    },
    // 保存产品详情信息
    _saveProductDetailHtml () {
      let params = { id: this.productForm.id, detail_html: this.detail_html }
      this._saveProduct(params)
    },
    // 提交审核
    _submitProductVerify () {
      // 1：已通过 2：待审核 3: 待提交 4: 未通过
      let params = { id: this.productForm.id, verify_status: 2 }
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
          this.verify_status = data.verify_status
          this.verify_message = data.verify_message
          this.messageSuccess('产品信息获取成功')
        } else {
          this.messageError('产品信息获取失败' + res.message)
        }
      })
    },
    // 套餐相关
     // 套餐图
    pkgImgUploadSuccess (response, file, fileList) {
      this.editPkgForm.image_url = response.data
      this.$refs.pkgImgUpload.clearFiles()
    },
      // 套餐图
    pkgImgRemove (file, fileList) {
      this.editPkgForm.image_url = ''
    },
      // 套餐图
    pkgImgPreview (file) {
      this.previewImg(this.editPkgForm.image_url)
    },
    // 修改旧套餐
    editOldPkg (item) {
      this.editPkgForm = {
        id: item.id,
        product_id: item.product_id,
        description: item.description,
        image_url: item.image_url,
        price: item.price,
        stock: item.stock,
        total: item.total,
        freight: item.freight,
        delivery_day: item.delivery_day
      }
      this.showEditPkgDialog()
    },
    // 新增套餐
    newPkg () {
      this.editPkgForm = {
        id: 0,
        product_id: 0,
        description: '',
        image_url: '',
        price: '',
        stock: 0,
        total: 0,
        freight: 0,
        delivery_day: ''
      }
      this.showEditPkgDialog()
    },
    showEditPkgDialog () {
      this.editPkgDialogShow = true
      // this.$refs.pkgImgUpload.clearFiles()
    },
    // 保存套餐信息
    _saveProductPkg (params) {
      let valid = this.validForm('editPkgForm')
      if (!valid) return
      params.product_id = this.productForm.id
      // if (!params.backers) {
      //   params.backers = params.total
      // }
      saveProductPackage(params).then(res => {
        if (res.code === 200) {
          this._pkgListByProductId(this.productForm.id)
          this.editPkgDialogShow = false
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
      // console.log(step)
      this.step = step
      this.$router.push({path: '/user/newFunding', query: {productId: this.productForm.id, step: this.step}})
    }
  },
  created () {
      // 获取产品类型列表
    this._getProductTypeList()
      // 获取 url 中的参数，存在的话就查询数据库（编辑模式）不存在则是新发起众筹
    let productId = this.$route.query.productId
    console.log(productId)
    if (productId) {
      this.title = '编辑众筹'
      this._getProductInfo(productId)
      this._pkgListByProductId(productId)
    }
    let step = this.$route.query.step
    if (step) {
      this.step = Number(step)
    }
  }
}
</script>
<style lang="scss" scoped>
  .submitButto{
    margin: 10px 0px 10px 20px
  }
  .editor{
    margin-left: auto;
    margin-right: auto;
    width: 850px;
  }
  .detail_htmlPreview{
    margin-left: auto;
    margin-right: auto;
    width: 838.2px;
    border-radius: 15px;
    border-style: solid; 
    border-width: 5px;
    border-color:lightgray;
    padding: 10px;
    margin-top: 15px;
    margin-bottom: 30px;
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
  .info-card{
    width:100%;
    .gray-box {
      padding: 0;
      display: block;
    }
    .left-label {
      text-align: left;
      float: left;
      height: 30px;
      font-size: 20px;
      margin: 0 0 10px;
    }

    .right-label {
      text-align: right;
      float: right;
      height: 30px;
      font-size: 20px;
      margin: 0 0 10px;
    }
    .info-des span{
      margin: 10px 0px
    }
  }
</style>

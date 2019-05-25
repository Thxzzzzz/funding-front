// TODO 资质认证  营业执照之类的认证和查看
<template>
  <div>
    <y-shelf title="资质认证">
      <div slot="content">
        <div style="margin:20px">
          <span class="support">资质认证:</span>
          <span class="support">{{verifyStatusStr(seller_license.verify_status)}}</span>
          <div class="message"
               v-if="seller_license.verify_status === 4">
            原因：{{seller_license.verify_message}} 请修改后重新提交审核
          </div>
          <!-- 上传执照相关 -->
          <div>
            <div class="editButton"
                 v-if="!seller_license.id">
              <el-button type="primary"
                         @click="licenseDialogShow = true">申请成为商家</el-button>

            </div>

            <!-- 上传执照信息对话框 -->
            <el-dialog title="营业执照信息"
                       :visible.sync="licenseDialogShow">
              <el-form :model="licenseForm"
                       :rules="licenseFormRule"
                       ref="licenseForm"
                       label-width="120px">
                <el-form-item label="公司名称"
                              prop="company_name">
                  <el-input v-model="licenseForm.company_name"
                            placeholder="请输入公司名称"></el-input>
                </el-form-item>

                <el-form-item label="公司简介"
                              prop="description">
                  <el-input v-model="licenseForm.description"
                            placeholder="请输入公司简介"></el-input>
                </el-form-item>

                <el-form-item label="联系地址"
                              prop="address">
                  <el-input v-model="licenseForm.address"
                            placeholder="请输入公司联系地址"></el-input>
                </el-form-item>

                <el-form-item label="联系电话"
                              prop="phone">
                  <el-input v-model="licenseForm.phone"
                            placeholder="请输入公司联系电话"></el-input>
                </el-form-item>

                <el-form-item label="营业执照图片"
                              prop="license_image_url">
                  <!-- <el-input v-model="licenseForm.license_image_url"
                            v-show="false"></el-input> -->

                  <el-image :src="licenseForm.license_image_url"
                            style="height:100px;width:80px;"
                            fit="scale-down"
                            @click.native="showLiceseImage(licenseForm.license_image_url)">
                    <div slot="error"
                         class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                  <el-upload :action="uploadImgUrl"
                             :limit="1"
                             style="width:300px;"
                             :on-success="licenseImgUploadSuccess"
                             :on-preview="licenseImgPreview"
                             :on-remove="licenseImgRemove">
                    <el-button size="small"
                               type="primary">点击上传</el-button>
                  </el-upload>
                </el-form-item>
                <el-form-item>
                  <el-button @click="submitLicenseForm(licenseForm)"
                             type="success">保存</el-button>
                </el-form-item>

              </el-form>
            </el-dialog>

          </div>
          <div v-if="seller_license.id"
               class="sellerInfo-text">
            <el-card>
              <div>
                <p>
                  公司名称: {{seller_license.company_name}}
                </p>
                <p>
                  公司简介: {{seller_license.description}}
                </p>
                <p>
                  联系地址: {{seller_license.address}}
                </p>
                <p>
                  官方电话: {{seller_license.phone}}
                </p>
                <p>
                  营业执照: <img :src="seller_license.license_image_url"
                       style="height:100px;"
                       @click="showLiceseImage(seller_license.license_image_url)" />
                </p>
              </div>
            </el-card>
          </div>

          <div class="editButton">
            <span class="editButton"
                  v-if="seller_license.id && (seller_license.verify_status !== 1)">
              <el-button type="primary"
                         @click="editLicenseInfo()">编辑执照信息</el-button>
            </span>

            <span class="submit"
                  v-if="seller_license.verify_status === 3 || seller_license.verify_status === 4">
              <el-button type="success"
                         @click="submitVerify()"> 提交审核 </el-button>
            </span>
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
  import YShelf from '/components/shelf'
  import { getLicenseByUserId, saveLicense } from '/api/index'
  import { mapState } from 'vuex'

  export default {
    components: {
      YShelf
    },
    data () {
      return {
        // 显示执照信息上传对话框
        licenseDialogShow: false,
        // 上传图片的 API 地址 本来是 http://127.0.0.1:8080/v1/user/uploadImage，但是这里做了转发
        uploadImgUrl: 'http://localhost:9999/user/uploadImage',
        seller_license: {},
        imgPreviewDialogShow: false,
        imgPreviewUrl: '',
        licenseForm: {company_name: '', description: '', address: '', phone: '', license_image_url: ''},
        licenseFormRule: {
          company_name: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { min: 2, max: 128, message: '长度在 2 到 128个字符', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { min: 2, max: 128, message: '长度在 2 到 128个字符', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { min: 2, max: 128, message: '长度在 2 到 128个字符', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { min: 11, max: 11, message: '请输入11位数联系方式（座机要加区号）', trigger: 'blur' }
          ],
          license_image_url: [
            { required: true, message: '请上传营业执照图片', trigger: 'blur, change' }
          ]

        }
      }
    },
    computed: {
      ...mapState(['userInfo'])
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
      verifyStatusStr (verify_status) {
      // 1：已通过 2：待审核 3: 待提交 4: 未通过
        if (verify_status === 0 || verify_status === 3) {
          return '待提交审核'
        } else if (verify_status === 1) {
          return '审核通过！'
        } else if (verify_status === 2) {
          return '待审核'
        } else if (verify_status === 4) {
          return '审核失败！'
        }
        return '您还没有申请认证成为商家'
      },
        // 执照图
      licenseImgUploadSuccess (response, file, fileList) {
        this.licenseForm.license_image_url = response.data
      },
      // 执照图
      licenseImgRemove (file, fileList) {
        this.licenseForm.license_image_url = ''
      },
      // 执照图
      licenseImgPreview (file) {
        this.showLiceseImage(this.licenseForm.license_image_url)
      },
      // 获取执照信息
      _getLicenseByUserId (seller_id) {
        getLicenseByUserId({params: {user_id: seller_id}}).then(res => {
          if (res.code === 200) {
            this.seller_license = res.data
          }
        })
      },
      editLicenseInfo () {
        this.licenseDialogShow = true
        this.licenseForm = this.seller_license
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
      submitVerify () {
        let params = {
          id: this.seller_license.id,
          verify_status: 2
        }
        this._saveLisense(params)
      },
      submitLicenseForm (licenseForm) {
        let valid = this.validForm('licenseForm')
        if (!valid) return
        let params = this.licenseForm
        this._saveLisense(params)
      },
      _saveLisense (params) {
        saveLicense(params).then(res => {
          if (res.code === 200) {
            this.seller_license = res.data
            this.messageSuccess('保存成功')
            this.licenseDialogShow = false
            this._getLicenseByUserId(this.userInfo.info.id)
          } else {
            this.messageSuccess('保存出错' + res.message)
          }
        }).catch(error => {
          this.messageSuccess('保存出错' + error)
        })
      },
      showLiceseImage (img_url) {
        this.imgPreviewUrl = img_url
        this.imgPreviewDialogShow = true
      }
    },
    created () {
      this._getLicenseByUserId(this.userInfo.info.id)
    }
  }
</script>
<style lang="scss" scoped>
.editButton{
   margin:20px;
}
  .submit{
    margin:20px;
    margin-left: 100px;
  }
  .message{
    font-size:24px;
    font-weight: bold;
    color: black;
    margin: 10px;
  }
  .support {
    line-height: 2em;
    font-size: 22px;
    color: #999;
  }
    .sellerInfo-text{
    p {
      font-size: 20px;
      margin-left: 20px;
      margin-bottom: 6px;
    }
  }

</style>

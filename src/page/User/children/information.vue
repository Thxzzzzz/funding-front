<template>
  <div>
    <y-shelf title="账户资料">
      <div slot="content">
        <el-tabs v-model="tab"
                 type="card">
          <el-tab-pane label="修改头像"
                       name="icon">
            <div class="tab-content">
              <h3 style="margin-left:50px;">点击虚线框内图片选择新的头像</h3>
              <div class="icon-zone">
                <el-upload class="avatar-uploader"
                           :action="uploadImgUrl"
                           :show-file-list="false"
                           :on-success="imgUploadSuccess">
                  <img v-if="iconUrl"
                       :src="iconUrl"
                       class="avatar">
                  <i v-else
                     class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
            </div>
            <el-button type="primary"
                       style="margin-left:130px;margin-bottom:50px;"
                       @click="updateIcon(iconUrl)"
                       :disabled="iconUrl === userInfo.info.icon_url">保存头像</el-button>
          </el-tab-pane>
          <el-tab-pane label="修改资料"
                       name="info">
            <div class="tab-content">
              <div class="pswc">
                <el-form :model="changeInfoForm"
                         status-icon
                         :rules="changeInfoRules"
                         ref="changeInfoForm"
                         label-width="100px"
                         class="demo-ruleForm">
                  <el-form-item label="昵称"
                                prop="nickname">
                    <el-input v-model="changeInfoForm.nickname"
                              autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱"
                                prop="email">
                    <el-input v-model="changeInfoForm.email"
                              autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="手机号"
                                prop="phone">
                    <el-input v-model="changeInfoForm.phone"
                              autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary"
                               @click="submitInfoChange">提交</el-button>
                    <el-button @click="resetForm('changeInfoForm')">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="修改密码"
                       name="psw">
            <div class="tab-content">

              <div class="pswc">
                <el-form :model="changPswForm"
                         status-icon
                         :rules="changPswRules"
                         ref="changPswForm"
                         label-width="100px"
                         class="demo-ruleForm">
                  <el-form-item label="原密码"
                                prop="old_psw">
                    <el-input type="password"
                              v-model="changPswForm.old_psw"
                              autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="新密码"
                                prop="new_psw">
                    <el-input type="password"
                              v-model="changPswForm.new_psw"
                              autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="确认密码"
                                prop="new_psw_check">
                    <el-input type="password"
                              v-model="changPswForm.new_psw_check"
                              autocomplete="off"></el-input>
                  </el-form-item>

                  <el-form-item>
                    <el-button type="primary"
                               @click="submitPswChange">提交</el-button>
                    <el-button @click="resetForm('changPswForm')">重置</el-button>
                  </el-form-item>
                </el-form>

              </div>
            </div>
          </el-tab-pane>
        </el-tabs>

      </div>
    </y-shelf>
  </div>
</template>
<script>
  import YButton from '/components/YButton'
  import { updateInfo, userInfo, changePsw } from '/api/index'
  import YShelf from '/components/shelf'
  import vueCropper from 'vue-cropper'
  import { mapState, mapMutations } from 'vuex'
  export default {
    data () {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'))
        } else {
          if (this.changPswForm.new_psw_check !== '') {
            this.$refs.changPswForm.validateField('new_psw_check')
          }
          callback()
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.changPswForm.new_psw) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        // 上传图片的 API 地址 本来是 http://127.0.0.1:8080/v1/user/uploadImage，但是这里做了转发
        uploadImgUrl: 'http://localhost:9999/user/uploadImage',
        tab: 'icon',
        iconUrl: '',
        // 修改资料表单
        changeInfoForm: {
          nickname: '',
          email: '',
          phone: ''

        },
        // 修改资料表单校验
        changeInfoRules: {
          nickname: [
             { required: true, message: '昵称不能为空', trigger: 'blur' },
             { min: 2, max: 18, message: '长度在 2 到 18个字符', trigger: 'change' }
          ],
          email: [
            { required: true, message: '邮箱不能为空', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ],
          phone: [
            { required: true, message: '手机号不能为空', trigger: 'blur' },
            { min: 6, max: 18, message: '长度在 6 到 18个字符', trigger: 'change' }
          ]
        },
        // 修改密码表单
        changPswForm: {
          old_psw: '',
          new_psw: '',
          new_psw_check: ''
        },
        // 修改密码表单校验
        changPswRules: {
          old_psw: [
             { required: true, message: '请输入原密码', trigger: 'blur' },
             { min: 6, max: 18, message: '长度在 6 到 18个字符', trigger: 'change' }
          ],
          new_psw: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, max: 18, message: '长度在 6 到 18个字符', trigger: 'change' },
            { validator: validatePass, trigger: 'change' }
          ],
          new_psw_check: [
            { required: true, message: '请输入再次输入新密码', trigger: 'blur' },
            { min: 6, max: 18, message: '长度在 6 到 18个字符', trigger: 'change' },
            { validator: validatePass2, trigger: 'change' }
          ]
        }
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
    methods: {
      ...mapMutations([
        'RECORD_USERINFO'
      ]),
      // 重置表单
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      message (m) {
        this.$message(m)
      },
      messageSuccess (m) {
        this.$message({
          message: m,
          type: 'success'
        })
      },
      messageFail (m) {
        this.$message.error({
          message: m
        })
      },
      // 校验表单
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
      // 上传成功
      imgUploadSuccess (response, file, fileList) {
        if (response.code === 200) {
          this.iconUrl = response.data
        } else {
          this.messageFail('头像上传失败：' + response.message)
        }
      },
      // 更新头像
      updateIcon (iconUrl) {
        let params = {icon_url: iconUrl}
        this._updateInfo(params)
      },
      // 更新资料
      _updateInfo (params) {
        updateInfo(params).then(res => {
          if (res.code === 200) {
            this.messageSuccess('资料更新成功')
            this._getUserInfo()
          } else {
            this.messageFail('资料更新失败:' + res.message)
          }
        })
      },
      // 更新资料 - 提交按钮事件
      submitInfoChange () {
        if (!this.validForm('changeInfoForm')) return
        let params = {
          nickname: this.changeInfoForm.nickname,
          email: this.changeInfoForm.email,
          phone: this.changeInfoForm.phone
        }
        this._updateInfo(params)
      },
      // 修改密码
      submitPswChange () {
        if (!this.validForm('changPswForm')) return
        let params = {
          old_psw: this.changPswForm.old_psw,
          new_psw: this.changPswForm.new_psw
        }
        this._changePsw(params)
      },
      // 修改密码
      _changePsw (params) {
        changePsw(params).then(res => {
          if (res.code === 200) {
            this.messageSuccess('密码修改成功')
            this.resetForm('changPswForm')
          } else {
            this.messageFail('修改失败:' + res.message)
          }
        })
      },
      _getUserInfo () {
        userInfo().then(res => {
          if (res.code === 200) {
            this.RECORD_USERINFO({info: res.data})
            this.updateChangeInfoForm(this.userInfo.info)
          }
        })
      },
      // 更新用户信息表单
      updateChangeInfoForm (info) {
        this.changeInfoForm.nickname = this.userInfo.info.nickname
        this.changeInfoForm.email = this.userInfo.info.email
        this.changeInfoForm.phone = this.userInfo.info.phone
      }
    },
    created () {
      this.iconUrl = this.userInfo.info.icon_url
      this.updateChangeInfoForm(this.userInfo.info)
    },
    components: {
      YButton,
      YShelf,
      vueCropper
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/style/mixin";

  .tab-content{
    margin:15px;
  }

   .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
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
  .icon-zone {
    margin:50px;
    border:dashed;
    border-radius: 15px;
    padding: 20px;
    width: 228px;
  }
  .pswc{
    width: 500px;
  }
</style>

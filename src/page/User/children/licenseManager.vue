// TODO 资质认证  营业执照之类的认证和查看
<template>
  <div>
    <y-shelf title="资质认证">
      <div slot="content">
        <div style="margin:20px">
          <span class="support">资质认证:</span>
          <span class="support">{{verifyStatusStr(seller_license.verify_status)}}</span>
          <div v-if="!seller_license.id">
            <el-button type="primary">申请成为商家</el-button>
          </div>
          <div v-if="seller_license.id"
               class="sellerInfo-text">
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
              营业执照: <el-button type="text"
                         @click="showLiceseImage()">点击查看</el-button>
            </p>
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
  import { getLicenseByUserId } from '/api/index'
  import { mapState } from 'vuex'

  export default {
    components: {
      YShelf
    },
    data () {
      return {
        seller_license: {},
        imgPreviewDialogShow: false,
        imgPreviewUrl: ''
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
    methods: {
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
      // 获取执照信息
      _getLicenseByUserId (seller_id) {
        getLicenseByUserId({params: {user_id: seller_id}}).then(res => {
          if (res.code === 200) {
            this.seller_license = res.data
          }
        })
      },
      showLiceseImage () {
        this.imgPreviewUrl = this.seller_license.license_image_url
        this.imgPreviewDialogShow = true
      }
    },
    created () {
      this._getLicenseByUserId(this.userInfo.info.id)
    }
  }
</script>
<style lang="scss" scoped>
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

<template>
  <div class="layout-container">
    <y-header>
      <div slot="nav"></div>
    </y-header>
    <div class="w">
      <div class="content">
        <div class="account-sidebar">
          <div class="avatar gray-box ">
            <div>
              <img :src="userInfo.info.icon_url">
              <h5>
                {{userInfo.info.nickname}}</h5>
            </div>
            <div class="box-inner">
              <ul class="account-nav">
                <li v-for="(item,i) in nav"
                    :key='i'
                    v-if="showTab(item)"
                    :class="{current:item.name===title}"
                    @click="tab(item)">
                  <a href="javascript:;">{{item.name}}</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="account-content">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <y-footer></y-footer>

  </div>

</template>
<script>
  import YFooter from '/common/footer'
  import YHeader from '/common/header'
  import { mapState } from 'vuex'

  // 或许应该转成常量，但是还不会，之后有空再做
  let allrole = -1
  let buyer = 0
  let seller = 2

  export default {
    data () {
      return {
        title: '我的订单',
        nav: [
          {name: '我的订单', path: 'orderList', role: buyer},
          {name: '订单管理', path: 'orderManager', role: seller},
          {name: '我的众筹', path: 'fundingManager', role: seller},
          {name: '资质认证', path: 'licenseManager', role: allrole},
          {name: '账户资料', path: 'information', role: allrole},
          {name: '收货地址', path: 'addressList', role: buyer},
          {name: '我的优惠', path: 'coupon', role: buyer},
          {name: '售后服务', path: 'support', role: buyer},
          {name: '以旧换新', path: 'aihuishou', role: buyer}
        ],
        editAvatar: true
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
    methods: {
      showTab (item) {
        let show = true
        if (item.role !== allrole) {
          show = this.userInfo.info.role_id === item.role
        }
        return show
      },
      tab (e) {
        this.$router.push({path: '/user/' + e.path})
      }
    },
    created () {
      let path = this.$route.path.split('/')[2]
      console.log(path)
      if (!path) {
        if (this.userInfo.info.role_id === buyer) {
          this.$router.push({path: '/user/' + 'orderList'})
        } else if (this.userInfo.info.role_id === seller) {
          this.$router.push({path: '/user/' + 'orderManager'})
        }
      }
      this.nav.forEach(item => {
        if (item.path === path) {
          this.title = item.name
        }
      })
    },
    components: {
      YFooter,
      YHeader
    },
    watch: {
      $route (to) {
        let path = to.path.split('/')[2]
        this.nav.forEach(item => {
          if (item.path === path) {
            this.title = item.name
          }
        })
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/style/mixin";

  .w {
    padding-top: 40px;
  }

  .content {
    display: flex;
    height: 100%;
  }

  .account-sidebar {
    width: 210px;
    border-radius: 6px;
    .avatar {
      padding-top: 20px;
      border-radius: 10px;
      text-align: center;
      img {
        width: 168px;
        height: 168px;
      }
      h5 {
        font-size: 18px;
        line-height: 48px;
        font-weight: 700;
      }
    }
    .account-nav {
      padding-top: 15px;
      li {
        position: relative;
        height: 48px;
        border-top: 1px solid #EBEBEB;
        line-height: 48px;
        &:hover {
          a {
            position: relative;
            z-index: 1;
            height: 50px;
            background-color: #98AFEE;
            line-height: 50px;
            color: #FFF;
          }

        }
        a {
          display: block;
        }
        &.current {
          a {
            position: relative;
            z-index: 1;
            height: 50px;
            background-color: #98AFEE;
            line-height: 50px;
            color: #FFF;
          }
        }

      }
    }
  }

  .account-content {
    margin-left: 20px;
    flex: 1;
  }


</style>

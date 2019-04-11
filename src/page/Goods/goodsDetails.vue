<!--商品详情-->
<template>
  <div class="w store-content">
    <div class="gray-box">
      <div class="gallery-wrapper">
        <div class="gallery">
          <!-- <div class="thumbnail">
            <ul>
              <li v-for="(item,i) in small"
                  :key="i"
                  :class="{on:big===item}"
                  @click="big=item">
                <img v-lazy="item"
                     :alt="product.name">
              </li>
            </ul>
          </div> -->
          <div class="thumb">
            <div class="big">
              <img :src="product.big_img"
                   :alt="product.name">
            </div>
          </div>
        </div>
      </div>
      <!--右边-->
      <div class="banner">
        <div class="sku-custom-title">
          <h4>{{product.name}}</h4>
          <h6>
            <span>{{product.name}}</span>
            <span class="price">
              <em>¥</em><i>{{product.current_price.toFixed(2)}}</i></span>
          </h6>
        </div>
        <div class="num">
          <span class="params-name">数量</span>
          <buy-num @edit-num="editNum"
                   :limit="100"></buy-num>
        </div>
        <div class="buy">
          <y-button text="加入购物车"
                    @btnClick="addCart(product.id,product.salePrice,product.name,product.small_img)"
                    classStyle="main-btn"
                    style="width: 145px;height: 50px;line-height: 48px"></y-button>
          <y-button text="现在购买"
                    @btnClick="checkout(product.id)"
                    style="width: 145px;height: 50px;line-height: 48px;margin-left: 10px"></y-button>
        </div>
      </div>
    </div>
    <!--产品信息-->
    <div class="item-info">
      <y-shelf title="产品信息">
        <div slot="content">
          <div class="img-item"
               v-if="product.detail_html">
            <div v-html="product.detail_html">{{ product.detail_html }}</div>
          </div>
          <div class="no-info"
               v-else>
            <img src="/static/images/no-data.png">
            <br>
            该商品暂无内容数据
          </div>
        </div>
      </y-shelf>
    </div>
  </div>
</template>
<script>
  import { productDet, addCart } from '/api/goods'
  import { mapMutations, mapState } from 'vuex'
  import YShelf from '/components/shelf'
  import BuyNum from '/components/buynum'
  import YButton from '/components/YButton'
  import { getStore } from '/utils/storage'
  const tmp = {
    'id': 11111,
    'name': '鑫乐迪运动手环蓝牙耳机二合一',
    'big_img': 'https://img30.360buyimg.com/cf/jfs/t1/21081/18/6891/106614/5c6639a2E4d110821/c5802dca70419338.jpg',
    'small_img': 'https://img30.360buyimg.com/cf/jfs/t1/28544/16/6906/44121/5c66399bE78db06bd/0b919fb33eaccc26.jpg',
    'product_type': 1,
    'current_price': 1098900,
    'target_price': 100000,
    'backers': 2897,
    'end_time': '2019-04-11T21:00:13+08:00',
    'detail_html': '<div class="tab-div tab-current">\r\n                <!--无缝滚动公告-->\r\n                <div class="tab-public-mess clearfix" style="display:none" id="officeTopic">\r\n                    <span class="mess-public-title"><i class="laba"></i>众筹官方：</span>\r\n                    <div class="mess-box-w" id="MBW">\r\n                        <div class="scroll-box clearfix">\r\n                            <ul class="mess-box" id="messBox1">\r\n                                <li class="mess-list"></li>\r\n                            </ul>\r\n                            <ul class="mess-box mess-box2" id="messBox2">\r\n                                <li class="mess-list"></li>\r\n                            </ul>\r\n                        </div>\r\n                    </div>\r\n                    <div class="close-btn-area">\r\n                        <span>×</span>\r\n                    </div>\r\n                </div>\r\n                <!--图片部分-->\r\n                <div class=" tab-img-group-old" style="width:733px;margin:0 auto;padding:0;text-align:center;">\r\n\t\t\t\t\t                        <iframe src="http://newbuz.360buyimg.com/video/4.5/jdvideo.html?autoplay=false&amp;fuScrnEnabled=true&amp;playbackRateEnabled=true&amp;fileid=150308713247805441&amp;appid=1251412368&amp;sw=1280&amp;sh=720" width="100%" height="422px" frameborder="0"></iframe>\r\n\t\t\t\t\t                </div>\r\n                <div class="                            new-story-container\r\n                            ">\r\n                        \r\n \r\n \r\n  <p class="title">众筹故事</p>\r\n  <p><img class="lazyout-detail" src="http://img30.360buyimg.com/cf/jfs/t1/12114/22/10496/190054/5c85f8c0Ead5ae439/a39092bf70d60ea7.jpg" data-original="http://img30.360buyimg.com/cf/jfs/t1/12114/22/10496/190054/5c85f8c0Ead5ae439/a39092bf70d60ea7.jpg" alt="鑫乐迪运动手环蓝牙耳机二合一" style="display: inline;"><img class="lazyout-detail" src="http://img30.360buyimg.com/cf/jfs/t1/20186/11/7010/369749/5c6639cfEf0deed9e/f21e34a7f63fa92a.jpg" data-original="http://img30.360buyimg.com/cf/jfs/t1/20186/11/7010/369749/5c6639cfEf0deed9e/f21e34a7f63fa92a.jpg" alt="京东众筹" style="display: inline;"><img class="lazyout-detail" src="http://img30.360buyimg.com/cf/jfs/t1/30810/29/2136/263567/5c6639d6E49863816/e55c0299b1fa7391.jpg" data-original="http://img30.360buyimg.com/cf/jfs/t1/30810/29/2136/263567/5c6639d6E49863816/e55c0299b1fa7391.jpg" alt="众筹网" style="display: inline;"><img class="lazyout-detail" src="http://img30.360buyimg.com/cf/jfs/t1/19762/14/6984/242480/5c6639dfEebbd8f69/cbad99b8d73553c2.jpg" data-original="http://img30.360buyimg.com/cf/jfs/t1/19762/14/6984/242480/5c6639dfEebbd8f69/cbad99b8d73553c2.jpg" alt="科技众筹" style="display: inline;"><img class="lazyout-detail" src="http://img30.360buyimg.com/cf/jfs/t1/32345/10/2129/315696/5c6639e7E43010088/04f21a674e084ed2.jpg" data-original="http://img30.360buyimg.com/cf/jfs/t1/32345/10/2129/315696/5c6639e7E43010088/04f21a674e084ed2.jpg" alt="京东产品众筹平台" style="display: inline;"><img class="lazyout-detail" src="http://img30.360buyimg.com/cf/jfs/t1/23583/17/6920/201057/5c6639eeEf05a4001/8c26bd69db316547.jpg" data-original="http://img30.360buyimg.com/cf/jfs/t1/23583/17/6920/201057/5c6639eeEf05a4001/8c26bd69db316547.jpg" alt="众筹网站" style="display: inline;"><img class="lazyout-detail" src="http://img30.360buyimg.com/cf/jfs/t1/21145/9/6967/281372/5c6639f5Eb796cd19/121156915b61031f.jpg" data-original="http://img30.360buyimg.com/cf/jfs/t1/21145/9/6967/281372/5c6639f5Eb796cd19/121156915b61031f.jpg" style="display: inline;"><img class="lazyout-detail" src="http://img30.360buyimg.com/cf/jfs/t1/11422/39/7833/284106/5c663a02E0e3ef54d/c27db2a8e67fb24c.jpg" data-original="http://img30.360buyimg.com/cf/jfs/t1/11422/39/7833/284106/5c663a02E0e3ef54d/c27db2a8e67fb24c.jpg" alt="鑫乐迪运动手环蓝牙耳机二合一" style="display: inline;"><img class="lazyout-detail" src="http://img30.360buyimg.com/cf/jfs/t1/22161/19/7014/173831/5c663a09E41fbe85a/d8dec990605e93dd.jpg" data-original="http://img30.360buyimg.com/cf/jfs/t1/22161/19/7014/173831/5c663a09E41fbe85a/d8dec990605e93dd.jpg" alt="京东众筹" style="display: inline;"><img class="lazyout-detail" src="http://img30.360buyimg.com/cf/jfs/t1/19222/7/7813/477969/5c6fac10E6fb5857f/76d21f15cee97561.jpg" data-original="http://img30.360buyimg.com/cf/jfs/t1/19222/7/7813/477969/5c6fac10E6fb5857f/76d21f15cee97561.jpg" alt="众筹网" style="display: inline;"><img class="lazyout-detail" src="http://img30.360buyimg.com/cf/jfs/t1/8956/33/14423/184511/5c663a17E05c4388b/b74dc7364b17e567.jpg" data-original="http://img30.360buyimg.com/cf/jfs/t1/8956/33/14423/184511/5c663a17E05c4388b/b74dc7364b17e567.jpg" alt="科技众筹" style="display: inline;"><img class="lazyout-detail" src="http://img30.360buyimg.com/cf/jfs/t1/28885/10/6847/154142/5c663a26Ec10ed136/327f2b6d17fabc7f.jpg" data-original="http://img30.360buyimg.com/cf/jfs/t1/28885/10/6847/154142/5c663a26Ec10ed136/327f2b6d17fabc7f.jpg" alt="京东产品众筹平台" style="display: inline;"><img class="lazyout-detail" src="http://img30.360buyimg.com/cf/jfs/t1/10699/9/10551/124702/5c663a2eE4a7af395/87521de309725121.jpg" data-original="http://img30.360buyimg.com/cf/jfs/t1/10699/9/10551/124702/5c663a2eE4a7af395/87521de309725121.jpg" alt="众筹网站" style="display: inline;"><img class="lazyout-detail" src="http://img30.360buyimg.com/cf/jfs/t1/21964/31/7067/137559/5c663a35Eb5769f56/c7d3a2c5afc320fc.jpg" data-original="http://img30.360buyimg.com/cf/jfs/t1/21964/31/7067/137559/5c663a35Eb5769f56/c7d3a2c5afc320fc.jpg" style="display: inline;"><img class="lazyout-detail" src="http://img30.360buyimg.com/cf/jfs/t1/14476/8/6983/133632/5c663a3dE354a4d92/a6f0372963795a1c.jpg" data-original="http://img30.360buyimg.com/cf/jfs/t1/14476/8/6983/133632/5c663a3dE354a4d92/a6f0372963795a1c.jpg" alt="鑫乐迪运动手环蓝牙耳机二合一" style="display: inline;"><img class="lazyout-detail" src="http://img30.360buyimg.com/cf/jfs/t1/10899/39/10466/81372/5c663a44Ef7603a92/cf184a14801ce22e.jpg" data-original="http://img30.360buyimg.com/cf/jfs/t1/10899/39/10466/81372/5c663a44Ef7603a92/cf184a14801ce22e.jpg" alt="京东众筹" style="display: inline;"></p>\r\n  <p class="title">为什么众筹</p>\r\n  <p><img class="lazyout-detail" src="http://img30.360buyimg.com/cf/jfs/t1/19412/15/7293/93187/5c6cefc0E687a6a61/00ae401a398e61e5.jpg" data-original="http://img30.360buyimg.com/cf/jfs/t1/19412/15/7293/93187/5c6cefc0E687a6a61/00ae401a398e61e5.jpg" alt="众筹网" style="display: inline;"><img class="lazyout-detail" src="http://img30.360buyimg.com/cf/jfs/t1/9106/5/14712/288452/5c663a53Edfb55609/261f2d28b3cc49ce.jpg" data-original="http://img30.360buyimg.com/cf/jfs/t1/9106/5/14712/288452/5c663a53Edfb55609/261f2d28b3cc49ce.jpg" alt="科技众筹" style="display: inline;"><img class="lazyout-detail" src="http://img30.360buyimg.com/cf/jfs/t1/32790/25/2106/211297/5c663a5fE70e434ea/758bfd3c1890112c.jpg" data-original="http://img30.360buyimg.com/cf/jfs/t1/32790/25/2106/211297/5c663a5fE70e434ea/758bfd3c1890112c.jpg" alt="京东产品众筹平台" style="display: inline;"><img class="lazyout-detail" src="http://img30.360buyimg.com/cf/jfs/t1/23457/21/7012/41323/5c663a65E23ac333c/9d0b44eeb672e339.jpg" data-original="http://img30.360buyimg.com/cf/jfs/t1/23457/21/7012/41323/5c663a65E23ac333c/9d0b44eeb672e339.jpg" alt="众筹网站" style="display: inline;"></p>\r\n  <p class="zc-qrcode"><img class="lazyout-detail" src="http://storage.jd.com/zc-ued-fe/zc_oa_qrcode.jpg" data-original="http://storage.jd.com/zc-ued-fe/zc_oa_qrcode.jpg" style="display: inline;"></p>\r\n  <p class="para al-center">推荐关注「京东众筹」公众号，我们会为您提供咨询服务，及时同步最新项目进展和优惠活动。</p>\r\n \r\n                </div>\r\n\r\n                <!--图片部分end-->\r\n\r\n            </div>',
    'product_packages': [
      {
        'id': 111111111,
        'product_id': '11111',
        'description': '感谢您的支持，您将以众筹专属价格269元获得智能手环运动蓝牙耳机二合一（运动版）1副',
        'image_url': 'https://img30.360buyimg.com/cf/jfs/t1/8310/15/14533/53034/5c663b99E2c623c38/d9786ddce73c06b2.jpg',
        'price': 269,
        'stock': 0,
        'total': 700,
        'backers': 0,
        'freight': 0,
        'delivery_day': 30
      },
      {
        'id': 111111112,
        'product_id': '11111',
        'description': '感谢您的支持，您将以众筹专属价格299元获得智能手环运动蓝牙耳机二合一（运动版）1副',
        'image_url': 'https://img30.360buyimg.com/cf/jfs/t1/14505/24/6901/53034/5c663becE003e7921/060318eb1da6e9d1.jpg',
        'price': 299,
        'stock': 2320,
        'total': 3000,
        'backers': 0,
        'freight': 0,
        'delivery_day': 30
      },
      {
        'id': 111111113,
        'product_id': '11111',
        'description': '感谢您的支持，您将以众筹专属价格339元获得智能手环运动蓝牙耳机二合一（商务版）1副',
        'image_url': 'https://img30.360buyimg.com/cf/jfs/t1/29636/4/6858/52719/5c663c31E7812cb0d/77ef257f10a2ac2f.jpg',
        'price': 339,
        'stock': 1036,
        'total': 2000,
        'backers': 0,
        'freight': 0,
        'delivery_day': 30
      },
      {
        'id': 111111114,
        'product_id': '11111',
        'description': '感谢您的支持，您将以众筹专属价格599元获得智能手环运动蓝牙耳机二合一（运动版+商务版）总2副',
        'image_url': 'https://img30.360buyimg.com/cf/jfs/t1/16497/2/6865/69028/5c663c68E5502510c/f803fe92aefba4f8.jpg',
        'price': 599,
        'stock': 455,
        'total': 500,
        'backers': 0,
        'freight': 0,
        'delivery_day': 30
      },
      {
        'id': 111111115,
        'product_id': '11111',
        'description': '感谢您的支持，您将以众筹专属价格599元获得智能手环运动蓝牙耳机二合一（运动版+商务版）总2副',
        'image_url': 'https://img30.360buyimg.com/cf/jfs/t1/16497/2/6865/69028/5c663c68E5502510c/f803fe92aefba4f8.jpg',
        'price': 2800,
        'stock': 180,
        'total': 200,
        'backers': 0,
        'freight': 0,
        'delivery_day': 30
      },
      {
        'id': 111111116,
        'product_id': '11111',
        'description': '感谢您的支持，您将以众筹专属价格599元获得智能手环运动蓝牙耳机二合一（运动版+商务版）总2副',
        'image_url': 'https://img30.360buyimg.com/cf/jfs/t1/16497/2/6865/69028/5c663c68E5502510c/f803fe92aefba4f8.jpg',
        'price': 27000,
        'stock': 89,
        'total': 100,
        'backers': 0,
        'freight': 0,
        'delivery_day': 30
      }
    ]
  }
  
  export default {
    data () {
      return {
        productMsg: {},
        small: [],
        big: '',
        product: tmp,
        productNum: 1,
        userId: ''
      }
    },
    computed: {
      ...mapState(['login', 'showMoveImg', 'showCart'])
    },
    methods: {
      ...mapMutations(['ADD_CART', 'ADD_ANIMATION', 'SHOW_CART']),
      _productDet (productId) {
        productDet({params: {productId}}).then(res => {
          let result = res.result
          this.product = result
          this.productMsg = result.detail || ''
          this.small = result.small_img
          this.big = this.small[0]
        })
      },
      addCart (id, price, name, img) {
        if (!this.showMoveImg) {     // 动画是否在运动
          if (this.login) { // 登录了 直接存在用户名下
            addCart({userId: this.userId, productId: id, productNum: this.productNum}).then(res => {
              // 并不重新请求数据
              this.ADD_CART({
                productId: id,
                salePrice: price,
                productName: name,
                productImg: img,
                productNum: this.productNum
              })
            })
          } else { // 未登录 vuex
            this.ADD_CART({
              productId: id,
              salePrice: price,
              productName: name,
              productImg: img,
              productNum: this.productNum
            })
          }
          // 加入购物车动画
          var dom = event.target
          // 获取点击的坐标
          let elLeft = dom.getBoundingClientRect().left + (dom.offsetWidth / 2)
          let elTop = dom.getBoundingClientRect().top + (dom.offsetHeight / 2)
          // 需要触发
          this.ADD_ANIMATION({moveShow: true, elLeft: elLeft, elTop: elTop, img: img})
          if (!this.showCart) {
            this.SHOW_CART({showCart: true})
          }
        }
      },
      checkout (productId) {
        this.$router.push({path: '/checkout', query: {productId, num: this.productNum}})
      },
      editNum (num) {
        this.productNum = num
      }
    },
    components: {
      YShelf, BuyNum, YButton
    },
    created () {
      // let id = this.$route.query.productId
      // this._productDet(id)
      this.userId = getStore('userId')
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../assets/style/mixin";

  .store-content {
    clear: both;
    width: 1220px;
    min-height: 600px;
    padding: 0 0 25px;
    margin: 0 auto;
  }

  .gray-box {
    display: flex;
    padding: 10px 10px 10px 0px;
    margin: 0px 0;
    .gallery-wrapper {
      .gallery {
        display: flex;
        width: 790px;
        .thumbnail {
          li:first-child {
            margin-top: 0px;
          }
          li {
            @include wh(80px);
            margin-top: 10px;
            padding: 12px;
            border: 1px solid #f0f0f0;
            border: 1px solid rgba(0, 0, 0, .06);
            border-radius: 5px;
            cursor: pointer;
            &.on {
              padding: 10px;
              border: 3px solid #ccc;
              border: 3px solid rgba(0, 0, 0, .2);
            }
            img {
              display: block;
              @include wh(100%);
            }
          }
        }
        .thumb {
          .big {
            margin-left: 20px;
          }
          img {
            display: block;
            width: 100%
            // @include wh(440px)
          }
        }
      }
    }
    // 右边
    .banner {
      width: 450px;
      margin-left: 10px;
      h4 {
        font-size: 24px;
        line-height: 1.25;
        color: #000;
        margin-bottom: 13px;
      }
      h6 {
        font-size: 14px;
        line-height: 1.5;
        color: #bdbdbd;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .sku-custom-title {
        overflow: hidden;
        padding: 8px 8px 18px 10px;
        position: relative;
      }
      .params-name {
        padding-right: 20px;
        font-size: 14px;
        color: #8d8d8d;
        line-height: 36px;
      }
      .num {
        padding: 29px 0 8px 10px;
        border-top: 1px solid #ebebeb;
        display: flex;
        align-items: center;
      }
      .buy {
        position: relative;
        border-top: 1px solid #ebebeb;
        padding: 30px 0 0 10px;
      }
    }
  }

  .item-info {

    .gray-box {
      padding: 0;
      display: block;
    }
    .img-item {
      width: 1220px;
      // padding: 1vw;
      text-align: center;
      img {
        width: 100%;
        height: auto;
        display: block;
      }
    }
  }

  .no-info {
    padding: 200px 0;
    text-align: center;
    font-size: 30px;
  }

  .price {
    display: block;
    color: #d44d44;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    text-align: right;
    i {
      padding-left: 2px;
      font-size: 24px;
    }
  }
</style>

<!--评论模块-->
<template>
  <div class="container">
    <div class="comment"
         v-for="(item,i) in comments"
         :key="i">
      <div class="info">
        <img class="avatar"
             :src="IconUrlConvert(item.icon_url)"
             width="36"
             height="36" />
        <div class="right">
          <div class="name">{{item.nickname}}
            <span class="seller"
                  v-if="item.is_seller">商家</span></div>
          <div class="date">{{_formatDate(item.created_at)}}</div>
        </div>
      </div>
      <div class="content">{{item.content}}</div>
      <div class="control">
        <!-- <span class="like" :class="{active: item.isLike}" @click="likeClick(item)">
          <i class="iconfont icon-like"></i>
          <span class="like-num">{{item.likeNum > 0 ? item.likeNum + '人赞' : '赞'}}</span>
        </span> -->
        <span class="comment-reply"
              @click="showCommentInput(item,i)">
          <i class="iconfont icon-comment"></i>
          <span>回复</span>
        </span>
      </div>
      <div class="reply">
        <div class="item"
             v-for="(reply,i) in item.replys"
             :key="i">
          <div class="reply-content">
            <span class="from-name">{{reply.nickname}}
              <span class="seller-reply"
                    v-if="reply.is_seller">商家</span>: </span>
            <!-- <span class="to-name">@{{reply.toName}}</span> -->
            <span>{{reply.content}}</span>
          </div>
          <div class="reply-bottom">
            <span>{{_formatDate(reply.created_at)}}</span>
            <!-- <span class="reply-text"
                  @click="showCommentInput(item, reply)">
              <i class="iconfont icon-comment"></i>
              <span>回复</span>
            </span> -->
          </div>
        </div>
        <div class="write-reply"
             v-if="item.replys && item.replys.length > 0"
             @click="showCommentInput(item,i)">
          <i class="el-icon-edit"></i>
          <span class="add-comment">添加新评论</span>
        </div>
        <input-component :show="showItemId === item.id"
                         v-model="inputComment"
                         @cancel="cancelInput"
                         @confirm="commitComment">
        </input-component>
      </div>
    </div>
  </div>
</template>

<script>
  import { formatDate } from '/utils/dateUtil'
  import { saveCommentsReply } from '/api/goods'
  import InputComponent from './InputComponent'

  export default {
    props: {
      comments: {
        type: Array,
        required: true
      },
      login: {
        type: Boolean,
        default: true
      },
      userInfo: {type: Object},
      seller_id: {
        type: Number,
        default: -1
      }
    },
    components: {
      'input-component': InputComponent
    },
    data () {
      return {
        inputComment: '',
        showItemId: '',
        showItemIndex: -1
      }
    },
    computed: {},
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
      IconUrlConvert (url) {
        if (!url) {
          url = 'static/images/defaultIcon.png'
        }
        return url
      },
      _formatDate (date) {
        return formatDate(date)
      },

      /**
       * 点击取消按钮
       */
      cancelInput () {
        this.showItemId = ''
      },

      /**
       * 提交评论
       */
      commitComment (value) {
        // let value = this.params.value;
        console.log(this.userInfo.info.id)
        console.log(this.showItemId)
        console.log(value)
  
        if (value.length < 4) {
          console.log(value)
          console.log(value)
          this.messageError('评论至少4个字')
          return
        }
        let reply = {
          comment_id: this.showItemId,
          content: this.inputComment
        }
        this._submitCommentReply(reply)
      },
      /**
       * 点击评论按钮显示输入框
       * item: 当前大评论
       * index: 当前大评论的下标
       */
      showCommentInput (item, index) {
        // if (reply) {
        //   this.inputComment = "@" + reply.fromName + " "
        // } else {
        //   this.inputComment = ''
        // }
        this.inputComment = ''
        this.showItemId = item.id
        this.showItemIndex = index
      },
      // 提交评论回复
      _submitCommentReply (reply) {
        saveCommentsReply(reply).then(res => {
          if (res.code === 200) {
            if (res.code === 200) {
              this.inputComment = ''
              let newReplay = res.data
              let userInfo = this.userInfo.info
              newReplay.user_id = userInfo.id
              newReplay.username = userInfo.username
              newReplay.nickname = userInfo.nickname
              newReplay.icon_url = userInfo.icon_url
              newReplay.created_at = Date.now()
              if (this.seller_id === userInfo.id) {
                newReplay.is_seller = true
              }
              if (!this.comments[this.showItemIndex].replys) {
                this.comments[this.showItemIndex].replys = []
              }
              // 向对应评论的回复列表的前方插入新的回复
              this.comments[this.showItemIndex].replys.unshift(newReplay)
            } else {
              this.messageError('回复提交失败' + res.message)
            }
          }
        }).catch(error => {
          this.messageError('回复提交失败' + error)
        })
      }
    },
    created () {
      console.log(this.comments)
    }
  }
</script>

<style scoped lang="scss">

  @import "../assets/style/comment.scss";
  .seller{
    margin: 1px;
    margin-left:3px;
    padding:1.5px 4px 1.5px 3px;
    border-style: solid;
    border-width: 1px;
    border-radius: 8px;
    border-color: red;
    color: red;
    font-size: 14px;
  }

  .seller-reply{
    margin: 0.5px;
    margin-left:1px;
    padding:0.75px 2.5px 0.75px 2px;
    border-style: solid;
    border-width: 1px;
    border-radius: 8px;
    border-color: red;
    color: red;
    font-size: 8px;
  }
  .container {
    padding: 0 10px;
    box-sizing: border-box;
    .comment {
      display: flex;
      flex-direction: column;
      padding: 10px;
      border-bottom: 1px solid $border-fourth;
      .info {
        display: flex;
        align-items: center;
        .avatar {
          border-radius: 50%;
        }
        .right {
          display: flex;
          flex-direction: column;
          margin-left: 10px;
          .name {
            font-size: 16px;
            color: $text-main;
            margin-bottom: 5px;
            font-weight: 500;
          }
          .date {
            font-size: 12px;
            color: $text-minor;
          }
        }
      }
      .content {
        font-size: 16px;
        color: $text-main;
        line-height: 20px;
        padding: 10px 0;
      }
      .control {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: $text-minor;
        .like {
          display: flex;
          align-items: center;
          margin-right: 20px;
          cursor: pointer;
          &.active, &:hover {
            color: $color-main;
          }
          .iconfont {
            font-size: 14px;
            margin-right: 5px;
          }
        }
        .comment-reply {
          display: flex;
          align-items: center;
          cursor: pointer;
          &:hover {
            color: $text-333;
          }
          .iconfont {
            font-size: 16px;
            margin-right: 5px;
          }
        }

      }
      .reply {
        margin: 10px 0;
        border-left: 2px solid $border-first;
        .item {
          margin: 0 10px;
          padding: 10px 0;
          border-bottom: 1px dashed $border-third;
          .reply-content {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: $text-main;
            .from-name {
              color: $color-main;
            }
            .to-name {
              color: $color-main;
              margin-left: 5px;
              margin-right: 5px;
            }
          }
          .reply-bottom {
            display: flex;
            align-items: center;
            margin-top: 6px;
            font-size: 12px;
            color: $text-minor;
            .reply-text {
              display: flex;
              align-items: center;
              margin-left: 10px;
              cursor: pointer;
              &:hover {
                color: $text-333;
              }
              .icon-comment {
                margin-right: 5px;
              }
            }
          }
        }
        .write-reply {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: $text-minor;
          padding: 10px;
          cursor: pointer;
          &:hover {
            color: $text-main;
          }
          .el-icon-edit {
            margin-right: 5px;
          }
        }
        .fade-enter-active, fade-leave-active {
          transition: opacity 0.5s;
        }
        .fade-enter, .fade-leave-to {
          opacity: 0;
        }
        .input-wrapper {
          padding: 10px;
          .gray-bg-input, .el-input__inner {
            /*background-color: #67C23A;*/
          }
          .btn-control {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding-top: 10px;
            .cancel {
              font-size: 16px;
              color: $text-normal;
              margin-right: 20px;
              cursor: pointer;
              &:hover {
                color: $text-333;
              }
            }
            .confirm {
              font-size: 16px;
            }
          }
        }
      }
    }
  }
</style>

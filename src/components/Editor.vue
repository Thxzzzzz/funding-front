<template>
  <div>
    <div ref="editor"
         style="text-align:left"></div>
  </div>
</template>

<script>
import E from 'wangeditor'
import { uploadImage } from '/api/index'

export default {
  name: 'editor',
  // model: {
  //   prop: 'content',
  //   event: 'change'
  // },
  props: {
    catchData: Function,
    initContent: String,
    value: String
  },
  data () {
    return {
      editor: {}
    }
  },
  watch: {
    initContent (val) {
      this.editor.txt.html(this.initContent)
      // console.log(val)
      // this.editor.txt.html(val)
      // this.$emit('input', val)
      // this.$emit('update:text', this.editor.txt.text())
      // this.$emit('get-text', this.editor.txt.text())
    }
  },
  methods: {
    input (val) {
      console.log('input')

      console.log(val)
    },
    getContent: function () {
      alert(this.editorContent)
    },
    _uploadFile (urlReceiver, file) {
      let params = new FormData()
        // 通过append向form对象添加数据
      params.append('file', file)
      uploadImage(params).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted () {
    this.editor = new E(this.$refs.editor)
    this.editor.customConfig.onchange = html => {
      // this.value = html
      // this.content = html
      // this.catchData(html)  // 把这个html通过catchData的方法传入父组件
      this.$emit('input', html)
      // this.$emit('update:text', this.editor.txt.text())
    }
    this.editor.customConfig.customUploadImg = function (files, insert) {
      // files 是 input 中选中的文件列表
      // insert 是获取图片 url 后，插入到编辑器的方法
      let params = new FormData()
        // 通过append向form对象添加数据
      params.append('file', files[0])
      uploadImage(params).then(res => {
        console.log(res)
            // 上传代码返回结果之后，将图片插入到编辑器中
        let imgUrl = res.data
        insert(imgUrl)
      }).catch(err => {
        console.log(err)
      })
    }
    this.editor.create()
    this.editor.txt.html(this.initContent)
  }
}
</script>

<style scoped>
</style>

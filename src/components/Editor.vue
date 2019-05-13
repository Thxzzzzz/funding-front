<template>
  <div>
    <div ref="editor"
         style="text-align:left"></div>
  </div>
</template>

<script>
import E from 'wangeditor'

export default {
  name: 'editor',
  props: ['catchData'],
  data () {
    return {
      editorContent: ''
    }
  },
  methods: {
    getContent: function () {
      alert(this.editorContent)
    }
  },
  mounted () {
    var editor = new E(this.$refs.editor)
    editor.customConfig.onchange = html => {
      this.editorContent = html
      // this.content = html
      this.catchData(html)  // 把这个html通过catchData的方法传入父组件
    }
    editor.customConfig.customUploadImg = function (files, insert) {
      // files 是 input 中选中的文件列表
      // insert 是获取图片 url 后，插入到编辑器的方法

      // 上传代码返回结果之后，将图片插入到编辑器中
      let imgUrl = ''
      insert(imgUrl)
    }
    editor.create()
  }
}
</script>

<style scoped>
</style>

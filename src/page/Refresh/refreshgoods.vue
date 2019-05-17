<template>

</template>
<script>
export default {
  data () {
    this.$router.push({
      path: '/goods',
      query: {
        name: this.$route.query.name
      }
    })
    return {
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  
</style>

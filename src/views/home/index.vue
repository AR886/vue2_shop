<template>
  <div>
    <el-button type="primary" size="default" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'home',
  methods: {
    logout() {
      // 清除token
      sessionStorage.clear('TOKEN')
      // 跳转到登录页
      this.$router.push('/login')
      this.$message({ type: 'success', message: '退出成功' })
    }
  }
}
</script>

<style lang="less" scoped></style>

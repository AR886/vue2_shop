<template>
  <!-- 面包屑 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{ firstMenu }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ secondMenu }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'Crumbs',
  props: ['firstMenu', 'secondMenu']
}
</script>

<style lang="less" scoped></style>

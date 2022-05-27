<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <div class="header_title">
        <img src="@/assets/yunnan.gif" alt="" />
        <router-link to="/users/manage"><span class="title">电商系统后台管理</span></router-link>
      </div>
      <el-button type="info" size="default" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左侧列表 @open="handleOpen" @close="handleClose" -->
      <el-aside :width="fold ? '64px' : '200px'">
        <!-- 折叠按钮 -->
        <div class="fold" @click="toggleFold">|||</div>
        <el-menu :default-active="$route.path" class="el-menu-vertical-demo" background-color="#333744" text-color="#fff" active-text-color="#409eff" :collapse="fold" :collapse-transition="false" router>
          <!-- 一级菜单 -->
          <el-submenu :index="menu.id + ''" v-for="menu in leftMenus" :key="menu.id">
            <template slot="title">
              <i :class="icon[menu.id]"></i>
              &nbsp;&nbsp;
              <span>{{ menu.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="`/${menu.path}/${subMenu.path}`" v-for="subMenu in menu.children" :key="subMenu.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subMenu.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'home',
  data() {
    return {
      // 左侧菜单列表一级图标
      icon: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao-xianxing'
      },
      // 折叠属性切换
      fold: false
    }
  },
  methods: {
    // 退出登录
    logout() {
      // 清除token
      sessionStorage.clear('TOKEN')
      // 跳转到登录页
      this.$router.push('/login')
      this.$message({ type: 'success', message: '退出成功' })
    },
    toggleFold() {
      this.fold = !this.fold
    }
  },
  mounted() {
    // 获取左侧菜单列表
    this.$store.dispatch('getLeftMenus')
  },
  computed: {
    ...mapState({
      leftMenus: (state) => state.Home.leftMenus
    })
  }
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header_title {
    font-size: 26px;
    height: 100%;
    line-height: 60px;
    margin-left: 50px;
    display: flex;
    align-items: center;
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 20px;
    }
    .title {
      display: inline-block;
      height: 100%;
      color: #ddd;
    }
  }
}
.el-aside {
  background-color: #333744;
  .fold {
    background-color: #727272;
    text-align: center;
    height: 26px;
    line-height: 26px;
    cursor: pointer;
  }
  .el-menu {
    border: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
</style>

<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="@/assets/yunnan.gif" alt="" />
      </div>
      <!-- 登录表单 -->
      <div class="login_form">
        <el-form label-width="80px" size="normal" :model="loginForm" :rules="rules" ref="loginFormRef">
          <el-form-item label="用户名:" prop="username">
            <el-input placeholder="请输入用户名" prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码:" prop="password">
            <el-input placeholder="请输入密码" prefix-icon="el-icon-lock" v-model="loginForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      // 收集登录表单数据
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 验证规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置按钮 重置表单
    reset() {
      // 清除数据
      // Object.assign(this._data, this.$options.data())
      this.$refs.loginFormRef.resetFields()
    },
    // 登录按钮
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (valid) {
          const result = await this.$store.dispatch('login', this.loginForm)
          if (result === 'ok') {
            this.$message({ type: 'success', message: '登录成功' })
            // 获取用户的token 进行会话存储
            const token = this.$store.state.Login.info.token
            sessionStorage.setItem('token', token)
            // 路由跳转
            this.$router.push('/users/manage')
          } else {
            this.$message({ type: 'error', message: '登录失败' })
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  .login_box {
    width: 35%;
    height: 45%;
    background-color: rgb(79, 107, 148);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 15px;
    .avatar_box {
      width: 30%;
      height: 45%;
      border-radius: 50%;
      background-color: #eee;
      padding: 10px;
      box-shadow: 0 0 10px #ccc;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .login_form {
      width: 90%;
      height: 55%;
      position: absolute;
      bottom: 2%;
      box-sizing: border-box;
      .btns {
        display: flex;
        justify-content: flex-end;
      }
      /deep/ .el-form-item__label {
        color: white;
        font-size: 16px;
      }
    }
  }
}
</style>

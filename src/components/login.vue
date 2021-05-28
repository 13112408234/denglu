<template>
  <div class="login-style">
    <div class="login-box">
      <el-form class="login-form" :model="form" :rules="rules" ref="loginform">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user-solid"
            v-model="form.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-s-goods"
            v-model="form.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="el-form-item-button">
          <el-button type="primary" @click="loginyz">登录</el-button>
          <el-button type="info" @click="chozhi" class="el-form-item1"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { loginnet } from "@/network/home";
export default {
  data() {
    return {
      form: {
        //用户存放账号密码变量
        username: "admin",
        password: "123456",
      },
      //表单验证提示信息
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 11个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 11个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    chozhi() {
      //使用resetFields进行重置
      this.$refs.loginform.resetFields();
    },
    //登录验证
    loginyz() {
      //形参valid是个布尔值，根据登录表单规则进行验证，通过为true，不通过为flase
      this.$refs.loginform.validate(async (valid) => {
        if (!valid) return;
        loginnet(this.form.username, this.form.password).then((res) => {
          if (res.meta.status !== 200)
            return this.$message.error("账号密码错误");
          this.$message.success("登录成功");
          //1.登录网站才能访问其他页面，在会话期间将token保存在sessionStorage中，
          window.sessionStorage.setItem("token", res.data.token);
          //2.登录成功跳转到主页
          this.$router.push("/home");
        });
      });
    },
  },
};
</script>
<style scoped>
.login-style {
  height: 100%;
  width: 100%;
  background-color: rgb(12, 21, 61);
}
.login-box {
  width: 450px;
  height: 450px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.login-form {
  position: relative;
  padding: 90px 40px;
}
.el-form-item-button {
  padding: 20px 100px;
  position: relative;
}
.el-form-item1 {
  position: absolute;
  right: 0px;
}
</style>

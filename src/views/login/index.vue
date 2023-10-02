<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">后台登录</h3>
        <!--
        <div class="login_header">
          <a @click="cur=true" :class="{active:cur==true}">密码登录</a>
          <a @click="cur=false" :class="{active:cur==false}">短信登录</a>
        </div>-->
      </div>
      <div class="login_content">
        <div v-show="cur==true" class="body">
          <el-form-item prop="phone">
            <span class="svg-container">
              <svg-icon icon-class="phone" />
            </span>
            <el-input
              ref="phone"
              v-model="loginForm.phone"
              placeholder="手机号"
              name="phone"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
          </el-form-item>
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="密码"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </div>

        <div v-show="cur==false" class="body">
          <el-form-item prop="name">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="name"
              v-model="getCodeForm.name"
              placeholder="用户名(姓名)"
              name="name"
              type="text"
              tabindex="1"
              auto-complete="on"
              @input="IsNameValid()"
            />
          </el-form-item>
          <el-form-item prop="phone">
            <span class="svg-container">
              <svg-icon icon-class="phone" />
            </span>
            <el-input
              ref="phone"
              v-model="getCodeForm.phone"
              placeholder="手机号"
              name="phone"
              type="text"
              tabindex="1"
              auto-complete="on"
              @input="IsPhoneValid()"
            />
          </el-form-item>
          <el-form-item v-if="NameValid && PhoneValid" prop="verifyCode">
            <el-row type="flex" style="height:47px">
              <span class="svg-container">
                <svg-icon icon-class="message" />
              </span>
              <el-col :span="18">
                <el-input
                  ref="verifyCode"
                  v-model="loginForm.verifyCode"
                  placeholder="验证码"
                  name="verifyCode"
                  type="text"
                  tabindex="3"
                  auto-complete="on"
                />
              </el-col>
              <el-col :span="8">
                <el-button
                  :loading="sending"
                  :disabled="!(NameValid && PhoneValid && timer==0)"
                  type="primary"
                  style="width:100%;margin-top:3px;"
                  @click.native.prevent="handleGetCode"
                >{{ sendButtonText }}</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </div>
      </div>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<script>
import { validName, validPhone, validPassword, validVerifyCode } from '@/utils/validate'
// import { loginByPassword, loginByVerifyCode, getCode }
import { getToken } from "@/utils/auth";
import Cookie from "js-cookie";
import moment from "moment";

export default {
  name: 'Login',
  data() {
    const validateName = (rule, value, callback) => {
      if (!validName(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!validPassword(value)) {
        callback(new Error('请输入正确的密码'))
      } else {
        callback()
      }
    }
    const validateVerifyCode = (rule, value, callback) => {
      if (!validVerifyCode(value)) {
        callback(new Error('验证码错误'))
      } else {
        callback()
      }
    }
    return {
      getCodeForm: {
        name: '',
        phone: ''
      },
      loginForm: {
        name: '',
        phone: '',
        password: '',
        verifyCode: ''
      },
      loginRules: {
        name: [{ required: true, trigger: 'blur', validator: validateName }],
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        verifyCode: [{ required: true, trigger: 'blur', validator: validateVerifyCode }]
      },
      cur: false,
      loading: false,
      sending: false,
      NameValid: false,
      PhoneValid: false,
      sendDisabled: true,
      timer: 0,
      passwordType: 'password',
      redirect: undefined
    }
  },
  computed: {
    sendButtonText() {
      if (this.timer === 0) {
        return "发送验证码";
      } else {
        return `${this.timer}秒后重发`;
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    },

    timer(num) {
      if (num > 0) {
        setTimeout(() => {
          this.timer = --num;
        }, 1000);
      }
    },
  },

  created() {
    const lastSendTime = Cookie.get("last-send-time");
    if (lastSendTime) {
      const timer = 60 - moment().diff(moment(lastSendTime), "seconds");
      this.timer = timer > 0 ? timer : 0;
    }
  },

  methods: {
    IsNameValid(){
      this.loginForm.name = this.getCodeForm.name;
      this.$refs.loginForm.validateField('name', (nameError) => {
        if(!nameError){
          this.NameValid = true;
          // console.log(this.NameValid)
        }
      })
    },

    IsPhoneValid() {
      this.loginForm.phone = this.getCodeForm.phone;
      this.$refs.loginForm.validateField('phone', (phoneError) => {
        if(!phoneError){
          this.PhoneValid = true;
          // console.log(this.PhoneValid)
        }
      })
    },
      
    handleGetCode() {  
      console.log(this.loginForm)
      console.log(this.getCodeForm)
      this.$store
        .dispatch("user/getCode", this.getCodeForm)
          .then(() => {
            this.sending = true;
            this.$message({
              type: "success",
              message: "验证码已发送！"
            })
            Cookie.set("last-send-time", new Date());
            this.timer = 60;
          })
          .catch(() => {
            console.log("错误");
          })
          .finally(() => (this.sending = false));
    },

    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    
    //登录
    handleLogin() {
      if (this.cur) {
        this.$refs.loginForm.validateField('password', (passwordError) => {
        if(!passwordError){
            console.log('登录中')
            this.loading = true
            this.$store.dispatch('user/loginByPassword', this.loginForm)
              .then(() => {
                // console.log(this.$store.uesr.token)
                console.log('你好')
                this.$router.push({ path: this.redirect || '/' })
                this.loading = false
              }).catch(() => {
                this.loading = false
              })
          } else {
            console.log('loginByPassword信息有误')
            return false
          }
        })
      } else {
        // console.log(this.getCodeForm)
        this.loginForm.name = this.getCodeForm.name;
        this.loginForm.phone = this.getCodeForm.phone;
        // console.log(this.loginForm)
        this.$refs.loginForm.validateField('verifyCode', (verifyCodeError) => {
          if(!verifyCodeError){
            console.log('登录中')
            this.loading = true
            delete this.loginForm.password
            console.log(this.loginForm)
            this.$store.dispatch('user/loginByVerifyCode', this.loginForm)
              .then(() => {
                this.$router.push({ path: this.redirect || '/' })
                this.loading = false
              }).catch(() => {
                this.loading = false
              })
          } else {
            console.log('loginByVerifyCode信息有误')
            return false
          }
        })  
      }
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 80px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  a{
	color: #fff;
  margin: 50px;
  }

  .login_header{
    margin-bottom: 30px;
    text-align: center;
  }

  .login_header span{
    margin-right: 20px;
    cursor: pointer;
  }

  .body{
    border: 0px solid #999;
    overflow: hidden;
  }

  .active{
      color:#fff;
      padding-bottom: 10px;
      border-bottom: 3px solid #fff;
  }
}
</style>
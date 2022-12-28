<template>
  <div class="login-mobile-contain">
    <div class="login-contaion flex-c flex-c-center">
      <div class="contain-topbg flex flex-center flex-c flex-c-center">
        <img class="logo-img" src="@/assets/logo.png" alt="" />
        <div class="logo-text">EIP信息化系统</div>
      </div>
      <div style="width: 90%;">
        <div class="login-form">
          <div style="border-bottom: 1px solid #ddd; padding-bottom: 0.3rem;">
            <div class="userName">账号：</div>
            <input v-model="loginForm.username" placeholder="请输入用户名" />
          </div>
          <div style="border-bottom: 1px solid #ddd; padding-bottom: 0.3rem;">
            <div class="password">密码：</div>
            <input v-model="loginForm.password" type="password" placeholder="请输入密码" />
          </div>
          <div style="padding: 0.3rem 0 0.6rem 0; border-bottom: 1px solid #ddd;">
            <div class="password">系统：</div>
            <RePick v-model="loginForm.systemId" :list="devSystemList" @changeAll="handleSystem" isUseSlot clearable isShowSearch>
              <div class="flex sbt flex-c-center">
                <div>
                  <span v-if="loginForm.systemId">{{loginForm.systemTitle}}</span>
                  <span v-else>请选择</span>
                </div>
                <van-icon name="arrow" />
              </div>
            </RePick>
          </div>
          <div style="padding-top: 0.3rem;">
            <div class="password">本地调试人员：</div>
            <RePick v-model="loginForm.devUserId" :list="devUserList" @changeAll="handleDevUser" isUseSlot clearable>
              <div class="flex sbt flex-c-center">
                <div>
                  <span v-if="loginForm.devUserId">{{loginForm.devUserTitle}}</span>
                  <span v-else>请选择</span>
                </div>
                <van-icon name="arrow" />
              </div>
            </RePick>
          </div>
        </div>
        <div class="whiteSpace"></div>
        <van-button type="info" style="width: 100%" @click="handleLogin" loading-text="登录中...">登录</van-button>
        <!-- <RePick v-model="value" multiple :list="systemList" isValueHidden></RePick> -->
        <!-- <van-cell-group>
          <RePick v-model="loginForm.systemId" :list="systemList" isUseSlot @changeAll="haadleDemo">
            <van-cell title="系统" :value="title" is-link/>
          </RePick>
          <RePick v-model="loginForm.systemId" :list="systemList" isUseSlot @changeAll="haadleDemo">
            <van-cell title="系统" :value="title" is-link/>
          </RePick>
        </van-cell-group> -->
        <!-- <pre>单选：{{loginForm.systemId}}</pre>
        <pre>多选：{{value}}</pre> -->
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    RePick: () => import('@/components/ReComponents/RePick')
  },
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        systemId: 1,
        systemTitle: '',
        devUserId: window.localStorage.getItem('AXIOS_JOINEAST_TARGET') || 'all',
        devUserTitle: ''
      },
      systemInfo: {}
    }
  },
  computed: {
    ...mapGetters(['devSystemList', 'devUserList'])
  },
  methods: {
    ...mapActions('develop', ['developLogin']),

    handleLogin() {
      if (!this.loginForm.username) {
        this.$fm('账号不可为空！')
        return
      }
      if (!this.loginForm.password) {
        this.$fm('密码不可为空！')
        return
      }
      this.$loading(true)
      this.developLogin({
        vm: this,
        username: this.loginForm.username,
        password: this.loginForm.password,
        devUserId: this.loginForm.devUserId,
        devUserTitle: this.loginForm.devUserTitle,
        currentSystemObj: this.systemInfo
      }).then(() => {
        this.$router.push({ path: '/home' }).then(() => {
          this.$loading(false)
        })
      }).catch(() => {
        this.$loading(false)
      })
    },
    handleSystem(val) {
      // console.log(val)
      this.systemInfo = val
      // this.loginForm.systemTitle = val.map(item => item.title || item).join('、')
      this.loginForm.username = val.mobile
      this.loginForm.password = val.pwd
      this.loginForm.systemTitle = val.title
    },
    handleDevUser(val) {
      this.loginForm.devUserTitle = val.title
    }
  }
}
</script>

<style lang="scss" scoped>
@import './login.scss';
</style>

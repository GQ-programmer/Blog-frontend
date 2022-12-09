<template>
  <div style="width: 315px;margin: 0 auto;padding-top: 80px">
    <a-form
        :style="{width:'320px'}"
        :model="formState"
        name="normal_login"
        class="login-form"
        layout="horizontal"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
    >
      <a-form-item >
        <div align="center">
          <img :src="logoGray" draggable="false" style="width: 80px;margin-bottom: 5px">
          <p style="color: grey">个人博客</p>
        </div>
      </a-form-item>
      <a-divider style="color:#1890ff;">账号密码登录</a-divider>
      <a-form-item

          name="username"
          :rules="[{ required: true, message: 'Please input your username!' }]"
      >
        <a-input v-model:value="formState.username"  placeholder="用户名:">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
          name="password"
          :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <a-input-password v-model:value="formState.password" placeholder="密码:">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item>
        <a-form-item name="remember" no-style>
          <a-checkbox v-model:checked="formState.remember">记住我</a-checkbox>
        </a-form-item>
        <a class="login-form-forgot" href="" style="float: right">忘记密码?</a>
      </a-form-item>

      <a-form-item>
        <a-button  block type="primary" html-type="submit" @click="login()" class="login-form-button">
          登录
        </a-button>

        <!--        Or-->
        <!--        <a href="">register now!</a>-->
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import logoGray from "../assets/logo-white.png"
import { reactive, computed } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import {Toast} from "vant";
import {useRouter} from "vue-router";
interface FormState {
  username: string;
  password: string;
  remember: boolean;
}
const router = useRouter()
const formState = reactive<FormState>({
  username: '',
  password: '',
  remember: true,
});
const onFinish = (values: any) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
const disabled = computed(() => {
  return !(formState.username && formState.password);
});
const login = () => {
  Toast.success("登录成功!")
  router.push('/home')
}
</script>

<style scoped>

</style>
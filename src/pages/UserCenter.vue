<template>
  <div class="user-center-container" v-if="user">
    <div class="center-pageheader">
      <div style="float: left;margin-left: 15px" @click="back()">
        <a style="color: black">
          <left-outlined style="font-size: 23px;color:grey ;margin-top: 18px"/>
        </a>
      </div>
      <div style="float: left;font-size:16px;margin-top: 15px;margin-left: 5px">
        <div style="display: inline;color:grey ;">返回</div>
      </div>
      <div style="float: left;font-size:16px;margin-top: 18px;margin-left: 344px">
        <div style="display: inline;">个人主页</div>
      </div>
    </div>
    <div>
      <div class="a-col-left" >

        <a-col  :span="24" style="text-align: center">
          <a-avatar :size="64" v-if="!user.avatarUrl">
            <template #icon>
              <UserOutlined/>
            </template>
          </a-avatar>
          <a-avatar  :size="64" :src="user.avatarUrl" v-if="user.avatarUrl" />
        </a-col>
        <a-col  :span="24" style="text-align: center;margin-top: 10px">
          <a-typography-title :level="4">{{user.username}}</a-typography-title>
        </a-col>
        <a-col   :span="24" style="text-align: center">
          <a-typography-text type="secondary" v-show="user.description === ''">这个人很懒，没有个性签名~</a-typography-text>
          <a-typography-text type="secondary" v-show="user.description !== ''">{{user.description}}</a-typography-text>
        </a-col>
        <a-col  class="a-col" :span="24" style="margin-top: 20px;">
          <mail-outlined />
          <a-typography-text v-show="user.email === ''">&nbsp;邮箱：未设置</a-typography-text>
          <a-typography-text v-show="user.email !== ''">&nbsp;邮箱：{{user.email}}</a-typography-text>
        </a-col>
        <a-col  class="a-col" :span="24" style="">
          <home-outlined />
          <a-typography-text v-show="user.area === ''">&nbsp;地区：未设置</a-typography-text>
          <a-typography-text v-show="user.area !== ''">&nbsp;地区：{{user.area}}</a-typography-text>
        </a-col>
        <a-col  class="a-col" :span="24" style="">
          <profile-outlined />
          <a-typography-text v-show="user.birthday === ''">&nbsp;出生日期：未设置</a-typography-text>
          <a-typography-text v-show="user.birthday !== ''">&nbsp;出生日期：{{user.birthday}}</a-typography-text>
        </a-col>
        <a-col  class="a-col" :span="24" style="">
          <user-outlined />
          <a-typography-text v-show="user.gender === ''">&nbsp;性别：未设置</a-typography-text>
          <a-typography-text v-show="user.gender !== ''">&nbsp;性别：{{user.gender}}</a-typography-text>
        </a-col>
        <a-divider />
        <a-col   :span="24" style="margin-left: 10px">
          标签
        </a-col>
        <a-col   :span="24" style="margin-left: 10px;margin-top: 10px">
          <a-tag>Tag 1</a-tag>
          <a-tag>Tag 1</a-tag>
          <a-tag>Tag 1</a-tag>
          <a-tag>Tag 1</a-tag>
        </a-col>
      </div>

      <div class="a-col-right" >
        <a-tabs
            v-model:activeKey="activeKey"
            tabPosition="left"
            :style="{ height: '730px' }"
            @tabScroll="callback"
        >
          <a-tab-pane class="tab-item" key="1" :tab="`基本设置`">
            <div style="border: red 1px ">
              <div style="font-size: 18px; margin-left: 15px">
                基本设置
              </div>
              <div style="text-align: center; margin-top: 10px;">
                <a-avatar :size="64" v-if="!formState.avatarUrl">
                  <template #icon>
                    <UserOutlined/>
                  </template>
                </a-avatar>
                <a-avatar  :size="64" :src="formState.avatarUrl" v-if="formState.avatarUrl" />
              </div>

              <div style="text-align: center;margin-top: 10px;">
                <a-upload
                    v-model:file-list="fileList"
                    name="file"
                    :progress="progress"
                    :custom-request="handleChange"
                    :before-upload="beforeUpload"
                >
                  <a-button>
                    <upload-outlined></upload-outlined>
                    上传头像
                  </a-button>
                </a-upload>
              </div>
              <a-divider />
              <div style="padding-right: 56px;padding-left: 58px;background-color: white;width: 468px;padding-bottom: 5px">
                <a-form
                    :model="formState"
                    v-bind="layout"
                    name="nest-messages"
                    @finish="onFinish"
                >
                  昵称
                  <a-form-item :name="['username']"  :rules="[{ required: true }]">
                    <a-input v-model:value="formState.username" placeholder="请输入"/>
                  </a-form-item>
                  性别
                  <a-form-item
                      name="select"
                  >
                    <a-select v-model:value="formState.gender" placeholder="请选择性别">
                      <a-select-option value="男">男</a-select-option>
                      <a-select-option value="女">女</a-select-option>
                    </a-select>
                  </a-form-item>
                  邮箱
                  <a-form-item :name="[ 'email']"  :rules="[{ type: 'email' }]">
                    <a-input v-model:value="formState.email" placeholder="请输入"/>
                  </a-form-item>
                  个性签名
                  <a-form-item style="width: 500px;height: 40px" :name="[ 'description']" >
                    <a-textarea  v-model:value="formState.description" placeholder="小于25字"/>
                  </a-form-item>
                  出生日期
                    <a-form-item name="birthday" :rules="[{ type: 'string' , required: true, message: '请选择日期!' }]">
                      <a-date-picker  v-model:value="formState.birthday" value-format="YYYY-MM-DD" placeholder="请选择日期"/>
                    </a-form-item>
                  所在地区
                  <div>
                    <a-form-item   :name="['area']" >
                        <a-input v-model:value="formState.area" placeholder="地区"/>
                    </a-form-item>
                  </div>
                  <a-form-item >
                    <a-button type="primary" html-type="submit" @click="doUpdateUser">提交</a-button>
<!--                    <a-button @click="countDown">5s前往主页</a-button>-->
                  </a-form-item>
                </a-form>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="`安全设置`">
            <div style="border: red 1px ">
              <div style="font-size: 18px; margin-left: 15px">
                 安全设置
              </div>
              <div style="margin-left: 15px;margin-top: 30px">
                修改密码
              </div>
              <div style="margin-left: 15px;margin-top: 30px">
                <a-form
                    :model="updatePsdFormState"
                    name="basic"
                    :label-col="{ span: 8 }"
                    :wrapper-col="{ span: 16 }"
                    autocomplete="off"
                    style="margin-left: 20px"
                >
                  原始密码
                  <a-form-item
                      name="oldPassword"
                      :rules="[{ required: true, message: '请输入原始密码!' }]"
                  >
                    <a-input-password v-model:value="updatePsdFormState.oldPassword" placeholder="请输入原始密码"/>
                  </a-form-item>
                  新密码
                  <a-form-item
                      name="newPassword"
                      :rules="[{ required: true, message: '请输入新密码' }]"
                  >
                    <a-input-password v-model:value="updatePsdFormState.newPassword" placeholder="请输入新密码"/>
                  </a-form-item>
                  确认密码
                  <a-form-item
                      name="checkPassword"
                      :rules="[{ required: true, message: '请输入密码' }]"
                  >
                    <a-input-password v-model:value="updatePsdFormState.checkPassword" placeholder="请确认密码"/>
                  </a-form-item>

                  <a-form-item style="margin-left: 0px">
                    <a-button type="primary" html-type="submit" @click="doUpdatePassword">提交</a-button>
                  </a-form-item>
                </a-form>
              </div>

            </div>
          </a-tab-pane>
          <a-tab-pane key="3" :tab="`私信`">
            <div style="border: red 1px ">
              <div style="font-size: 18px; margin-left: 15px">
                私信
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
        <!-- 页脚 -->
        <div style="background-color: #f5f6f7; height: 30px"></div>
      </div>
    </div>


  </div>

</template>

<script lang="ts" setup>
import "dayjs/locale/zh-cn";
import {MailOutlined,HomeOutlined,ProfileOutlined,UploadOutlined,UserOutlined,LeftOutlined} from '@ant-design/icons-vue';
import {h, onMounted, reactive, ref} from "vue";
import {routerKey, useRoute, useRouter} from "vue-router";
import myAxios from "../plugins/myAxios";
import {message, Modal, UploadChangeParam, UploadProps} from "ant-design-vue";
import getCOS from "../config/getcosobj";
import {v4 as uuidv4} from "uuid";
const route = useRoute()
const listData: Record<string, string>[] = [];
const user = ref()
const router = useRouter()
const fileList = ref([]);
// 地区下拉框索引
const areaIndex = ref(0)
const activeKey = ref('1')
const activeKeySafety = ref('1')


const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
interface FormState {
    id:number,
    username: string,
    avatarUrl:string,
    email: string,
    description: string,
    area:string,
    birthday: string,
    gender:string
}
const formState = reactive<FormState>({
    id: 0,
    username: '',
    avatarUrl:'',
    email: '',
    description: '',
    area:'',
    birthday: '',
    gender: '',

});
interface UpdatePasswordFormState {
  id:number,
  oldPassword: string,
  newPassword:string,
  checkPassword:string
}
const updatePsdFormState = reactive<UpdatePasswordFormState>({
  id:0,
  oldPassword: '',
  newPassword:'',
  checkPassword:''
});

const initFormState = ()=> {
    formState.id = user.value.id;
    formState.avatarUrl = user.value.avatarUrl;
    formState.username = user.value.username;
    formState.gender = user.value.gender;
    formState.email = user.value.email;
    formState.description = user.value.description;
    formState.birthday = user.value.birthday;
    formState.area = user.value.area;
    //
    updatePsdFormState.id = user.value.id
}
const doUpdatePassword = async () => {
  if (updatePsdFormState.oldPassword.length < 4 || updatePsdFormState.oldPassword.length > 12){
    message.warn("密码长度在4~12位")
    return;
  }
  if (updatePsdFormState.newPassword.length < 4 || updatePsdFormState.newPassword.length > 12){
    message.warn("密码长度在4~12位")
    return;
  }
  if (updatePsdFormState.newPassword === updatePsdFormState.oldPassword){
    message.warn("新密码和旧密码一致")
    return;
  }if (updatePsdFormState.checkPassword !== updatePsdFormState.newPassword){
    message.warn("两次输入密码不一致")
    return;
  }
  const res = await myAxios.post("/user/updatePsd", updatePsdFormState)
  if (res.code === 0 && res.data !== null){
    updatePsdSuccess()
  }else {
    message.error(`${res.description}`)
  }

}
/**
 * 修改密码成功confirm
 */
const updatePsdSuccess = () => {
  Modal.success({
    title: '修改密码成功！',
    content: `将前往主页重新登录`,
    okText:'确定',
    style:"top: 20px",
    onOk: () => {
      // 点击立即前往
      // 页面先回到顶部
      window.scrollTo(0,0)
      setTimeout(()=>{
        router.replace("/")
      }, 300)
      return;
    }
  });
};

const onFinish = (values: any) => {
  console.log('Success:', values);
};

const doUpdateUser = async () => {
  if (formState.username.length < 3 || formState.username.length > 8) {
    message.warn("昵称3~8位!");
    return;
  }
  if (formState.description !== null && formState.description.length > 25) {
    message.warn("个性签名小于25位!");
    return;
  }
  if (formState.area !== null &&formState.area.length > 10) {
    message.warn("地区小于10位!");
    return;
  }
  const res = await myAxios.post('/user/update', formState)
  if (res.code === 0 && res.data !== null){
    countDown()
  }else {
    message.error(`${res.description}`)
  }
}

/**
 * 请求当前登录用户数据
 */
onMounted(async () => {
  const res = await myAxios('/user/current')
  if (res.code === 0 && res.data !== null){
    user.value = res.data
  }else {
    console.log("请求数据为空!")
    message.error('未登录!')
    router.replace('/')
  }
  initFormState()
})

/**
 * 上传头像
 * @param options
 */
const handleChange = (options: File) => {
  // options.onProgress({ percent: Math.round(10).toFixed(2) }, file);
  // 将imgUrl置空
  console.log(options);
  let imgUrl_suffix = options.file.name.split('.')[1] ;
  let cos = getCOS();
  cos.putObject({
    Bucket: 'zgq-icu-2002-1313043931', /* 填入您自己的存储桶，必须字段 */
    Region: 'ap-shanghai',  /* 存储桶所在地域，例如ap-beijing，必须字段 */
    Key: uuidv4() + '.' + imgUrl_suffix,  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
    Body: options.file, /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */
    onProgress: function (progressData) {
      console.log(JSON.stringify(progressData));
    }
  }, function (err, data) {
    console.log(err || data);
    if (err) {
      message.warning("上传失败!")
    } else {
      message.success("上传成功!")
      setTimeout(() => { options.onSuccess() })    // 这样遍生效了
      // 保存图片上传地址
      console.log('https://' + data.Location);
      formState.avatarUrl = 'https://' + data.Location;
    }
  })

};
/**
 * 关闭confirm事件
 */
const countDown = () => {
  Modal.success({
    title: '修改信息成功！',
    content: `将前往主页重新登录`,
    okText:'确定',
    style:"top: 20px",
    onOk: () => {
      // 点击立即前往
      // 页面先回到顶部
      window.scrollTo(0,0)
      setTimeout(()=>{
        router.replace("/")
      }, 300)
    }
  });
};

/**
 * 图片上传前的校验
 * @param file
 */
const beforeUpload = (file: UploadProps['fileList'][number]) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
  if (!isJpgOrPng) {
    message.error('你只能上传图片格式文件!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('文件大小超过 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

const progress: UploadProps['progress'] = {
  strokeColor: {
    '0%': '#108ee9',
    '100%': '#87d068',
  },
  strokeWidth: 3,
  format: percent => `${parseFloat(percent.toFixed(2))}%`,
  class: 'test',
};

const back = () => {
  router.back();
}

</script>

<style scoped>
.user-center-container{
  margin:13px  auto 0;
  width: 900px;
  min-width: 967px;
}
.center-pageheader{
  width: 900px;
  height: 55px;
  background-color: white;
  margin-bottom: 10px;

}
.a-col-left{
  background-color: white;
  box-shadow: 15px 15px 20px -30PX black;
  margin-left: 0px;
  height: 500px;
  width: 300px;
  float: left;
  padding: 37px 10px 10px;
}
.a-col-right{
  background-color: white;
  margin-left: 28px;
  padding-top: 20px;
  width: 572px;
  height: 750px;
  float: left;
  box-shadow: 15px 15px 20px -30PX black;
}
.a-col{
  margin-top: 10px;
  margin-left: 40px;
}
textarea{
  resize: none;
}
:deep(.ant-tabs-left > .ant-tabs-content-holder > .ant-tabs-content > .ant-tabs-tabpane, .ant-tabs-left > div > .ant-tabs-content-holder > .ant-tabs-content > .ant-tabs-tabpane ){
  padding-left: 0px;
  padding-right: 20px;
}


</style>
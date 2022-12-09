<template>
  <div class="post-edit-container">
    <v-md-editor
        :include-level="[1,2,3,4]"
        v-model="text"
        height="680px"
        :disabled-menus="[]"
        default-show-toc="true"
        @copy-code-success="handleCopyCodeSuccess"
    ></v-md-editor>
  </div>
  <div>
    <a-button class="submit-btn" type="primary" shape="circle" @click="showModal">
      <template #icon><check-outlined /></template>
    </a-button>

    <a-modal v-model:visible="visible" width="700px" :maskClosable="false" ok-text="发布文章"
             cancel-text="取消" title="发布文章" :footer="null">

      <a-form :model="formState"
              name="basic"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              ref="formRef"
      >
        <a-form-item
            label="文章标题"
            name="title"
            :rules="[{ required: true, message: '请输入文章标题!' }]"
        >
          <a-input v-model:value="formState.title" placeholder="文章标题需超过5字"/>
        </a-form-item>
        <a-form-item
            name="description"
            label="摘要"
            :rules="[{ required: true, message: '请输入文章摘要!' }]"
        >
          <a-textarea v-model:value="formState.description" placeholder="摘要(必填):会在推荐、列表场景外露，帮助快速了解内容(需超过20字)" />
        </a-form-item>

        <a-form-item
            name="coverUrl"
            label="上传文章封面"
        >
          <a-upload
              v-model:file-list="fileList"
              name="avatar"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              :customRequest="doUpload"
              :before-upload="beforeUpload"
              @change="handleChange"
          >
            <img v-if="imageUrl" style="width: 100%" :src="`https://${imageUrl}`" alt="avatar" />
            <div v-else>
              <a-spin v-if="spinning" tip="UpLoading..." :spinning="spinning"/>
              <plus-outlined v-else></plus-outlined>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button style="margin-left: 40px" @click="closeModal">取消</a-button>
          <a-button style="margin-left: 20px" type="primary"  html-type="submit" @click="doPublish">发布文章</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
        v-model:visible="confirmVisible"
        title="Modal"
        ok-text="确认"
        cancel-text="取消"
        @ok="hideModal"
    >
      <p>是否前往首页...</p>
    </a-modal>
  </div>

</template>

<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue';
import {createVNode, getCurrentInstance, reactive, ref} from "vue";
import {CheckOutlined} from '@ant-design/icons-vue';
import {Form, message,Modal , UploadProps} from "ant-design-vue";
import { v4 as uuidv4 } from 'uuid';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

import COS from 'cos-js-sdk-v5';
import {useRouter} from "vue-router";
import myAxios from "../plugins/myAxios";

const useForm = Form.useForm;
const top = ref<number>(10);
const bottom = ref<number>(10);
const visible = ref<boolean>(false);
const confirmVisible = ref<boolean>(false);
const labelCol = { style: { width: '150px' }}
const wrapperCol = { span: 14 }

const fileList = ref([]);
const loading = ref<boolean>(false);
const imageUrl = ref<string>('');
const spinning = ref<boolean>(false)

const router = useRouter();

const getCOS = () => {
  // 初始化实例
  var cos = new COS({
    // getAuthorization 必选参数
    getAuthorization: function (options, callback) {
      // 初始化时不会调用，只有调用cos方法（比如cos.putObject）时才会进入
      // 异步获取临时密钥
      // 服务端 JS 和 PHP 例子：https://github.com/tencentyun/cos-js-sdk-v5/blob/master/server/
      // 服务端其他语言参考 COS STS SDK ：https://github.com/tencentyun/qcloud-cos-sts-sdk
      // STS 详细文档指引看：https://cloud.tencent.com/document/product/436/14048

      var url = 'http://127.0.0.1:8080/api/cos/getCredential'; // url替换成您自己的后端服务
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      // xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
      xhr.onload = function (e) {
        try {
          var data = JSON.parse(e.target.responseText);
          var credentials = data.credentials;
        } catch (e) {
        }
        if (!data || !credentials) {
          return console.error('credentials invalid:\n' + JSON.stringify(data, null, 2))
        };
        callback({
          TmpSecretId: credentials.tmpSecretId,
          TmpSecretKey: credentials.tmpSecretKey,
          SecurityToken: credentials.sessionToken,
          // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
          StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
          ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000000
        });
      };
      xhr.send();
    }
  });
  return cos;
}


const formState = reactive({
  title: '',
  description: '',
});

const text = ref('')

const handleCopyCodeSuccess = (code) => {
  console.log(code)
}

const showModal = () => {
  visible.value = true;
};

/**
 *  取消发布
 */
let {proxy} = getCurrentInstance();
const closeModal = () => {
  // 清空表单
  proxy.$refs['formRef'].resetFields();
  imageUrl.value = '';
  visible.value = false;
};
const showConfirm = () => {
  Modal.confirm({
    title: '是否前往首页?',
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode('div', { style: 'color:gray;' }, '否：再写一篇'),
    okText: '是',
    cancelText: '否',
    onOk() {
      router.replace('/')
    },
    onCancel() {
      console.log('否');
      text.value = '';
    },
    class: 'isGoIndex',
  });
};

/**
 *  发布文章
 */
const doPublish = async () =>{
  // 校验文章内容是否过短
  if (text.value.length < 30) {
    message.warning('文章内容过短,需超过30字!')
    return;
  }
  // 校验图片是否上传
  if (imageUrl.value == ''){
    message.warning('未上传图片!')
    return;
  }

  // 校验文章标题
  if (formState.title.length < 5) {
    message.warning('文章标题过短,需超过5字!')
    return;
  }
  // 校验文章摘要
  if (formState.description.length < 20) {
    message.warning('文章摘要过短,需超过20字!')
    return;
  }

  const res = await myAxios.post('/article/add',{
    title: formState.title,
    description: formState.description,
    coverUrl: imageUrl.value,
    content: text.value
  })
  if (res.code === 0 && res.data !== null) {
    message.success("发布成功!");
    proxy.$refs['formRef'].resetFields();
    imageUrl.value = '';
    visible.value = false;
    showConfirm();
  } else {
    message.error(`${res.description}`);
  }

}

/**
 * 上传图片到COS（自定义上传方法）
 * @param data
 */
const doUpload = (data:File) => {
  // 将imgUrl置空
  imageUrl.value = '';
  spinning.value = true;
  console.log(data);
  let imgUrl_suffix = data.file.name.split('.')[1];
  let cos = getCOS();
  cos.putObject({
    Bucket: 'zgq-icu-2002-1313043931', /* 填入您自己的存储桶，必须字段 */
    Region: 'ap-shanghai',  /* 存储桶所在地域，例如ap-beijing，必须字段 */
    Key: uuidv4()+'.'+imgUrl_suffix,  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
    Body: data.file, /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */
    onProgress: function(progressData) {
      console.log(JSON.stringify(progressData));
    }
  }, function(err, data) {
    console.log(err || data);
    if (err) {
      spinning.value = false;
      message.warning("上传失败!")
    }else {
      spinning.value = false;
      message.success("上传成功!")
      // 保存图片上传地址
      console.log(data.Location);
      imageUrl.value = data.Location;
    }
  });

}
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
};

</script>

<style scoped>
.post-edit-container{
  margin: 20px auto 0;
  width: 90%;
}
.submit-btn{
  position: fixed;
  right: 20px;
  bottom: 50px;
  width: 45px;height: 45px
}
</style>
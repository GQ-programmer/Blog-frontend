<template>
  <div class="post-edit-container">
    <div class="pageHeader">
      <div style="float: left;margin-left: 15px" @click="back()">
        <a style="color: black">
          <left-outlined style="font-size: 25px;margin-top: 18px"/>
        </a>
      </div>
      <div style="float: left;font-size:18px;margin-top: 15px;margin-left: 5px" >
        <div style="display: inline;">首页</div>
      </div>
      <div style="float: left;margin-top: 20px;margin-left: 120px">
        文章标题：
      </div>
      <div style="float: left; width: 50%;margin-top: 16px;">
        <a-input
            v-model:value="formState.title"
            style="border-radius: 20px"
            placeholder="请输入文章标题（5~30字）"
        />
      </div>
      <div style="float:left;margin-top:18px;margin-left:10px;font-size: 16px">
        <span>{{formState.title.length}}</span>/30
      </div>
      <div style="float: right;margin-top: 14px;margin-right: 40px">
        <a-avatar :size="35" v-if="user.avatarUrl !== ''" :src="user.avatarUrl" />
      </div>
      <div style="float: right;margin-top: 16px;margin-right: 40px">
        <a-button type="primary" shape="round" @click="showModal">发布文章</a-button>
      </div>

    </div>
    <v-md-editor
        class="v-md-editor"
        v-model="text"
        :include-level="[1,2,3,4]"
        height="82vh"
        :disabled-menus="[]"
        default-show-toc="true"
        @upload-image="handleUploadImage"
        @copy-code-success="handleCopyCodeSuccess"
    >
    </v-md-editor>
  </div>
  <div>
<!--  发布文章悬浮按钮  淘汰-->
<!--    <a-button class="submit-btn" type="primary" shape="circle" @click="showModal">-->
<!--      <template #icon>-->
<!--        <check-outlined/>-->
<!--      </template>-->
<!--    </a-button>-->
  </div>

<!--    // 发布文章模态框-->
    <a-modal v-model:visible="visible" width="700px" :closable="false" :maskClosable="false" ok-text="发布文章"
             title="发布文章" :footer="null">

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
          <a-textarea v-model:value="formState.description" style="height: 100px" placeholder="摘要(必填):会在推荐、列表场景外露，帮助快速了解内容(需超过10字)"/>
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
          >
            <img v-if="imageUrl" style="width: 100%" :src="`${imageUrl}`" alt="avatar"/>
            <div v-else>
              <a-spin v-if="spinning" tip="UpLoading..." :spinning="spinning"/>
              <plus-outlined v-else></plus-outlined>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button style="margin-left: 40px" shape="round" @click="closeModal">取消</a-button>
          <a-button style="margin-left: 20px" type="primary" shape="round" html-type="submit" @click="doPublish">发布文章</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
<!--    是否前往首页模态框-->
<!--    todo 后期优化是否前往文章详情页-->
    <a-modal
        v-model:visible="confirmVisible"
        title="Modal"
        ok-text="确认"
        cancel-text="取消"
        @ok="hideModal"
    >
      <p>是否前往首页...</p>
    </a-modal>
</template>

<script setup lang="ts">
import {PlusOutlined,SmileOutlined} from '@ant-design/icons-vue';
import {createVNode, getCurrentInstance, h, onMounted, reactive, ref} from "vue";
import {CheckOutlined,LeftOutlined } from '@ant-design/icons-vue';
import {Form, message, Modal, notification, UploadProps} from "ant-design-vue";
import {v4 as uuidv4} from 'uuid';
import {ExclamationCircleOutlined, CheckCircleOutlined} from '@ant-design/icons-vue';
import type { NotificationPlacement } from 'ant-design-vue';

import {useRoute, useRouter} from "vue-router";
import myAxios from "../plugins/myAxios";
import getCOS from "../config/getcosobj";
import getCurrentUser from "../plugins/user";


const useForm = Form.useForm;
const top = ref<number>(10);
const bottom = ref<number>(10);
const visible = ref<boolean>(false);
const confirmVisible = ref<boolean>(false);
const labelCol = {style: {width: '150px'}}
const wrapperCol = {span: 14}

const fileList = ref([]);
const loading = ref<boolean>(false);
const imageUrl = ref<string>('');
const spinning = ref<boolean>(false)

let { proxy } = getCurrentInstance()
const router = useRouter();
const route = useRoute();
const user = ref({})
const text = ref('')
const isReEdit = ref(false)
const articleId = ref(0)

const formState = reactive({
  title: '',
  description: '',
});


onMounted(async ()=> {
    let id = route.params.articleId;
    articleId.value = Number(id)
    if (id === '0') {
      // 发布文章
      openNotification('topLeft');
      const currentUser = await getCurrentUser()
      if (currentUser !== null) {
        user.value = currentUser;
      }
    } else {
      // 重新编辑文章
      const res = await myAxios.get('/article/get', {
        params:{
          articleId:articleId.value
        }
      })
      if (res.code === 0 && res.data !== null) {
        const article = res.data
        user.value = article.createUser
        text.value = article.content
        formState.title = article.title
        formState.description = article.description
        imageUrl.value = article.coverUrl
        isReEdit.value = true
      }
    }

})

const back = () => {
  router.back();
}

/**
 * 文章编辑器上传本地文件到服务器COS
 * @param event
 * @param insertImage
 * @param files
 */
const handleUploadImage = (event, insertImage, files) => {
  // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
  console.log(files);
  let imgUrl_suffix = files[0].name.split('.')[1];
  let cos = getCOS();
  cos.putObject({
    Bucket: 'zgq-icu-2002-1313043931', /* 填入您自己的存储桶，必须字段 */
    Region: 'ap-shanghai',  /* 存储桶所在地域，例如ap-beijing，必须字段 */
    Key: uuidv4() + '.' + imgUrl_suffix,  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
    Body: files[0], /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */
    onProgress: function (progressData) {
      console.log(JSON.stringify(progressData));
    }
  }, function (err, data) {
    console.log(err || data);
    if (err) {
      message.warning("上传失败!")
    } else {
      // 保存图片上传地址
      console.log('https://' + data.Location);
      // 此处只做示例
      insertImage({
        url: 'https://' + data.Location,
        desc: '',
        width: '200',
        height: 'auto',
      });
    }
  });

}

/**
 * 首次进入文章编辑弹出提示
 */
const openNotification = (placement: NotificationPlacement) => {
  notification.open({
    message: '温馨提示：',
    description:
        '文章内容超过30字，才可进行发布哦!',
    placement ,
    onClick: () => {
      console.log('Notification Clicked!');
    },
    icon: () => h(SmileOutlined, { style: 'color: #108ee9' }),

  });
};

const showModal = () => {
  visible.value = true;
};

/**
 *  取消发布
 */
const closeModal = () => {
  // 清空表单
  proxy.$refs['formRef'].resetFields();
  imageUrl.value = '';
  visible.value = false;
};
const showConfirm = (title:string) => {
  Modal.confirm({
    title: title,
    icon: createVNode(CheckCircleOutlined),
    // content: createVNode('div', {style: 'color:gray;'}, '否：再写一篇'),
    okText: '是',
    cancelText: '否',
    onOk() {
      router.replace('/')
    },
    onCancel() {
      console.log('否');
      text.value = '';
      formState.title = '';
      formState.description = '';
      imageUrl.value = '';
      router.replace({
        name:"PostEdit",
        params:{articleId:0}
      })
    },
    class: 'isGoIndex',
  });
};

/**
 *  发布文章
 */
const doPublish = async () => {
  // 校验文章内容是否过短
  if (text.value.length < 30) {
    message.warning('文章内容过短,需超过30字!')
    return;
  }
  // 校验图片是否上传
  if (imageUrl.value == '') {
    message.warning('未上传图片!')
    return;
  }

  // 校验文章标题
  if (formState.title.length < 5) {
    message.warning('文章标题过短,需超过5字!')
    return;
  }
  // 校验文章摘要
  if (formState.description.length < 10) {
    message.warning('文章摘要过短,需超过10字!')
    return;
  }
  if (isReEdit.value) {
    const res = await myAxios.post('/article/update', {
      id: articleId.value,
      title: formState.title,
      description: formState.description,
      coverUrl: imageUrl.value,
      content: text.value
    })
    if (res.code === 0 && res.data !== null) {
      proxy.$refs['formRef'].resetFields();
      imageUrl.value = '';
      visible.value = false;
      showConfirm("更新成功，是否前往主页？");
    } else {
      message.error(`${res.description}`);
    }
  }else {
    const res = await myAxios.post('/article/add', {
      title: formState.title,
      description: formState.description,
      coverUrl: imageUrl.value,
      content: text.value
    })
    if (res.code === 0 && res.data !== null) {
      proxy.$refs['formRef'].resetFields();
      imageUrl.value = '';
      visible.value = false;
      showConfirm("发布成功，是否前往主页？");
    } else {
      message.error(`${res.description}`);
    }
  }
}

/**
 * 上传文章封面图片到COS（自定义上传方法）
 * @param data
 */
const doUpload = (data: File) => {
  // 将imgUrl置空
  imageUrl.value = '';
  spinning.value = true;
  console.log(data.file);
  let imgUrl_suffix = data.file.name.split('.')[1];
  let cos = getCOS();
  cos.putObject({
    Bucket: 'zgq-icu-2002-1313043931', /* 填入您自己的存储桶，必须字段 */
    Region: 'ap-shanghai',  /* 存储桶所在地域，例如ap-beijing，必须字段 */
    Key: uuidv4() + '.' + imgUrl_suffix,  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
    Body: data.file, /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */
    onProgress: function (progressData) {
      console.log(JSON.stringify(progressData));
    }
  }, function (err, data) {
    console.log(err || data);
    if (err) {
      spinning.value = false;
      message.warning("上传失败!")
    } else {
      spinning.value = false;
      message.success("上传成功!")
      // 保存图片上传地址
      console.log('https://' + data.Location);
      imageUrl.value = 'https://' + data.Location;
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
}

</script>

<style scoped>
.post-edit-container {
  margin: 13px auto 0;
  width: 90%;
}
/* 被弃用*/
.submit-btn {
  position: fixed;
  right: 20px;
  bottom: 50px;
  width: 45px;
  height: 45px
}
.pageHeader{
  border-radius: 4px;
  background-color: white;
  height: 60px;
  margin-bottom: 10px;
  margin-left: 0px;
  min-width: 1085px;
}
/* 覆盖v-md-editor默认样式 */
:deep(.v-md-editor) {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  width: 100%;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 0 ;
  min-width: 1085px;
}

</style>
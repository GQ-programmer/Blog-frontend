<template>
  <div class="post-list-container">
      <div  style="background-color: #faf9f9">
        <a-page-header
            class="demo-page-header"
            style=""
            title="帖子详情"
            sub-title="This is a subtitle"
            @back="() => $router.go(-1)"
        >
          <template #extra>
            <a-button key="3">Operation</a-button>
            <a-button key="2">Operation</a-button>
            <a-button key="1" type="primary">Primary</a-button>
          </template>
          <a-descriptions size="small" :column="3">
            <a-descriptions-item label="作者">GQ学编程</a-descriptions-item>
            <a-descriptions-item label="账号">
              <a>421421</a>
            </a-descriptions-item>
            <a-descriptions-item label="发布时间">2017-01-10</a-descriptions-item>
            <a-descriptions-item label="Effective Time">2017-10-10</a-descriptions-item>
            <a-descriptions-item label="Remarks">
              Gonghu Road, Xihu District, Hangzhou, Zhejiang, China
            </a-descriptions-item>
          </a-descriptions>
        </a-page-header>
      </div>
      <a-divider orientation="left">正文</a-divider>
      <v-md-preview
          :text="text"
          @copy-code-success="handleCopyCodeSuccess"
      ></v-md-preview>

    <div id="components-back-top-demo-custom">
      <a-back-top visibilityHeight="300">
        <div class="ant-back-top-inner">UP</div>
      </a-back-top>
      Scroll down to see the bottom-right
      <strong style="color: #1088e9">blue</strong>
      button.
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";

const handleCopyCodeSuccess = (code) => {
  console.log(code)
}

const text = ref(`# 毕设-果蔬超市系统

## 需求分析

**首页**：
## 技术选型

> 使用Java语言

\`\`\`java
    psvm
\`\`\`
### 前端

1. Vue3开发框架\t提高开发效率
2. Vant UI    基于Vue移动端组件库

3. Ant Design Vue    基于Vue的PC端组件库
4. Vite   打包工具，快

### 后端

1. Java语言+SpringBoot2开发框架
2. SpringMVC+Mybatis+MybatisPlus（提高开发效率）
3. MySQL数据库
4. Redis非关系型数据库
5. Swagger + Knife4j 接口文档
6. 。。。

`)
</script>

<style scoped>
.post-list-container{
  margin: 0 auto;
  padding: 20px;
  width: 60%;
  background-color: white;
  box-shadow: 0px 15px 20px -15PX black;
}
 #components-back-top-demo-custom .ant-back-top {
   bottom: 100px;
 }
#components-back-top-demo-custom .ant-back-top-inner {
  height: 40px;
  width: 40px;
  line-height: 40px;
  border-radius: 4px;
  background-color: #1088e9;
  color: #fff;
  text-align: center;
  font-size: 20px;
}
</style>
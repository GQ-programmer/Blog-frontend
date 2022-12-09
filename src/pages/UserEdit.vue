<template>
  <div class="user-info-container">
    <a-tabs
        v-model:activeKey="activeKey"
        tabPosition="left"
        :style="{ height: '200px' }"
        @tabScroll="callback"
    >
      <a-tab-pane class="tab-item" key="1" :tab="`基本设置`">Content of tab {{ 1 }}</a-tab-pane>
      <a-tab-pane key="2" :tab="`新消息通知`">Content of tab {{ 2 }}</a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
const activeKey =  ref('1')

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
.user-info-container{
  margin: 0 auto;
  padding: 20px;
  width: 60%;
  background-color: white;
  box-shadow: 0px 15px 20px -15PX black;
}
.tab-item:hover{
  background-color: #e6f7ff;
}
</style>
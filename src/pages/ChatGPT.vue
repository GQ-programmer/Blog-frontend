<template>
  <div class="i_container" >
    <div class="main">
      <a-row style="height: 100%">
        <a-col class="main-top"  :span="24">

            <div class="confirm">
            <div class="c-card">
              <a-card title="GQ-AI 助手" :bordered="false" style="width: 100%">
                <div style="height: 80%">
                  <a-typography-title :level="5" style="margin-bottom: 10px">问题：{{mes}}</a-typography-title>
                  <v-md-preview :text="content" ref="preview"></v-md-preview>
                </div>
              </a-card>
            </div>
            <div class="c-input">
              <a-spin :spinning="spinning">
              <a-typography-title :level="5" style="margin-bottom: 10px">和AI助手对话吧：</a-typography-title>
              </a-spin>
              <a-input-search
                  v-model:value="mes"
                  placeholder="请输入问题"
                  enter-button="发送"
                  size="large"
                  @search="onSearch"
              />
            </div>
          </div>

        </a-col>
      </a-row>
    </div>

  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import myAxios from "../plugins/myAxios";
import {message} from "ant-design-vue";

const content1 = ref('')
const mes = ref('')
const spinning = ref<boolean>(false);

const content = ref('\n&nbsp;\n&nbsp;\n&nbsp;\n&nbsp;' +
    '\n&nbsp;\n&nbsp;\n&nbsp;\n&nbsp;\n&nbsp;\n&nbsp;\n&nbsp;\n&nbsp;\n&nbsp;\n&nbsp;\n&nbsp;\n&nbsp;')

const onSearch = async () => {
  spinning.value = true;
  const res = await myAxios.get('/chat/getMes',{
    params:{
      message: mes.value
    }
  });
  if (res.code === 0 && res.data !== null){
    spinning.value = false;
    content.value = res.data.content
  } else {
    spinning.value = false;
    message.error(res.description)
  }




}
</script>

<style scoped>
.i_container{
  height: 100%;
}
.main{
  width: 60%;
  height: 100%;
  margin: 0 auto;
}
.main-top{
  height: 90%;
}
.confirm{
  height: 90%;
  margin-top: 30px;
  background: white;
  /*border: red 1px solid;*/
  position: relative;
}
.c-card{
  background: white;
  padding: 0px
}
.c-input{
  width: 100%;
  padding: 20px;
  background: white;
  /*border: 1px red solid;*/
  height: 120px;
  /*position: absolute; !* 设置子元素为绝对定位 *!*/
  /*bottom: 0; !* bottom 设置为 0，即固定在父元素的底部 *!*/

}
iframe {
  border-width: 0px;
}
</style>
<template>
  <a-carousel arrows autoplay>
    <template #prevArrow>
      <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
        <left-circle-outlined />
      </div>
    </template>
    <template #nextArrow>
      <div class="custom-slick-arrow" style="right: 10px">
        <right-circle-outlined />
      </div>
    </template>
    <div class="bg-img">
      <img style="width:100%;height: 400px" :src="starry_sky6">
    </div>
    <div class="bg-img">
      <img style="width:100%;height: 400px" :src="starry_sky2">
    </div>
    <div class="bg-img">
      <img style="width:100%;height: 400px" :src="starry_sky3">
    </div>
    <div class="bg-img">
      <img style="width:100%;height: 400px" :src="starry_sky5">
    </div>

  </a-carousel>
</template>

<script setup lang="ts">
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue';
import starry_sky2 from '../assets/starry_sky/starry-sky2.jpg'
import starry_sky3 from '../assets/starry_sky/starry-sky3.jpg'
import starry_sky5 from '../assets/starry_sky/starry-sky5.jpg'
import starry_sky6 from '../assets/starry_sky/starry-sky6.jpg'


</script>

<style scoped>
/* For demo */
.ant-carousel :deep(.slick-slide) {
  text-align: center;
  height: 400px;
  line-height: 160px;
  background: #364d79;
  overflow: hidden;
}

.ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  opacity: 0.3;
  z-index: 1;
}
.ant-carousel :deep(.custom-slick-arrow:before) {
  display: none;
}
.ant-carousel :deep(.custom-slick-arrow:hover) {
  opacity: 0.5;
}

.ant-carousel :deep(.slick-slide h3) {
  color: #fff;
}

</style>
<template>
  <div class="i_container" >
    <iframe class="frame" src="http://docs.zgq.cool/interview/index.html" ></iframe>
  </div>
</template>

<script setup >
  const arr = [];
  for(let i=0; i< arr.length; i++){
    const index = arr.indexOf(arr[i], i+1)
    if(index !== -1) {
      //
      arr.splice(index, 1)
      i--
    }
  }
</script>

<style scoped>
.i_container{
  height: 100%;
}
.frame{
  width: 100%;
  height:100%;
}
iframe {
  border-width: 0px;
}
</style>
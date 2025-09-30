<template>
  <div class="header_container">
    <img src="../../assets/Jabil_Blue + Sky Blue_RGB.png" alt="" />
    <div class="LabName">
      <span class="zn"> 捷普精密工业(广州)有限公司可靠性分析实验室</span>
      <span class="en"
        >Jabil Precision Industry (Guangzhou) Co., Ltd. REL&FA Laboratory</span
      >
    </div>
    <div class="title">
      <span>{{
        props.applicationType == 1 ? "RELIABILITY TEST REQUEST" : "FA REQUEST"
      }}</span>
      <span>{{
        props.applicationType == 1 ? "可靠性测试需求单" : "失效分析需求单"
      }}</span>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from "vue";
const props = defineProps({
  applicationType: {
    type: Number,
    default: 1
  }
});
</script>
<style scoped lang="scss">
.header_container {
  padding-top: 10px;
  background-color: white;
  font-weight: bolder;
  width: 100%;
  // background-color: aqua;
  font-size: 21px;
  position: relative;
  img {
    width: 10vw;
    max-width: 20vw;
    height: auto;
    // height: 100px;
    // position: absolute;
    // object-fit: cover;
    // left: 60px;
    // top: 50px;
  }
  .LabName {
    padding: 20px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .zn {
      font-size: 25px;
    }
    .en {
    }
  }
  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #153d6a;
    // font-size: 20px;
  }
}
</style>

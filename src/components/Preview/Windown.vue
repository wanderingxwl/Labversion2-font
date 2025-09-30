<template>
  <div v-if="show" class="window">
    <div v-if="show" class="window-mask" @click="close" />
    <div class="close" @click="close">
      <vxe-icon name="close" class="iconfont" />
    </div>
    <div v-if="fileType == 0" class="image">
      <slot />
    </div>
    <div
      v-else
      class="window-content"
      :style="{
        top: '0px',
        left: windowContentLeft + 'px',
        width: windowContentWidth + 'px'
      }"
    >
      <div class="title">{{ title }}</div>
      <div class="content-body" :style="{ 'align-items': align }">
        <slot />
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { VxeIcon } from "vxe-pc-ui";
const props = defineProps({
  show: {
    type: Boolean
  },
  width: {
    type: Number,
    default: 1000
  },
  title: {
    type: String
  },
  align: {
    type: String,
    default: "top"
  },
  fileType: {
    type: Number
  }
});
const windowWidth = ref(window.innerWidth);
const windowContentWidth = computed(() => {
  return props.width > windowWidth.value ? windowWidth.value : props.width;
});
const windowContentLeft = computed(() => {
  let left = windowWidth.value - props.width;
  return left < 0 ? 0 : left / 2;
});
const emit = defineEmits(["close"]);
const close = () => {
  emit("close");
};

const resizeWindow = () => {
  windowWidth.value = window.innerWidth;
};
onMounted(() => {
  window.addEventListener("resize", resizeWindow);
});
onUnmounted(() => {
  window.addEventListener("resize", resizeWindow);
});
</script>
<style lang="scss" scoped>
.window {
  z-index: 2200;
  // width: 100%;
  // height: calc(100vh);
  // background-color: red;
  .window-mask {
    top: 0px;
    left: 0px;
    width: 100%;
    height: calc(100vh);
    opacity: 0.5;
    background: #000;
    position: fixed;
    z-index: 2200;
  }
  .close {
    z-index: 2200;
    cursor: pointer;
    position: fixed;
    top: 20px;
    right: 30px;
    width: 44px;
    height: 44px;
    border-radius: 22px;
    background: #606266;
    display: flex;
    justify-content: center;
    align-items: center;
    .iconfont {
      font-size: 20px;
      color: #fff;
      z-index: 100000;
      transition: transform 0.5s ease-in-out;
    }
  }

  .close:hover .iconfont {
    transform: rotate(180deg) !important;
  }
  .image {
    width: 80%;
    height: calc(100vh);
    z-index: 2200;
    top: 0px;
    position: fixed;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .window-content {
    width: 100%;
    height: calc(100vh);
    z-index: 2200;
    top: 0px;
    // left: 250px !important;
    // z-index: 201;
    position: fixed;
    background: #fff;
    .title {
      text-align: center;
      line-height: 40px;
      border-bottom: 1px solid #ddd;
      font-weight: bold;
    }
    .content-body {
      height: calc(100vh - 41px);
      display: flex;
      overflow: auto;
    }
  }
}
</style>

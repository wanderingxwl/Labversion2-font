<template>
  <div class="overlay">
    <div class="overlayDoor" />
    <div class="overlayContent">
      <div class="loader">
        <div class="inner" />
      </div>
      <p
        v-if="!skipVisiable"
        style="font-weight: bolder; color: #555; margin: 20px"
      >
        You are being redirected. Please wait a moment - 正在跳转页面，请稍等...
      </p>
      <template v-else>
        <p style="font-weight: bolder; color: #555; margin: 20px">
          Oops! The link has expired. Please sign in again to access the content
          - 哎呀！链接已过期，请重新登录以访问内容。
        </p>
        <div class="skip" @click="jump2Login">Log In</div>
      </template>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStoreHook } from "@/store/modules/user";
import data from "@iconify-icons/ri/fullscreen-fill";
const route = useRoute();
const router = useRouter();
const skipVisiable = ref(false);
const jump2Login = () => {
  useUserStoreHook().setToken(null);
  router.push("/");
};
onMounted(() => {
  //TODO单独开一个查看的界面
  //按钮跳转操作
  setTimeout(() => {
    if (route.query.requestId != null) {
      router.push(`/request/user_request?requestId=${route.query.requestId}`);
    } else {
      skipVisiable.value = true;
    }
  });
});

// const jump2Login = () => {
//   userStore.setToken(null);
//   router.push("/");
// };

// onMounted(async () => {
//   const token = route.query.token;
//   const requestId = route.query.requestId;

//   if (token) {
//     try {
//       // 清除旧 token（如果你使用的是 localStorage 或 cookie）
//       userStore.setToken(null);

//       // 使用 token 登录（假设后端支持这个接口）
//       const res = await axios.post("/api/login-by-token", { token });

//       // 保存新 token
//       userStore.setToken(res.data.token);

//       // 跳转到目标页面
//       if (requestId) {
//         router.push(`/request/user_request?requestId=${requestId}`);
//       } else {
//         router.push("/dashboard"); // 或其他默认页面
//       }
//     } catch (err) {
//       console.error("Token 登录失败", err);
//       skipVisiable.value = true;
//     }
//   } else {
//     skipVisiable.value = true;
//   }
// });
</script>
<style scoped lang="scss">
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100000000;
  .overlayDoor {
    &:before,
    &:after {
      content: "";
      position: absolute;
      width: 50%;
      height: 100%;
      // background: #111;
      transition: 0.5s cubic-bezier(0.77, 0, 0.18, 1);
      transition-delay: 0.8s;
    }
    &:before {
      left: 0;
    }
    &:after {
      right: 0;
    }
  }
  &.loaded {
    .overlayDoor {
      &:before {
        left: -50%;
      }
      &:after {
        right: -50%;
      }
    }
    .overlayContent {
      opacity: 0;
      margin-top: -15px;
    }
  }
  .overlayContent {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    transition: 0.5s cubic-bezier(0.77, 0, 0.18, 1);
    .skip {
      display: block;
      width: 130px;
      text-align: center;
      // margin: 50px auto 0;
      cursor: pointer;
      color: #111;
      font-family: "Nunito";
      font-weight: 700;
      padding: 12px 0;
      border: 2px solid #111;
      border-radius: 3px;
      transition: 0.2s ease;
      &:hover {
        background: #333;
        color: #fff;
        border-color: #333;
      }
    }
  }
}
.loader {
  width: 128px;
  height: 128px;
  border: 3px solid #111;
  border-bottom: 3px solid transparent;
  border-radius: 50%;
  position: relative;
  animation: spin 1s linear infinite;
  display: flex;
  justify-content: center;
  align-items: center;
  .inner {
    width: 64px;
    height: 64px;
    border: 3px solid transparent;
    border-top: 3px solid #111;
    border-radius: 50%;
    animation: spinInner 1s linear infinite;
  }
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes spinInner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-720deg);
  }
}
</style>

<script setup lang="ts">
import { ref, onBeforeMount, onUnmounted } from "vue";
import { ListItem } from "./data";
import BellIcon from "@iconify-icons/ep/bell";
import { useOnlineUserStore } from "@/store/modules/onlineUser";
import { message } from "@/utils/message";
import { useUserStoreHook } from "@/store/modules/user";
import { ElNotification } from "element-plus";
import { useRouter } from "vue-router";
const onlineUserStore = useOnlineUserStore();
const connection = onlineUserStore.createConnection();
const router = useRouter();
// const notificationHook = useNotificationStore();
// connection.on("Notice", (result: ListItem) => {
//   noticesNum.value = 0;
//   notices.value = [];
// });

connection.on("logout", () => {
  message("您已被强制下线！3秒后返回登陆页面", { type: "error" });
  setTimeout(() => {
    useUserStoreHook().logOut();
  }, 3000);
});
// connection.on("Message", (result: string) => {
//   ElNotification({
//     title: "新消息",
//     message: result,
//     type: "info",
//     duration: 0
//   });
// });
// const noticesNum = ref(0);
// const notices = ref<Array<ListItem>>([]);
// onBeforeMount(async () => {
//   notices.value = (await getUnReadNotice(
//     useUserStoreHook()?.currentUser?.account
//   )) as Array<ListItem>;
//   notificationHook?.setUnreadCount(notices.value.length);
//   noticesNum.value = notificationHook.unreadCount;
// });
//销毁
onUnmounted(() => {
  connection.stop();
});
</script>

<template>
  <div style="cursor: pointer" @click="router.push('/messageConter/message')">
    <!-- <el-badge :value="Number(noticesNum) === 0 ? '' : noticesNum" :max="99">
      <span class="header-notice-icon">
        <IconifyIconOffline :icon="BellIcon" />
      </span>
    </el-badge> -->
  </div>
</template>

<style lang="scss" scoped>
.dropdown-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 48px;
  cursor: pointer;

  .header-notice-icon {
    font-size: 18px;
    cursor: pointer;
  }
}

.noticeList-container {
  padding: 0 5px;
}
</style>

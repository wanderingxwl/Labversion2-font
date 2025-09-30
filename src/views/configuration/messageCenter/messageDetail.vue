<template>
  <el-empty v-if="props.item == null" description="Nothing" />
  <template v-else>
    <div class="detail_container">
      <span style="font-weight: bolder; font-size: 35px">
        [{{ item_w.title }}]:{{ messageInfo_w.projectName }}
      </span>
      <el-divider />
      <Steps
        :simple="true"
        :status="status"
        :step-key="stepKey"
        style="margin: 20px 0"
      />
      <el-descriptions border labei-width="200" :column="2" size="large">
        <!-- <template #extra /> -->
        <el-descriptions-item
          label-align="right"
          label="Application No. 申请单编号"
          label-class-name="my-label"
        >
          <template
            v-if="
              messageInfo_w.applicationNo != '' &&
              messageInfo_w.applicationNo != null
            "
          >
            <span>{{ messageInfo_w.applicationNo }}</span>
            <el-button
              ref="copyBtn"
              class="copy_btn"
              circle
              size="small"
              :icon="CopyDocument"
            />
          </template>
          <span v-else>--</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="right"
          label="Requester 申请人"
          label-class-name="my-label"
          >{{ messageInfo_w.requesterName }}</el-descriptions-item
        >
        <el-descriptions-item
          label-align="right"
          label="Work Cell 工作坊"
          label-class-name="my-label"
          >{{ messageInfo_w.workCell }}</el-descriptions-item
        >
        <el-descriptions-item
          label-align="right"
          label="Department 部门"
          label-class-name="my-label"
          ><span v-if="messageInfo_w.dept != '' && messageInfo_w.dept != null">
            {{ messageInfo_w.dept }}
          </span>
          <span v-else>--</span></el-descriptions-item
        >
        <el-descriptions-item
          label-align="right"
          label="Lab 实验室"
          label-class-name="my-label"
        >
          <el-tag v-if="messageInfo_w.labCategory == 1"
            >RELIABILITY TEST</el-tag
          >
          <el-tag v-else>FA</el-tag>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="right"
          label-class-name="my-label"
          label="Confirmed by Laboratory 实验室确认人"
        >
          <span
            v-if="
              messageInfo_w.adminAccount != '' &&
              messageInfo_w.adminAccount != null
            "
          >
            {{ messageInfo_w.adminAccount }}</span
          >
          <span v-else>--</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="right"
          label-class-name="my-label"
          label="Tester 测试员"
        >
          <template v-if="testersAccount != null && testersAccount.length > 0">
            <el-tag
              v-for="(item_tester, index) in testersAccount"
              :key="index"
              style="margin: 0 5px"
              >{{ item_tester }}</el-tag
            ></template
          >
          <span v-else>--</span>
        </el-descriptions-item>
        <el-descriptions-item
          label-align="right"
          label-class-name="my-label"
          label="Status 状态"
        >
          <el-tag v-if="item_w.noticeType == 1">Rejected </el-tag>
          <el-tag v-else-if="item_w.noticeType == 2">In Testing</el-tag>
          <el-tag v-else-if="item_w.noticeType == 3"
            >Pending First-Level Review</el-tag
          >
          <el-tag v-else-if="item_w.noticeType == 4">
            Rejected at First-Level Review</el-tag
          >
          <el-tag v-else-if="item_w.noticeType == 5"
            >Pending Second-Level Review</el-tag
          >
          <el-tag v-else-if="item_w.noticeType == 6">
            Rejected at Second-Level Review</el-tag
          >
          <el-tag v-else-if="item_w.noticeType == 7">Completed</el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <el-divider />
      <div>
        <p style="font-size: 24px; color: #606266">
          &nbsp;&nbsp;&nbsp;&nbsp;{{ item_w.content }}
        </p>
        <span v-if="item_w.remark" style="font-weight: bolder; font-size: 16px"
          >Remark</span
        >
        <p style="font-size: 16px; color: #606266">
          &nbsp;&nbsp;&nbsp;&nbsp;{{ item_w.remark }}
        </p>
      </div>
    </div>
  </template>
</template>
<script setup>
import { ref, onMounted, computed, onBeforeUnmount, watch } from "vue";
import { ElMessage } from "element-plus";
import ClipboardJS from "clipboard";
import { CopyDocument } from "@element-plus/icons-vue";
import Steps from "@/views/application/Steps.vue";
// import clipBorad from "vue-clipboard3";
const props = defineProps({
  messageInfo: {
    type: Object,
    default: () => {}
  },
  item: {
    type: Object,
    default: () => {
      noticeId: null;
    }
  }
});

const statusMap = {
  1: 2,
  2: 3,
  3: 4,
  4: 3,
  5: 5,
  6: 3,
  7: 6
};

const status = computed(() => statusMap[item_w.value.noticeType]);

let messageInfo_w = ref();
let item_w = ref();
const testersAccount = computed(() => {
  if (props.messageInfo.testersAccount != null)
    return props.messageInfo.testersAccount.split(",");
  else return null;
});
const stepKey = computed(() => {
  switch (status.value) {
    case 0:
      return 2;
    case 1:
      return 4;
    case 2:
      return 4;
    default:
      return status.value;
  }
});
const copyBtn = ref(null);
let clipboard;
const initializeClipboard = () => {
  if (copyBtn.value != null) {
    clipboard = new ClipboardJS(copyBtn.value.ref, {
      text: () => `${props.item.requestID}`
    });
    if (clipboard != null) {
      clipboard.on("success", () => {
        ElMessage({
          message: "Text has been copied to the clipboard!",
          type: "success"
        });
      });

      clipboard.on("error", () => {
        ElMessage({
          message: "Unable to copy the text",
          type: "error"
        });
      });
    }
  }
};
onMounted(() => {
  watch(
    copyBtn,
    newVal => {
      if (newVal) {
        initializeClipboard();
      }
    },
    { immediate: true }
  );
});
onBeforeUnmount(() => {
  if (clipboard) {
    clipboard.destroy();
  }
});
watch(
  () => props,
  () => {
    item_w.value = props.item;
    messageInfo_w.value = props.messageInfo;
  },
  { immediate: true, deep: true }
);
</script>
<style scoped lang="scss">
.detail_container {
  padding: 20px;
}
:deep(.my-label) {
  // background: var(--el-color-success-light-9) !important;
  font-weight: bolder !important;
}
:deep(.el-descriptions__title) {
  font-size: 30px !important;
}
</style>

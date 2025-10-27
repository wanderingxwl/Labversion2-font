<template>
  <div style="height: 300px; max-width: 600px">
    <!-- <el-steps direction="vertical" :active="stepsWithMeta.length - 1">
      <el-step
        v-for="(item, index) in stepsWithMeta"
        :key="index"
        :title="item.title"
        :icon="item.icon"
        :status="item.status"
      >
        <template #description>
          <div class="desc">
            <div class="operator">
              <span class="operator_title">Operator: </span>
              <span class="operator_name"
                ><el-tag size="small">{{ item.operatorName }}</el-tag></span
              >
            </div>

            <template v-if="item.remark">
              <div class="remark">
                <span class="remark_title">Remark: </span>
                <span class="remark_name">{{ item.remark }}</span>
              </div>
            </template>

            <span class="date">{{ item.createTime }}</span>
          </div>
        </template>
      </el-step>
    </el-steps> -->
    <el-timeline style="max-width: 600px">
      <el-timeline-item
        v-for="(activity, index) in stepsWithMeta"
        :key="index"
        :icon="activity.icon"
        :type="activity.status"
        :timestamp="activity.createTime"
        size="large"
      >
        <template #default>
          <div class="desc">
            {{ activity.title }}
            <template v-if="activity.operatorName">
              <div class="operator">
                <span class="operator_title">Operator: </span>
                <span class="operator_name"
                  ><el-tag size="small">{{
                    activity.operatorName
                  }}</el-tag></span
                >
              </div>
            </template>

            <template v-if="activity.remark">
              <div class="remark">
                <!-- <el-tooltip
                  class="item"
                  effect="dark"
                  :content="activity.remark"
                  placement="top"
                >
                  <span class="remark_name">
                    {{
                      activity.remark.length > 20
                        ? activity.remark.slice(0, 20) + "..."
                        : activity.remark
                    }}
                  </span>
                </el-tooltip> -->

                <span class="remark_name">
                  <span class="remark_title">Remark: </span
                  >{{ activity.remark }}</span
                >
              </div>
            </template>
          </div></template
        >
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
type StepStatus = "primary" | "success" | "warning" | "danger" | "info";
// 状态映射表：根据 operation 返回 icon、title、note
const statusMap: Record<
  number,
  { icon: string; title: string; status: StepStatus }
> = {
  0: { icon: "Loading", title: "Pending Assignment-待分配", status: "primary" },
  1: { icon: "DocumentDelete", title: "Canceled-取消已取消", status: "danger" },
  2: { icon: "CircleClose", title: "Rejected-已拒绝", status: "danger" },
  3: { icon: "EditPen", title: "In Testing-测试中", status: "info" },
  4: { icon: "User", title: "Review-一级审核", status: "warning" },
  5: { icon: "User", title: "Approval-二级审核", status: "warning" },
  6: { icon: "CircleCheck", title: "Completed-已完成", status: "success" },
  7: { icon: "Box", title: "Draft-草稿箱", status: "primary" },
  8: {
    icon: "Upload",
    title: "Re-upload Report-重新上传测试报告",
    status: "info"
  },
  9: {
    icon: "RefreshLeft",
    title: "Withdraw Report-撤回待审核测试报告",
    status: "warning"
  },
  10: {
    icon: "CircleClose",
    title: "Review Rejected-一级审核拒绝",
    status: "danger"
  },
  11: {
    icon: "CircleClose",
    title: "Approval Rejected-二级审核拒绝",
    status: "danger"
  },
  12: {
    icon: "User",
    title: "Review Passed-一级审核通过",
    status: "success"
  },
  13: {
    icon: "User",
    title: "Approval Passed-二级审核通过",
    status: "success"
  }
};

// 接收父组件传入的步骤数据
const props = defineProps<{
  StepsDetail: Array<{
    operatorName: string;
    createTime: string;
    operation: number;
    remark: string;
  }>;
}>();

// 处理后的步骤数据，添加 icon、title、note
const stepsWithMeta = computed(() =>
  props.StepsDetail.map(item => {
    const meta = statusMap[item.operation] || {
      icon: "QuestionFilled",
      title: "未知状态",
      status: "warning" as StepStatus
    };
    return {
      ...item,
      icon: meta.icon,
      title: meta.title,
      status: meta.status
    };
  })
);
</script>

<style scoped lang="scss">
.desc {
  width: 240px;
  margin-top: 8px;
  padding: 12px 16px;
  background-color: #fff;
  border-left: 4px solid #409eff; // 默认蓝色，可动态绑定
  border-radius: 8px;

  // ✅ 更强的阴影效果
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.06),
    0 4px 12px rgba(0, 0, 0, 0.08);

  transition: border-color 0.5s ease;
}

.desc:hover {
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.08),
    0 6px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-5px);
}

.operator {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}
.operator_title {
  color: #999;
  margin-right: 4px;
}
.operator_name {
  color: #333;
  // font-size: 16px;
}

.remark {
  // margin-top: 4px;
  color: #666;
  font-size: 14px;
}
.remark_title {
  color: #999;
  margin-right: 4px;
}
.remark_name {
  display: inline-block; // 或 block，如果你希望它独占一行
  // max-width: 160px; // 根据布局调整

  white-space: normal; // ✅ 允许自动换行
  // word-break: break-word; // ✅ 长单词或数字也能断行
  overflow-wrap: anywhere; // ✅ 防止长串内容撑破容器
  vertical-align: top;

  // text-overflow: ellipsis;
  vertical-align: bottom;
}
.date {
  font-size: 10px; // 原来是 12px，可适当调大
  color: #aaa;
}
</style>

<script lang="ts" setup>
import { ref, nextTick, reactive, h } from "vue";
import { VxeModalInstance, VxeFormInstance, VxeFormPropTypes } from "vxe-pc-ui";
import { getSingle, submitData, getTreeList } from "@/api/system/function";
import { ElTreeSelect } from "element-plus";
const emits = defineEmits<{ (e: "reload"): void }>();
const vxeModalRef = ref<VxeModalInstance>();
const treeSelectData = ref([]);
const modalOptions = reactive<{
  modalValue: boolean;
  modalTitle: string;
  canSubmit: boolean;
}>({
  modalValue: false,
  modalTitle: "",
  canSubmit: true
});

const showModal = (title: string, canSubmit?: boolean): void => {
  modalOptions.modalTitle = title;
  modalOptions.modalValue = true;
  modalOptions.canSubmit = canSubmit ?? true;
};

interface AddFuctionInput {
  name: string;
  code: string;
  parentId: null | number;
  remark: string;
}
const formRef = ref<VxeFormInstance>();
const defaultFormData = () => {
  return {
    name: "",
    code: "",
    parentId: null,
    remark: ""
  };
};
const formData = ref<AddFuctionInput>(defaultFormData());
const formItems = ref<VxeFormPropTypes.Items>([
  {
    field: "name",
    title: "Func. Name 权限",
    span: 24,
    itemRender: {
      name: "$input",
      props: { placeholder: "Please enter Func. name.请输入权限" }
    }
  },
  {
    field: "code",
    title: "Func. Code 权限编码",
    span: 24,
    itemRender: {
      name: "$input",
      props: { placeholder: "Please enter Func. code.请输入权限编码" }
    }
  },
  {
    field: "parentId",
    title: "Belong to 属于",
    span: 24,
    slots: {
      default: () => {
        return [
          h(ElTreeSelect, {
            modelValue: formData.value.parentId,
            data: treeSelectData.value,
            checkStrictly: true,
            style: { width: `100%` },
            props: { value: "id", label: "name", children: "children" },
            onChange(v) {
              formData.value.parentId = v;
            }
          })
        ];
      }
    }
  },
  {
    field: "remark",
    title: "Remark 备注",
    span: 24,
    itemRender: {
      name: "$textarea",
      props: { placeholder: "Please enter remark.请输入备注" }
    }
  }
]);
const formRules = ref<VxeFormPropTypes.Rules>({
  name: [{ required: true, message: "Please enter Func. name.请输入权限" }],
  code: [{ required: true, message: "Please enter Func. code.请输入权限编码" }]
});

const showAddModal = () => {
  showModal(`Add Func.增加权限`);
  formData.value = defaultFormData();
  nextTick(async () => {
    formRef.value.clearValidate();
    await loadTreeSelectData();
  });
};
const showEditModal = (record: Recordable) => {
  showModal(`Edit Func.编辑权限`);
  nextTick(async () => {
    formRef.value.clearValidate();
    await loadTreeSelectData();
    getSingle(record.id).then((data: any) => {
      formData.value = data;
    });
  });
};
const showViewModal = (record: Recordable) => {
  showModal(`View Func.查看权限`, false);
  nextTick(async () => {
    formRef.value.clearValidate();
    await loadTreeSelectData();
    getSingle(record.id).then((data: any) => {
      formData.value = data;
    });
  });
};
const handleSubmit = async () => {
  const validate = await formRef.value.validate();
  if (!validate) {
    submitData(formData.value).then(() => {
      modalOptions.modalValue = false;
      emits("reload");
    });
  }
};
const loadTreeSelectData = async () => {
  const data = await getTreeList();
  treeSelectData.value = data as any;
};

defineExpose({ showAddModal, showEditModal, showViewModal });
</script>
<template>
  <vxe-modal
    ref="vxeModalRef"
    v-model="modalOptions.modalValue"
    width="600"
    height="400"
    showFooter
    :destroy-on-close="true"
    :title="modalOptions.modalTitle"
  >
    <template #default>
      <vxe-form
        ref="formRef"
        :data="formData"
        :items="formItems"
        :rules="formRules"
        :titleWidth="170"
        :titleColon="true"
        :titleAlign="`right`"
      />
    </template>
    <template #footer>
      <vxe-button
        content="Close 关闭"
        @click="modalOptions.modalValue = false"
      />
      <vxe-button
        v-if="modalOptions.canSubmit"
        status="primary"
        content="Confirm 确定"
        @click="handleSubmit"
      />
    </template>
  </vxe-modal>
</template>

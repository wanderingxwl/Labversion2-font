<script lang="ts" setup>
import "pdfjs-viewer-element";
import { reactive, ref, h, onMounted, onBeforeMount, watch } from "vue";
import {
  getPageList,
  cancelRequest,
  deleteData,
  withdrawRequest,
  rejectRequest
} from "@/api/application/application";
import { ReVxeGrid } from "@/components/ReVxeTable";
import CreateModal from "./CreateModal.vue";
import { VxeTag, VxeUI, VxeModalProps } from "vxe-pc-ui";
import { useRoute } from "vue-router";
import assignForm from "./assignForm.vue";
import { UserInfo } from "@/api/auth";
import ImportDataModal from "./ImportDataModal.vue";
import { getReportFileId, stampPdf } from "@/api/system/profileSystem";
import Preview from "@/components/Preview/Preview.vue";
// import RejectModal from "./RejectModal.vue";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage, ElInput } from "element-plus";
import { getTestItemOptionsPure } from "@/api/configuration/testItem";
import { getTesterOptions } from "@/api/system/user";
const route = useRoute();
const reVxeGridRef = ref();
const columns = ref([]);
const formRef = ref();
// const WCOptions = ref([]);
const TesterOptions = ref([]);
const TestItemOptions = ref([]);
const showImportData = ref(false);
const currentUser = ref<UserInfo>();
const handleInitialFormParams = () => {
  formData.value = {
    status: -1,
    applicationNo: null,
    startDate: null,
    endDate: null,
    requesterAccount: "",
    // route.meta.tag == "application" ? currentUser.value.account : null,
    labCategory: 0,
    //TODO 筛选项 都根据lab类型联动
    testers: [],
    testItems: []
  };
  handleSearch();
};
const formItems = ref([]);
const getPageListByparams = async () => {
  currentUser.value = useUserStoreHook()?.currentUser;
  if (route.meta.tag == "application") {
    formItems.value = [
      {
        field: "projectName",
        title: "Project Name 项目名称",
        span: 6,
        itemRender: {
          name: "$input",
          props: { placeholder: "projectname. 请输入项目名称" }
        }
      },
      {
        field: "applicationNo",
        title: "ApplicationNo. 申请编号",
        span: 6,
        itemRender: {
          name: "$input",
          props: { placeholder: "ApplicationNo.请输入申请编号" }
        }
      },
      {
        field: "requesterAccount",
        title: "NTID 工号",
        span: 6,
        itemRender: {
          name: "$input",
          props: {
            placeholder: "Please enter NTID.请输入工号",
            readonly: true
          }
        }
      },

      // {
      //   field: "workCell",
      //   title: "Work Cell",
      //   span: 3,
      //   itemRender: {
      //     name: "$select",
      //     options: WCOptions,
      //     props: { options: WCOptions, placeholder: "WC", allowCreate: true }
      //   }
      // },
      // {
      //   field: "workCell",
      //   title: "Work Cell",
      //   span: 3,
      //   slots: {
      //     default: ({ data }) => {
      //       return h(
      //         ElSelect,
      //         {
      //           modelValue: data.workCell,
      //           "onUpdate:modelValue": val => {
      //             data.workCell = val;
      //             if (!WCOptions.value.find(opt => opt.value === val)) {
      //               WCOptions.value.push({ label: val, value: val });
      //             }
      //           },
      //           placeholder: "选择/输入WC",
      //           filterable: true,
      //           allowCreate: true,
      //           style: "width: 100%;",
      //           clearable: true
      //         },
      //         () =>
      //           WCOptions.value.map(item =>
      //             h(ElOption, {
      //               label: item.label,
      //               value: item.value
      //             })
      //           )
      //       );
      //     }
      //   }
      // },
      {
        field: "labCategory",
        title: "Lab 实验室",
        span: 3,
        itemRender: {
          name: "$select",
          props: {
            options: [
              { label: "All-所有", value: 0 },
              { label: "Reliality Test-可靠性测试", value: 1 },
              { label: "Failure Analysis-失效分析", value: 2 }
            ],
            placeholder: "Lab category."
            // readonly:
            //   route.meta.tag != "application" &&
            //   route.meta.tag != "view" &&
            //   route.meta.tag != "admin"
            // &&
            // route.meta.tag != "assign"
          }
        }
      },
      {
        title: "Start Date 起始日期",
        span: 6,
        field: "startDate",
        itemRender: {
          name: "VxeDatePicker",
          props: {
            clearable: true,
            placeholder: "start date.请选择起始日期"
          }
        }
      },
      {
        title: "End Date 终止日期",
        span: 6,
        field: "endDate",
        itemRender: {
          name: "VxeDatePicker",
          props: {
            clearable: true,
            placeholder: "end date 请选择终止日期"
          }
        }
      },
      {
        field: "status",
        title: "Status 申请单状态",
        span: 6,
        itemRender: {
          name: "$select",
          props: {
            options: [
              { label: "All-所有", value: -1 },
              { label: "Pending Assignment-待测试", value: 0 },
              { label: "canceled-已取消", value: 1 },
              { label: "Rejected-已拒绝", value: 2 },
              { label: "In Testing-测试中", value: 3 },
              { label: "Review-一级审核", value: 4 },
              { label: "Approval-二级审核", value: 5 },
              { label: "Completed-已完成", value: 6 },
              { label: "Draft-草稿箱", value: 7 }
            ],
            placeholder: "Please select status.请选择申请单状态"
          }
        }
      },
      // {
      //   field: "labCategory",
      //   title: "Lab 实验室",
      //   span: 6,
      //   itemRender: {
      //     name: "$select",
      //     props: {
      //       options: [
      //         { label: "All", value: 0 },
      //         { label: "Reliality Test", value: 1 },
      //         { label: "FAL", value: 2 }
      //       ],
      //       placeholder: "Please select lab category.请选择实验室"
      //     }
      //   }
      // },
      {
        span: 4,
        itemRender: {
          name: "$buttons",
          children: [
            {
              props: {
                type: "submit",
                icon: "vxe-icon-search",
                content: "Search 搜索",
                status: "primary"
              }
            },
            {
              props: {
                type: "reset",
                icon: "vxe-icon-undo",
                content: "Reset 重置"
              }
            }
          ]
        }
      }
    ];
  } else {
    formItems.value = [
      {
        field: "projectName",
        title: "Project Name 项目名称",
        span: 6,
        itemRender: {
          name: "$input",
          props: { placeholder: "project name 请输入项目名称" }
        }
      },
      {
        field: "applicationNo",
        title: "ApplicationNo.申请编号",
        span: 6,
        itemRender: {
          name: "$input",
          props: { placeholder: "applicationNo. 请输入申请编号" }
        }
      },
      {
        field: "requesterAccount",
        title: "NTID 工号",
        span: 6,
        itemRender: {
          name: "$input",
          props: {
            placeholder: "Please enter NTID. 请输入工号"
          }
        }
      },
      // {
      //   field: "workCell",
      //   title: "Work Cell",
      //   span: 3,
      //   itemRender: {
      //     name: "$select",
      //     props: {
      //       placeholder: "Please select or enter work cell. 请选择或输入WC",
      //       options: WCOptions
      //     }
      //   }
      // },
      // {
      //   field: "workCell",
      //   title: "Work Cell",
      //   span: 3,
      //   slots: {
      //     default: ({ data }) => {
      //       return h(
      //         ElSelect,
      //         {
      //           modelValue: data.workCell,
      //           "onUpdate:modelValue": val => {
      //             data.workCell = val;
      //             if (!WCOptions.value.find(opt => opt.value === val)) {
      //               WCOptions.value.push({ label: val, value: val });
      //             }
      //           },
      //           placeholder: "选择/输入WC",
      //           filterable: true,
      //           allowCreate: true,
      //           style: "width: 100%;",
      //           clearable: true
      //         },
      //         () =>
      //           WCOptions.value.map(item =>
      //             h(ElOption, {
      //               label: item.label,
      //               value: item.value
      //             })
      //           )
      //       );
      //     }
      //   }
      // },
      {
        field: "labCategory",
        title: "Lab 实验室",
        span: 6,
        itemRender: {
          name: "$select",
          props: {
            options: [
              { label: "All-所有", value: 0 },
              { label: "Reliality Test-可靠性测试", value: 1 },
              { label: "Failure Analysis-失效分析", value: 2 }
            ],
            placeholder: "Please select lab category.请选择实验室类型",
            readonly: currentUser.value.labCategory != 0
          }
        }
      },
      {
        field: "testers",
        title: "Testers/Project Leader 测试员",
        span: 6,
        itemRender: {
          name: "$select",
          props: {
            placeholder: "",
            clearable: true,
            multiple: true,
            filterable: true,
            options: TesterOptions
          }
        }
      },
      {
        field: "testItems",
        title: "TestItem 测试项",
        span: 6,
        itemRender: {
          name: "$select",
          props: {
            placeholder: "",
            clearable: true,
            multiple: true,
            filterable: true,
            options: TestItemOptions
          }
        }
      },
      {
        title: "Start Date 起始日期",
        span: 6,
        field: "startDate",
        itemRender: {
          name: "VxeDatePicker",
          props: {
            clearable: true,
            placeholder: "start date 请选择起始日期"
          }
        }
      },
      {
        title: "End Date 终止日期",
        span: 6,
        field: "endDate",
        itemRender: {
          name: "VxeDatePicker",
          props: {
            clearable: true,
            placeholder: "end date 请选择终止日期"
          }
        }
      },
      {
        field: "status",
        title: "Status 申请单状态",
        span: 6,
        itemRender: {
          name: "$select",
          props: {
            options: [
              { label: "All-所有", value: -1 },
              { label: "Pending Assignment-待分配", value: 0 },
              { label: "Canceled-已取消", value: 1 },
              { label: "Rejected-已拒绝", value: 2 },
              { label: "In Testing-测试中", value: 3 },
              { label: "Review-一级审核", value: 4 },
              { label: "Approval-二级审核", value: 5 },
              { label: "Completed-已完成", value: 6 },
              { label: "Draft-草稿箱", value: 7 }
            ],
            placeholder: "status 请选择申请单状态"
          }
        }
      },
      {
        span: 4,
        itemRender: {
          name: "$buttons",
          children: [
            {
              props: {
                type: "submit",
                icon: "vxe-icon-search",
                content: "Search 搜索",
                status: "primary"
              }
            },
            {
              props: {
                type: "reset",
                icon: "vxe-icon-undo",
                content: "Reset 重置"
              }
            }
          ]
        }
      },
      {
        span: 2,
        itemRender: {
          name: "$button",
          props: {
            content: "Export 导出",
            icon: "vxe-icon-upload",
            status: "info"
          },
          events: {
            click: () => {
              showImportData.value = true;
            }
          }
        }
      }
    ];
  }
  switch (route.meta.tag) {
    case "application":
      formData.value = {
        requesterAccount: currentUser.value.account,
        // labCategory: 0,
        status: -1
      };
      break;
    case "assign":
      formItems.value.map(item => {
        if (item.field == "labCategory") {
          switch (currentUser.value.labCategory) {
            case 0:
              item.itemRender.props.options = [
                { label: "All-所有", value: 0 },
                { label: "Reliability Test-可靠性测试", value: 1 },
                { label: "Failure Analysis-失效分析", value: 2 }
              ];
              break;
            case 1:
              item.itemRender.props.options = [
                { label: "Reliability Test-可靠性测试", value: 1 }
              ];
              break;
            case 2:
              item.itemRender.props.options = [
                { label: "Failure Analysis-失效分析", value: 2 }
              ];
              break;
          }
        }
      });
      formData.value = {
        status: 0,
        labCategory: currentUser.value.labCategory
      };
      break;
    case "edit":
      formItems.value.map(item => {
        if (item.field == "labCategory") {
          switch (currentUser.value.labCategory) {
            case 0:
              item.itemRender.props.options = [
                { label: "All-所有", value: 0 },
                { label: "Reliability Test-可靠性测试", value: 1 },
                { label: "Failure Analysis-失效分析", value: 2 }
              ];
              break;
            case 1:
              item.itemRender.props.options = [
                { label: "Reliability Test-可靠性测试", value: 1 }
              ];
              break;
            case 2:
              item.itemRender.props.options = [
                { label: "Failure Analysis-失效分析", value: 2 }
              ];
              break;
          }
        }
      });
      formData.value = {
        adminAccount: currentUser.value.account,
        status: 3,
        labCategory: currentUser.value.labCategory
      };
      break;
    case "audit_1":
      formItems.value.map(item => {
        if (item.field == "labCategory") {
          switch (currentUser.value.labCategory) {
            case 0:
              item.itemRender.props.options = [
                { label: "All-所有", value: 0 },
                { label: "Reliability Test-可靠性测试", value: 1 },
                { label: "Failure Analysis-失效分析", value: 2 }
              ];
              break;
            case 1:
              item.itemRender.props.options = [
                { label: "Reliability Test-可靠性测试", value: 1 }
              ];
              break;
            case 2:
              item.itemRender.props.options = [
                { label: "Failure Analysis-失效分析", value: 2 }
              ];
              break;
          }
        }
      });
      formData.value = {
        // labCategory: currentUser.value.labCategory,
        // primaryAuditorAccount: currentUser.value.account,
        status: 4
      };
      break;
    case "audit_2":
      formData.value = {
        status: 5
        // labCategory: currentUser.value.labCategory,
        // secondaryAuditorAccount: currentUser.value.account
      };
      break;
    case "stamp":
      formItems.value.map(item => {
        if (item.field == "status") {
          console.log(item.itemRender.props.options);
          item.itemRender.props.options = [
            { label: "Completed-已完成", value: 6 }
          ];
        }
        if (item.field == "labCategory") {
          switch (currentUser.value.labCategory) {
            case 0:
              item.itemRender.props.options = [
                { label: "All-所有", value: 0 },
                { label: "Reliability Test-可靠性测试", value: 1 },
                { label: "Failure Analysis-失效分析", value: 2 }
              ];
              break;
            case 1:
              item.itemRender.props.options = [
                { label: "Reliability Test-可靠性测试", value: 1 }
              ];
              break;
            case 2:
              item.itemRender.props.options = [
                { label: "Failure Analysis-失效分析", value: 2 }
              ];
              break;
          }
        }
      });
      formData.value = {
        status: 6,
        labCategory: currentUser.value.labCategory,
        IsCnas: true
      };
      break;
    case "view":
      formData.value = {
        labCategory: currentUser.value.labCategory
      };
      break;
    // case "admin":
    //   handleInitialFormParams();
    //   break;
    default:
      handleInitialFormParams();
      break;
  }
};
let formData = ref({ testers: [], testItems: [], labCategory: 0 });
//function处理逻辑
const handleSearch = async () => {
  if (
    formData.value.startDate != null &&
    formData.value.endDate != null &&
    formData.value.startDate > formData.value.endDate
  ) {
    ElMessage.warning(
      "The start date can't be later than the end date. 起始日期不可晚于终止日期"
    );
    return;
  }
  if (reVxeGridRef.value != null) {
    await reVxeGridRef.value.loadData();
  }
};

const createModalRef = ref();
const handleAdd = () => {
  showLabPopup.value = true;
};
const handleSelectLab = () => {
  createModalRef.value.showAddModal(null);
};
const handleEdit = (record: Recordable) => {
  if (record.status != null) {
    if (record.status == 1 || record.status == 2) {
      ElMessage.warning(
        "Modification is not allowed in the current state. 当前状态不允许进行修改"
      );
      return;
    }
    createModalRef.value.showEditModal(record.id, false);
  } else {
    createModalRef.value.showEditModal(record.id, true);
  }
};
const handleDelete = async (record: Recordable) => {
  const type = await VxeUI.modal.confirm(
    "Are you sure you want to delete?\r\n你确定要删除这个申请单吗？"
  );
  if (type == "confirm") {
    await deleteData(record.id);
    handleSearch();
  }
};
const selectedRowData = ref<any>();
const handleAssign = data => {
  showAssignPopup.value = true;
  selectedRowData.value = data;
};
//分配人员信息
const handleAssigned = async () => {
  await assignFormRef.value.handleSubmit();
  reVxeGridRef.value.loadData();
};
const handleAudit = async (record: Recordable) => {
  createModalRef.value.showAuditModal(record);
};
const handleCancel = async (record: Recordable) => {
  const type = await VxeUI.modal.confirm(
    "Are you sure you want to cancel?你确定要取消申请单？"
  );
  if (type == "confirm") {
    cancelRequest(record.id).then(() => {
      handleSearch();
    });
  }
  // await cancelRequest(record.id);
  // reVxeGridRef.value.loadData();
};
// const rejectModalRef = ref();
const rejectReason = ref();
const handleReject = async (record: Recordable) => {
  // rejectModalRef.value.showDialog(record);
  // const type = await VxeUI.modal.confirm(
  //   "Are you sure you want to reject?你确定要拒绝申请单？"
  // );
  rejectReason.value = "";
  const modalResult = await VxeUI.modal.confirm({
    iconStatus: "info",
    title: "Reject Request-拒绝请求",
    message:
      "Are you sure you want to reject this request? 你确定要拒绝申请单？",
    slots: {
      default: params => [
        h("div", { style: "padding-right: 10px;" }, [
          h(
            "p",
            { style: "margin-bottom: 8px;" },
            `Please enter reject reason 请输入拒绝 ${record.projectName}_${record.applicationNo} 理由：`
          ),
          h(ElInput, {
            modelValue: rejectReason.value,
            placeholder: "Reject Reason 拒绝理由",
            type: "textarea",
            rows: 5,
            onInput: (val: string) => {
              rejectReason.value = val;
            }
          })
        ])
      ]
    }
  });
  if (modalResult == "confirm") {
    await rejectRequest({
      requestId: record.id,
      operator: useUserStoreHook()?.currentUser?.name,
      rejectReason: rejectReason.value
    });
    handleSearch();
  } else return;
};
const handleView = (record: Recordable) => {
  console.log(record);
  createModalRef.value.showViewModal(record.id);
};
const functions = ref<Record<string, string>>({});

const applicationType = ref<number>(1);
const showLabPopup = ref(false);
const showAssignPopup = ref(false);
const modalLabOptions = reactive<VxeModalProps>({
  title: "Please select lab.请选择实验室",
  resize: true,
  showMaximize: true,
  cancelButtonText: "Cancel 取消",
  confirmButtonText: "Confirm 确定",
  width: "40vw"
});
onMounted(async () => {
  // WCOptions.value = await getWorkCellOption();
  if (route.query.requestId != null) {
    handleView({ id: route.query.requestId });
  }
});
onBeforeMount(() => {
  InitFunction();
  InitColumn();
  // formData.value = { testers: [] };
  // if (route.meta.tag == "application") {
  //   formItems.value = [
  //     {
  //       field: "projectName",
  //       title: "Project Name 项目名称",
  //       span: 6,
  //       itemRender: {
  //         name: "$input",
  //         props: { placeholder: "projectname. 请输入项目名称" }
  //       }
  //     },
  //     {
  //       field: "applicationNo",
  //       title: "ApplicationNo. 申请编号",
  //       span: 6,
  //       itemRender: {
  //         name: "$input",
  //         props: { placeholder: "ApplicationNo.请输入申请编号" }
  //       }
  //     },
  //     {
  //       field: "requesterAccount",
  //       title: "NTID 工号",
  //       span: 6,
  //       itemRender: {
  //         name: "$input",
  //         props: {
  //           placeholder: "Please enter NTID.请输入工号",
  //           readonly: true
  //         }
  //       }
  //     },

  //     // {
  //     //   field: "workCell",
  //     //   title: "Work Cell",
  //     //   span: 3,
  //     //   itemRender: {
  //     //     name: "$select",
  //     //     options: WCOptions,
  //     //     props: { options: WCOptions, placeholder: "WC", allowCreate: true }
  //     //   }
  //     // },
  //     // {
  //     //   field: "workCell",
  //     //   title: "Work Cell",
  //     //   span: 3,
  //     //   slots: {
  //     //     default: ({ data }) => {
  //     //       return h(
  //     //         ElSelect,
  //     //         {
  //     //           modelValue: data.workCell,
  //     //           "onUpdate:modelValue": val => {
  //     //             data.workCell = val;
  //     //             if (!WCOptions.value.find(opt => opt.value === val)) {
  //     //               WCOptions.value.push({ label: val, value: val });
  //     //             }
  //     //           },
  //     //           placeholder: "选择/输入WC",
  //     //           filterable: true,
  //     //           allowCreate: true,
  //     //           style: "width: 100%;",
  //     //           clearable: true
  //     //         },
  //     //         () =>
  //     //           WCOptions.value.map(item =>
  //     //             h(ElOption, {
  //     //               label: item.label,
  //     //               value: item.value
  //     //             })
  //     //           )
  //     //       );
  //     //     }
  //     //   }
  //     // },
  //     {
  //       field: "labCategory",
  //       title: "Lab 实验室",
  //       span: 3,
  //       itemRender: {
  //         name: "$select",
  //         props: {
  //           options: [
  //             { label: "All-所有", value: 0 },
  //             { label: "Reliality Test-可靠性测试", value: 1 },
  //             { label: "Failure Analysis-失效分析", value: 2 }
  //           ],
  //           placeholder: "Lab category."
  //           // readonly:
  //           //   route.meta.tag != "application" &&
  //           //   route.meta.tag != "view" &&
  //           //   route.meta.tag != "admin"
  //           // &&
  //           // route.meta.tag != "assign"
  //         }
  //       }
  //     },
  //     {
  //       title: "Start Date 起始日期",
  //       span: 6,
  //       field: "startDate",
  //       itemRender: {
  //         name: "VxeDatePicker",
  //         props: {
  //           clearable: true,
  //           placeholder: "start date.请选择起始日期"
  //         }
  //       }
  //     },
  //     {
  //       title: "End Date 终止日期",
  //       span: 6,
  //       field: "endDate",
  //       itemRender: {
  //         name: "VxeDatePicker",
  //         props: {
  //           clearable: true,
  //           placeholder: "end date 请选择终止日期"
  //         }
  //       }
  //     },
  //     {
  //       field: "status",
  //       title: "Status 申请单状态",
  //       span: 6,
  //       itemRender: {
  //         name: "$select",
  //         props: {
  //           options: [
  //             { label: "All-所有", value: -1 },
  //             { label: "Pending Assignment-待测试", value: 0 },
  //             { label: "canceled-已取消", value: 1 },
  //             { label: "Rejected-已拒绝", value: 2 },
  //             { label: "In Testing-测试中", value: 3 },
  //             { label: "Review-一级审核", value: 4 },
  //             { label: "Approval-二级审核", value: 5 },
  //             { label: "Completed-已完成", value: 6 }
  //           ],
  //           placeholder: "Please select status.请选择申请单状态"
  //         }
  //       }
  //     },
  //     // {
  //     //   field: "labCategory",
  //     //   title: "Lab 实验室",
  //     //   span: 6,
  //     //   itemRender: {
  //     //     name: "$select",
  //     //     props: {
  //     //       options: [
  //     //         { label: "All", value: 0 },
  //     //         { label: "Reliality Test", value: 1 },
  //     //         { label: "FAL", value: 2 }
  //     //       ],
  //     //       placeholder: "Please select lab category.请选择实验室"
  //     //     }
  //     //   }
  //     // },
  //     {
  //       span: 4,
  //       itemRender: {
  //         name: "$buttons",
  //         children: [
  //           {
  //             props: {
  //               type: "submit",
  //               icon: "vxe-icon-search",
  //               content: "Search 搜索",
  //               status: "primary"
  //             }
  //           },
  //           {
  //             props: {
  //               type: "reset",
  //               icon: "vxe-icon-undo",
  //               content: "Reset 重置"
  //             }
  //           }
  //         ]
  //       }
  //     }
  //   ];
  // } else {
  //   formItems.value = [
  //     {
  //       field: "projectName",
  //       title: "Project Name 项目名称",
  //       span: 6,
  //       itemRender: {
  //         name: "$input",
  //         props: { placeholder: "project name 请输入项目名称" }
  //       }
  //     },
  //     {
  //       field: "applicationNo",
  //       title: "ApplicationNo.申请编号",
  //       span: 6,
  //       itemRender: {
  //         name: "$input",
  //         props: { placeholder: "applicationNo. 请输入申请编号" }
  //       }
  //     },
  //     {
  //       field: "requesterAccount",
  //       title: "NTID 工号",
  //       span: 6,
  //       itemRender: {
  //         name: "$input",
  //         props: {
  //           placeholder: "Please enter NTID. 请输入工号"
  //         }
  //       }
  //     },
  //     // {
  //     //   field: "workCell",
  //     //   title: "Work Cell",
  //     //   span: 3,
  //     //   itemRender: {
  //     //     name: "$select",
  //     //     props: {
  //     //       placeholder: "Please select or enter work cell. 请选择或输入WC",
  //     //       options: WCOptions
  //     //     }
  //     //   }
  //     // },
  //     // {
  //     //   field: "workCell",
  //     //   title: "Work Cell",
  //     //   span: 3,
  //     //   slots: {
  //     //     default: ({ data }) => {
  //     //       return h(
  //     //         ElSelect,
  //     //         {
  //     //           modelValue: data.workCell,
  //     //           "onUpdate:modelValue": val => {
  //     //             data.workCell = val;
  //     //             if (!WCOptions.value.find(opt => opt.value === val)) {
  //     //               WCOptions.value.push({ label: val, value: val });
  //     //             }
  //     //           },
  //     //           placeholder: "选择/输入WC",
  //     //           filterable: true,
  //     //           allowCreate: true,
  //     //           style: "width: 100%;",
  //     //           clearable: true
  //     //         },
  //     //         () =>
  //     //           WCOptions.value.map(item =>
  //     //             h(ElOption, {
  //     //               label: item.label,
  //     //               value: item.value
  //     //             })
  //     //           )
  //     //       );
  //     //     }
  //     //   }
  //     // },
  //     {
  //       field: "labCategory",
  //       title: "Lab 实验室",
  //       span: 6,
  //       itemRender: {
  //         name: "$select",
  //         props: {
  //           options: [
  //             { label: "All-所有", value: 0 },
  //             { label: "Reliality Test-可靠性测试", value: 1 },
  //             { label: "Failure Analysis-失效分析", value: 2 }
  //           ],
  //           placeholder: "Please select lab category.请选择实验室类型",
  //           readonly: currentUser.value.labCategory != 0
  //         }
  //       }
  //     },
  //     {
  //       field: "testers",
  //       title: "Testers/Project Leader 测试员",
  //       span: 6,
  //       itemRender: {
  //         name: "$select",
  //         props: {
  //           placeholder: "",
  //           clearable: true,
  //           multiple: true,
  //           filterable: true,
  //           options: TesterOptions
  //         }
  //       }
  //     },
  //     {
  //       field: "testItems",
  //       title: "TestItem 测试项",
  //       span: 6,
  //       itemRender: {
  //         name: "$select",
  //         props: {
  //           placeholder: "",
  //           clearable: true,
  //           multiple: true,
  //           filterable: true,
  //           options: TestItemOptions
  //         }
  //       }
  //     },
  //     {
  //       title: "Start Date 起始日期",
  //       span: 6,
  //       field: "startDate",
  //       itemRender: {
  //         name: "VxeDatePicker",
  //         props: {
  //           clearable: true,
  //           placeholder: "start date 请选择起始日期"
  //         }
  //       }
  //     },
  //     {
  //       title: "End Date 终止日期",
  //       span: 6,
  //       field: "endDate",
  //       itemRender: {
  //         name: "VxeDatePicker",
  //         props: {
  //           clearable: true,
  //           placeholder: "end date 请选择终止日期"
  //         }
  //       }
  //     },
  //     {
  //       field: "status",
  //       title: "Status 申请单状态",
  //       span: 6,
  //       itemRender: {
  //         name: "$select",
  //         props: {
  //           options: [
  //             { label: "All-所有", value: -1 },
  //             { label: "Pending Assignment-待分配", value: 0 },
  //             { label: "Canceled-已取消", value: 1 },
  //             { label: "Rejected-拒绝", value: 2 },
  //             { label: "In Testing-测试中", value: 3 },
  //             { label: "Review-一级审核", value: 4 },
  //             { label: "Approval-二级审核", value: 5 },
  //             { label: "Completed-已完成", value: 6 }
  //           ],
  //           placeholder: "status 请选择申请单状态"
  //         }
  //       }
  //     },
  //     {
  //       span: 4,
  //       itemRender: {
  //         name: "$buttons",
  //         children: [
  //           {
  //             props: {
  //               type: "submit",
  //               icon: "vxe-icon-search",
  //               content: "Search 搜索",
  //               status: "primary"
  //             }
  //           },
  //           {
  //             props: {
  //               type: "reset",
  //               icon: "vxe-icon-undo",
  //               content: "Reset 重置"
  //             }
  //           }
  //         ]
  //       }
  //     },
  //     {
  //       span: 2,
  //       itemRender: {
  //         name: "$button",
  //         props: {
  //           content: "Export 导出",
  //           icon: "vxe-icon-upload",
  //           status: "info"
  //         },
  //         events: {
  //           click: () => {
  //             showImportData.value = true;
  //           }
  //         }
  //       }
  //     }
  //   ];
  // }
});
watch(
  () => route.meta.tag,
  async () => {
    await getPageListByparams();
    if (route.query.requestId != null) {
      var record: Recordable = {
        id: route.query.requestId
      };
      switch (route.meta.tag) {
        case "edit":
          handleEdit(record);
          break;
        case "audit_1":
          handleAudit(record);
          break;
        case "audit_2":
          handleAudit(record);
          break;
        default:
          break;
      }
    }
  },
  { immediate: true, deep: true }
);
const InitColumn = () => {
  switch (route.meta.tag) {
    case "application":
      columns.value = [
        {
          title: "ApplicayionNo. 申请编号",
          field: "applicationNo.",
          minWidth: 200,
          align: "center"
        },
        {
          title: "Project Name 项目名称",
          field: "projectName",
          minWidth: 200,
          align: "center"
        },
        // {
        //   title: "Work Cell",
        //   field: "workCell",
        //   minWidth: 20,
        //   width: 100,
        //   align: "center"
        // },
        {
          title: "Date 日期",
          field: "applicationDate",
          minWidth: 100,
          width: 250,
          align: "center",
          formatter: ({ cellValue }) => {
            const date = new Date(cellValue);
            const options = {
              year: "numeric",
              month: "2-digit",
              day: "2-digit"
            };
            return date.toLocaleDateString("en-GB", options); // Format: DD/MM/YYYY
          }
        },
        {
          title: "Status 状态",
          field: "status",
          align: "center",
          width: 200,
          slots: {
            default: ({ row }) => {
              switch (row.status) {
                case 0:
                  return h(
                    VxeTag,
                    {
                      status: "primary",
                      size: "mini"
                    },
                    { default: () => h("span", "Pending assignment-待分配") }
                  );
                case 1:
                  return h(
                    VxeTag,
                    {
                      status: "danger",
                      size: "mini"
                    },
                    { default: () => h("span", "Canceled-已取消") }
                  );
                case 2:
                  return h(
                    VxeTag,
                    {
                      status: "danger",
                      size: "mini"
                    },
                    { default: () => h("span", "Rejected-已拒绝") }
                  );
                case 3:
                  return h(
                    VxeTag,
                    {
                      status: "warning",
                      size: "mini"
                    },
                    { default: () => h("span", "In testing-测试中") }
                  );
                case 4:
                  return h(
                    VxeTag,
                    {
                      status: "info",
                      size: "mini"
                    },
                    { default: () => h("span", "Review-一级审核") }
                  );
                case 5:
                  return h(
                    VxeTag,
                    {
                      status: "info",
                      size: "mini"
                    },
                    { default: () => h("span", "Approval-二级审核") }
                  );
                case 6:
                  return h(
                    VxeTag,
                    {
                      status: "success",
                      size: "mini"
                    },
                    { default: () => h("span", "Completed-已完成") }
                  );
                case 7:
                  return h(
                    VxeTag,
                    {
                      status: "warning",
                      size: "mini"
                    },
                    { default: () => h("span", "Draft-草稿箱") }
                  );
              }
            }
          }
        },
        {
          title: "Lab 实验室",
          field: "labCategory",
          minWidth: 50,
          width: 180,
          align: "center",
          slots: {
            default: ({ row }) =>
              row.labCategory === 1
                ? h(
                    VxeTag,
                    {
                      status: "primary",
                      size: "mini"
                    },
                    { default: () => h("span", "Reliality Test-可靠性测试") }
                  )
                : h(
                    VxeTag,
                    {
                      status: "danger",
                      size: "mini",
                      onClick: () => {}
                    },
                    { default: () => h("span", "Failure Analysis-失效分析") }
                  )
          }
        }
      ];
      break;
    case "assign":
      columns.value = [
        {
          title: "Project Name 项目名称",
          field: "projectName",
          minWidth: 200,
          align: "center"
        },
        {
          title: "Requester 申请者",
          field: "requesterName",
          align: "center",
          width: 200
        },
        // {
        //   title: "Work Cell",
        //   field: "workCell",
        //   width: 150,
        //   align: "center"
        // },
        {
          align: "center",
          title: "Date 日期",
          field: "applicationDate",
          width: 250,
          align: "center",
          formatter: ({ cellValue }) => {
            const date = new Date(cellValue);
            const options = {
              year: "numeric",
              month: "2-digit",
              day: "2-digit"
            };
            return date.toLocaleDateString("en-GB", options); // Format: DD/MM/YYYY
          }
        },
        {
          title: "Status 状态",
          field: "status",
          width: 200,
          align: "center",
          slots: {
            default: ({ row }) => {
              switch (row.status) {
                case 0:
                  return h(
                    VxeTag,
                    {
                      status: "primary",
                      size: "mini"
                    },
                    { default: () => h("span", "Pending assignment-待分配") }
                  );
                case 1:
                  return h(
                    VxeTag,
                    {
                      status: "danger",
                      size: "mini"
                    },
                    { default: () => h("span", "Canceled-已取消") }
                  );
                case 2:
                  return h(
                    VxeTag,
                    {
                      status: "danger",
                      size: "mini"
                    },
                    { default: () => h("span", "Rejected-已拒绝") }
                  );
                case 3:
                  return h(
                    VxeTag,
                    {
                      status: "warning",
                      size: "mini"
                    },
                    { default: () => h("span", "In testing-测试中") }
                  );
                case 4:
                  return h(
                    VxeTag,
                    {
                      status: "info",
                      size: "mini"
                    },
                    { default: () => h("span", "Review-一级审核") }
                  );
                case 5:
                  return h(
                    VxeTag,
                    {
                      status: "info",
                      size: "mini"
                    },
                    { default: () => h("span", "Approval-二级审核") }
                  );
                case 6:
                  return h(
                    VxeTag,
                    {
                      status: "success",
                      size: "mini"
                    },
                    { default: () => h("span", "Completed-已完成") }
                  );
                case 7:
                  return h(
                    VxeTag,
                    {
                      status: "warning",
                      size: "mini"
                    },
                    { default: () => h("span", "Draft-草稿箱") }
                  );
              }
            }
          }
        },
        {
          title: "Lab 实验室",
          field: "labCategory",
          width: 180,
          align: "center",
          // minWidth: 100,
          slots: {
            default: ({ row }) =>
              row.labCategory === 1
                ? h(
                    VxeTag,
                    {
                      status: "primary",
                      size: "mini"
                    },
                    { default: () => h("span", "Reliality Test-可靠性测试") }
                  )
                : h(
                    VxeTag,
                    {
                      status: "danger",
                      size: "mini",
                      onClick: () => {}
                    },
                    { default: () => h("span", "Failure Analysis-失效分析") }
                  )
          }
        }
      ];
      break;
    // case "stamp":
    //   columns.value = [
    //     {
    //       title: "Project Name 项目名称",
    //       field: "projectName",
    //       minWidth: 200,
    //       align: "center"
    //     },
    //     {
    //       title: "Requester(NTID)工号",
    //       field: "requesterAccount",
    //       align: "center",
    //       width: 200
    //     },
    //     {
    //       title: "",
    //       field: "reportFormType",
    //       width: 0,
    //       align: "center"
    //     },
    //     {
    //       align: "center",
    //       title: "Date 日期",
    //       field: "applicationDate",
    //       width: 250,
    //       align: "center",
    //       formatter: ({ cellValue }) => {
    //         const date = new Date(cellValue);
    //         const options = {
    //           year: "numeric",
    //           month: "2-digit",
    //           day: "2-digit"
    //         };
    //         return date.toLocaleDateString("en-GB", options); // Format: DD/MM/YYYY
    //       }
    //     },
    //     {
    //       title: "Status 状态",
    //       field: "status",
    //       width: 200,
    //       align: "center",
    //       slots: {
    //         default: ({ row }) => {
    //           switch (row.status) {
    //             case 0:
    //               return h(
    //                 VxeTag,
    //                 {
    //                   status: "primary",
    //                   size: "mini"
    //                 },
    //                 { default: () => h("span", "Pending assignment-待分配") }
    //               );
    //             case 1:
    //               return h(
    //                 VxeTag,
    //                 {
    //                   status: "danger",
    //                   size: "mini"
    //                 },
    //                 { default: () => h("span", "Canceled-已取消") }
    //               );
    //             case 2:
    //               return h(
    //                 VxeTag,
    //                 {
    //                   status: "danger",
    //                   size: "mini"
    //                 },
    //                 { default: () => h("span", "Rejected-已拒绝") }
    //               );
    //             case 3:
    //               return h(
    //                 VxeTag,
    //                 {
    //                   status: "warning",
    //                   size: "mini"
    //                 },
    //                 { default: () => h("span", "In testing-测试中") }
    //               );
    //             case 4:
    //               return h(
    //                 VxeTag,
    //                 {
    //                   status: "info",
    //                   size: "mini"
    //                 },
    //                 { default: () => h("span", "Review-一级审核") }
    //               );
    //             case 5:
    //               return h(
    //                 VxeTag,
    //                 {
    //                   status: "info",
    //                   size: "mini"
    //                 },
    //                 { default: () => h("span", "Approval-二级审核") }
    //               );
    //             case 6:
    //               return h(
    //                 VxeTag,
    //                 {
    //                   status: "success",
    //                   size: "mini"
    //                 },
    //                 { default: () => h("span", "Completed-已完成") }
    //               );
    //           }
    //         }
    //       }
    //     },
    //     {
    //       title: "Lab 实验室",
    //       field: "labCategory",
    //       width: 180,
    //       align: "center",
    //       // minWidth: 100,
    //       slots: {
    //         default: ({ row }) =>
    //           row.labCategory === 1
    //             ? h(
    //                 VxeTag,
    //                 {
    //                   status: "primary",
    //                   size: "mini"
    //                 },
    //                 { default: () => h("span", "Reliality Test-可靠性测试") }
    //               )
    //             : h(
    //                 VxeTag,
    //                 {
    //                   status: "danger",
    //                   size: "mini",
    //                   onClick: () => {}
    //                 },
    //                 { default: () => h("span", "Failure Analysis-失效分析") }
    //               )
    //       }
    //     }
    //   ];
    //   break;
    default:
      columns.value = [
        {
          title: "ApplicayionNo. 申请标号",
          field: "applicationNo.",
          align: "center",

          minWidth: 200
        },
        {
          title: "Project Name 项目名称",
          field: "projectName",
          align: "center",

          minWidth: 200
        },
        {
          title: "Requester 申请者",
          field: "requesterName",
          align: "center",

          minWidth: 200
        },
        // {
        //   title: "Work Cell",
        //   field: "workCell",
        //   align: "center",
        //   width: 100
        //   // minWidth: 200
        // },
        {
          title: "Date 日期",
          field: "applicationDate",
          minWidth: 100,
          width: 250,
          align: "center",
          formatter: ({ cellValue }) => {
            const date = new Date(cellValue);
            const options = {
              year: "numeric",
              month: "2-digit",
              day: "2-digit"
            };
            return date.toLocaleDateString("en-GB", options); // Format: DD/MM/YYYY
          }
        },
        {
          title: "Status 状态",
          field: "status",
          width: 200,
          align: "center",
          slots: {
            default: ({ row }) => {
              switch (row.status) {
                case 0:
                  return h(
                    VxeTag,
                    {
                      status: "primary",
                      size: "mini"
                    },
                    { default: () => h("span", "Pending assignment-待分配") }
                  );
                case 1:
                  return h(
                    VxeTag,
                    {
                      status: "danger",
                      size: "mini"
                    },
                    { default: () => h("span", "Canceled-已取消") }
                  );
                case 2:
                  return h(
                    VxeTag,
                    {
                      status: "danger",
                      size: "mini"
                    },
                    { default: () => h("span", "Rejected-已拒绝") }
                  );
                case 3:
                  return h(
                    VxeTag,
                    {
                      status: "warning",
                      size: "mini"
                    },
                    { default: () => h("span", "In testing-测试中") }
                  );
                case 4:
                  return h(
                    VxeTag,
                    {
                      status: "info",
                      size: "mini"
                    },
                    { default: () => h("span", "Review-一级审核") }
                  );
                case 5:
                  return h(
                    VxeTag,
                    {
                      status: "info",
                      size: "mini"
                    },
                    { default: () => h("span", "Approval-二级审核") }
                  );
                case 6:
                  return h(
                    VxeTag,
                    {
                      status: "success",
                      size: "mini"
                    },
                    { default: () => h("span", "Completed-已完成") }
                  );
                case 7:
                  return h(
                    VxeTag,
                    {
                      status: "warning",
                      size: "mini"
                    },
                    { default: () => h("span", "Draft-草稿箱") }
                  );
              }
            }
          }
        },
        {
          title: "Lab 实验室",
          field: "labCategory",
          align: "center",
          width: 180,
          // minWidth: 100,
          slots: {
            default: ({ row }) =>
              row.labCategory === 1
                ? h(
                    VxeTag,
                    {
                      status: "primary",
                      size: "mini"
                    },
                    { default: () => h("span", "Reliality Test-可靠性测试") }
                  )
                : h(
                    VxeTag,
                    {
                      status: "danger",
                      size: "mini",
                      onClick: () => {}
                    },
                    { default: () => h("span", "Failure Analysis-失效分析") }
                  )
          }
        }
      ];
      break;
  }
};
const InitFunction = () => {
  switch (route.meta.tag) {
    case "application":
      functions.value = {
        add: "request.add",
        view: "request.view",
        cancel: "request.cancel",
        resubmit: "request.resubmit",
        draft: "request.draft"
      };
      break;
    case "assign":
      functions.value = {
        view: "request.view",
        assign: "request.assign",
        reject: "request.reject"
      };
      break;
    case "edit":
      functions.value = {
        edit: "request.edit",
        withdraw: "request.withdraw",
        view: "request.view",
        reupload: "request.reupload"
      };
      break;
    case "audit_1":
      functions.value = {
        view: "request.view",
        audit: "request.audit"
      };
      break;
    case "audit_2":
      functions.value = {
        view: "request.view",
        audit: "request.audit"
      };
      break;
    case "stamp":
      functions.value = {
        stamp: "stamp.cnas",
        preview: "stamp.preview",
        view: "request.view"
      };
      break;
    case "view":
      functions.value = {
        view: "request.view"
      };
      break;
    case "admin":
      functions.value = {
        view: "request.view",
        edit: "request.edit",
        delete: "request.delete"
      };
      break;
  }
};
// const applicationId = ref();
const assignFormRef = ref();
const modalAssignOptions = reactive<VxeModalProps>({
  title: "Please assign project personnel.请分配申请单",
  resize: true,
  showMaximize: true,
  cancelButtonText: "Cancel 取消",
  confirmButtonText: "Confirm 确定"
});
const modalImportDataOptions = reactive<VxeModalProps>({
  title: "Import data 导出数据",
  resize: true,
  showMaximize: true,
  cancelButtonText: "Cancel 取消",
  confirmButtonText: "Confirm 确定"
});
const handleStamp = async (record: Recordable) => {
  await stampPdf({ flag: 2, requestId: record.id });
};
const showPdf = ref(false);
const previewRef = ref();
const handlePreview = async (record: Recordable) => {
  var fileId = await getReportFileId(record.id);
  previewRef.value.showPreview(fileId, true);
};
const handleWithdraw = async (record: Recordable) => {
  const type = await VxeUI.modal.confirm(
    "Are you sure you want to withdraw?你确定要撤回申请单？"
  );
  if (type == "confirm") {
    withdrawRequest(record.id).then(() => {
      handleSearch();
    });
  }
};
const handleResubmit = async (record: Recordable) => {
  //TODO 处理重新提交
  //提交查看请求 并修改原申请单状态
  createModalRef.value.showAddModal(record);
};
const handleDraft = async (record: Recordable) => {
  //TODO 处理重新提交
  //提交查看请求 并修改原申请单状态
  createModalRef.value.showEditModal(record);
};
watch(
  () => formData.value.labCategory,
  async () => {
    if (
      formData.value.labCategory != null &&
      formData.value.labCategory != undefined
    ) {
      TestItemOptions.value = await getTestItemOptionsPure(
        formData.value.labCategory
      );
      TesterOptions.value = await getTesterOptions(formData.value.labCategory);
    } else return;

    // switch (formData.value.labCategory) {
    //   case 1:
    //     //
    //     TestItemOptions.value = await getTestItemOptionsPure(formData.value.labCategory);
    //     break;
    //   case 2:
    //     TestItemOptions.value=await

    //     break;
    //   default:
    //     TestItemOptions.value=await

    //     break;
    // }
  },
  { deep: true, immediate: true }
);
const handleReUploadReport = async (record: Recordable) => {
  createModalRef.value.showReuploadModal(record);
  //上传B版报告 A版报告不保留
  //B版前端改名
};
</script>
<template>
  <div>
    <el-card :shadow="`never`">
      <vxe-form
        ref="formRef"
        :data="formData"
        :items="formItems"
        @submit="handleSearch"
        @reset="getPageListByparams"
      />
    </el-card>
    <!-- 表格 -->
    <el-card :shadow="`never`" class="table-card">
      <ReVxeGrid
        ref="reVxeGridRef"
        :request="getPageList"
        :functions="functions"
        :searchParams="formData"
        :columns="columns"
        :operateColumnWidth="330"
        :applicationFlag="true"
        @handleAdd="handleAdd"
        @handleEdit="handleEdit"
        @handleView="handleView"
        @handleCancel="handleCancel"
        @handleAssign="handleAssign"
        @handleAudit="handleAudit"
        @handleReject="handleReject"
        @handleStamp="handleStamp"
        @handlePreview="handlePreview"
        @handleDelete="handleDelete"
        @handleWithdraw="handleWithdraw"
        @handleResubmit="handleResubmit"
        @handleReUploadReport="handleReUploadReport"
        @handleDraft="handleDraft"
      />
    </el-card>
    <!-- 选择实验室 -->
    <vxe-modal
      v-model="showLabPopup"
      v-bind="modalLabOptions"
      show-footer
      show-confirm-button
      show-cancel-button
      @confirm="handleSelectLab"
    >
      <template #default>
        <div
          style="display: flex; justify-content: center; align-items: center"
        >
          <el-radio-group v-model="applicationType">
            <el-radio-button
              label="Reliability Test Lab-可靠性测试实验室"
              :value="1"
            />
            <el-radio-button
              label="Failure Analysis Lab-失效分析实验室"
              :value="2"
            />
          </el-radio-group>
        </div>
      </template>
    </vxe-modal>
    <!-- 分配 -->
    <vxe-modal
      v-model="showAssignPopup"
      v-bind="modalAssignOptions"
      show-footer
      show-confirm-button
      show-cancel-button
      @confirm="handleAssigned"
    >
      <template #default>
        <assignForm
          ref="assignFormRef"
          :data="selectedRowData"
          :category="true"
          :operator="currentUser.name"
        />
      </template>
    </vxe-modal>
    <!-- 申请单 -->
    <template v-if="currentUser != null">
      <CreateModal
        ref="createModalRef"
        :applicationType="applicationType"
        :userInfo="currentUser"
        @reload="handleSearch"
      />
    </template>
    <vxe-modal v-model="showImportData" v-bind="modalImportDataOptions">
      <ImportDataModal :search-params="formData" />
    </vxe-modal>
    <Preview ref="previewRef" @close-preview="showPdf = false" />
    <!-- <RejectModal ref="rejectModalRef" @reload="handleSearch" /> -->
  </div>
</template>

const rule2testItem = {
  id: [
    {
      required: true,
      message: "Please select test item. 请选择测试项",
      trigger: "change"
    }
  ],
  usage: [
    {
      required: true,
      message: "Please enter Qty. 请输入数量",
      trigger: "blur"
    }
  ],
  desc: [
    {
      required: true
    }
  ]
};
const rules1_apply = {
  costCenter: [
    {
      required: true,
      message: "Cost center can't be empty",
      trigger: "blur"
    }
  ],
  ccOwner: [
    {
      required: true,
      message: "CC owner can't be empty",
      trigger: "blur"
    }
  ],
  tel: [
    {
      required: true,
      message: "Call No. can't be empty",
      trigger: "blur"
    }
  ]
};
const rules1_edit = {
  applicationNo: [
    {
      required: true,
      message: "Application No. can't be empty",
      trigger: "blur"
    }
  ],
  costCenter: [
    {
      required: true,
      message: "Cost center can't be empty",
      trigger: "blur"
    }
  ],
  ccOwner: [
    {
      required: true,
      message: "CC owner can't be empty",
      trigger: "blur"
    }
  ],
  tel: [
    {
      required: true,
      message: "Call No. can't be empty",
      trigger: "blur"
    }
  ]
};
const rules2_apply_Rel = {
  projectName: [
    {
      required: true,
      message: "Project name-项目名不可为空",
      trigger: "blur"
    }
  ],
  sampleType: [
    {
      required: true,
      message: "Sample type-样品类型不可为空",
      trigger: "blur"
    }
  ],
  sampleModel: [
    {
      required: true,
      message: "Sample model-样品型号不可为空",
      trigger: "blur"
    }
  ],
  sampleQuantity: [
    {
      required: true,
      message: "Sample Quantity-样品数量不可为空",
      trigger: "blur"
    }
  ],
  buildPhase: [
    {
      required: true,
      message: "Build phase-制造阶段不可为空",
      trigger: "blur"
    }
  ],
  testStandard: [
    {
      required: true,
      message: "Test standard-测试标准不可为空",
      trigger: "blur"
    }
  ],
  acceptanceCriteria: [
    {
      required: true,
      message: "Acceptance criteria can't be empty",
      trigger: "blur"
    }
  ]
};
const rules2_apply_FA = {
  projectName: [
    {
      required: true,
      message: "Project name-项目名不可为空",
      trigger: "blur"
    }
  ],
  sampleType: [
    {
      required: true,
      message: "Sample type-样品类型不可为空",
      trigger: "blur"
    }
  ],
  sampleModel: [
    {
      required: true,
      message: "Sample model-样品型号不可为空",
      trigger: "blur"
    }
  ],
  sampleQuantity: [
    {
      required: true,
      message: "Sample Quantity-样品数量不可为空",
      trigger: "blur"
    }
  ],
  buildPhase: [
    {
      required: true,
      message: "Build phase-制造阶段不可为空",
      trigger: "blur"
    }
  ]
};
const rules2_edit = {
  projectName: [
    {
      required: true,
      message: "Project name-项目名称不可为空",
      trigger: "blur"
    }
  ],
  sampleType: [
    {
      required: true,
      message: "Sample type-样品类型不可为空",
      trigger: "blur"
    }
  ],
  sampleModel: [
    {
      required: true,
      message: "Sample model-样品型号不可为空",
      trigger: "blur"
    }
  ],
  sampleQuantity: [
    {
      required: true,
      message: "Sample Quantity-样品数量不可为空",
      trigger: "blur"
    }
  ],
  buildPhase: [
    {
      required: true,
      message: "Build phase-制造阶段不可为空",
      trigger: "blur"
    }
  ],
  testStandard: [
    {
      required: true,
      message: "Test standard-测试标准不可为空",
      trigger: "blur"
    }
  ],
  acceptanceCriteria: [
    {
      required: true,
      message: "Acceptance criteria can't be empty",
      trigger: "blur"
    }
  ]
  // confirmingPerson: [
  //   {
  //     required: true,
  //     message: "Confirmed by Laboratory can't be empty",
  //     blur: "change"
  //   }
  // ],
  // sampleReceivedTime: [
  //   {
  //     required: true,
  //     message: "Sample received time can't be empty",
  //     blur: "change"
  //   }
  // ],
  // completionTime: [
  //   {
  //     required: true,
  //     message: "Estimated completion time can't be empty",
  //     blur: "change"
  //   }
  // ],
  // remark: [
  //   {
  //     required: true,
  //     message: "Remark can't be empty",
  //     blur: "cahnge"
  //   }
  // ]
};
export {
  rule2testItem,
  rules1_apply,
  rules1_edit,
  rules2_apply_FA,
  rules2_apply_Rel,
  rules2_edit
};

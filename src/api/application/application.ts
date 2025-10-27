import { http } from "@/utils/http";
import { downloadFile } from "../file";
export function getPageList(params) {
  return http.request("get", "/request/paged-list", { params });
}

export const submitData = (params: any) => {
  return http.request(
    params.id ? "put" : "post",
    `/request/${params.id ?? ""}`,
    {
      data: params
    }
  );
};

export const getSingle = (id: number) => {
  return http.request("get", `/request/${id}`);
};

export const getUserOptionsByRoleId = params => {
  if (params.labCategory != null) {
    return http.request(
      "get",
      `/request/assign-option?configCode=${params.configCode}&labCategory=${params.labCategory}`
    );
  } else {
    return http.request("get", `/request/${params.roleId}/assign-option`);
  }
};
export const assignRequest = (params: any) => {
  return http.request("post", "/request/assign-request", {
    data: params
  });
};
export const cancelRequest = (id: number) => {
  return http.request("post", `/request/${id}/cancle-request`);
};
export const rejectRequest = params => {
  return http.request("post", "/request/reject-request", {
    data: params
  });
};
export const auditRequest = params => {
  return http.request("post", `/request/audit-request`, {
    data: params
  });
};
export const auditRejectRequest = params => {
  return http.request("post", `/request/audit-reject-request`, {
    data: params
  });
};
export const getColumnsName = () => {
  return http.request("get", "/request/columns");
};
export const ImportData = params => {
  downloadFile("/request/import", params);
  // return http.request("get", "/request/import", { data: params });
};
export const ExportWord = id => {
  downloadFile(`/request/${id}/import-word`);
};
export const SendEmail = params => {
  return http.request("post", "/email/send-email", {
    data: params
  });
};
export const deleteData = (id: number) => {
  return http.request("delete", `/request/${id}`);
};
export const withdrawRequest = id => {
  return http.request("post", `/request/${id}/withdraw-request`);
};
export const reuploadReport = params => {
  return http.request("post", "/request/reupload-report", { data: params });
};

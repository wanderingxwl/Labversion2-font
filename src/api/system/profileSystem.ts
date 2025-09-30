import { http } from "@/utils/http";
import { downloadFile } from "../file";
export function getPageList(params: any) {
  return http.request("get", "/profile-system/paged-list", { params });
}

export const submitData = (params: any) => {
  return http.request("post", `/profile-system`, {
    data: params,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const addFileList = (params: any) => {
  return http.request("post", `/profile-system`, {
    data: params,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};
export const getSingle = (id: number) => {
  return http.request("get", `/profile-system/${id}`);
};

export const deleteData = (id: number) => {
  return http.request("delete", `/profile-system/${id}`);
};

export const deleteDataByIds = (ids: number[]) => {
  return http.request("delete", "/profile-system/by-ids", {
    data: { ids }
  });
};

export const download = id => {
  downloadFile(`/profile-system/${id}/download`);
};
export const stampPdf = (params: any) => {
  return http.post("/profile-system/image-stamp-to-pdf", {
    data: params
  });
};
export const getReportFileId = (requestId: number) => {
  return http.request("get", `/profile-system/${requestId}/report-file-id`);
};

import { http } from "@/utils/http";
export function getPageList(params) {
  return http.request("get", "/link/paged-list", { params });
}
export const submitData = (params: any) => {
  return http.request(params.id ? "put" : "post", `/link/${params.id ?? ""}`, {
    data: params
  });
};

export const getSingle = (id: number) => {
  return http.request("get", `/link/${id}`);
};

export const deleteData = (id: number) => {
  return http.request("delete", `/link/${id}`);
};
export const getOptions = account => {
  return http.request("get", `/link/link-option?account=${account}`);
};

import { http } from "@/utils/http";
export function getPageList(params) {
  return http.request("get", "/item/paged-list", { params });
}
export function getTestItemOptions(params) {
  return http.request("get", "/item/test-item", { params });
}
export function getTestItemOptionsPure(labCategory) {
  return http.request(
    "get",
    `item/test-item-option-pure?LabCategory=${labCategory}`
  );
}
export const submitData = (params: any) => {
  return http.request(params.id ? "put" : "post", `/item/${params.id ?? ""}`, {
    data: params
  });
};

export const getSingle = (id: number) => {
  return http.request("get", `/item/${id}`);
};

export const deleteData = (id: number) => {
  return http.request("delete", `/item/${id}`);
};

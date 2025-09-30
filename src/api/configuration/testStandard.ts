import { http } from "@/utils/http";
export function getPageList(params) {
  return http.request("get", "/standard/paged-list", { params });
}
export function getTestStandardOptions(lab) {
  return http.request(
    "get",
    `/standard/test-standard-options-by-lab?lab=${lab}`
  );
}
export const submitData = (params: any) => {
  return http.request(
    params.id ? "put" : "post",
    `/standard/${params.id ?? ""}`,
    {
      data: params
    }
  );
};

export const getSingle = (id: number) => {
  return http.request("get", `/standard/${id}`);
};

export const deleteData = (id: number) => {
  return http.request("delete", `/standard/${id}`);
};

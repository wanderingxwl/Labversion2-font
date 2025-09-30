import { http } from "@/utils/http";
export function getPageList(params) {
  return http.request("get", "/organization/paged-list", { params });
}

export const submitData = (params: any) => {
  return http.request(
    params.id ? "put" : "post",
    `/organization/${params.id ?? ""}`,
    {
      data: params
    }
  );
};

export const getSingle = (id: number) => {
  return http.request("get", `/organization/${id}`);
};

export const deleteData = (id: number) => {
  return http.request("delete", `/organization/${id}`);
};

// export const getWorkCellOption = type => {
//   return http.get(`/organization/work-cell?type=${type}`);
// };
export const getWorkCellOption = () => {
  return http.get(`/organization/work-cell`);
};

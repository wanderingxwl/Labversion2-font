import { http } from "@/utils/http";
export interface DelegationType {
  delegateAccount: string;
  delegateName: string;
  isActive: number;
}
export function getPageList(params: any): Promise<DelegationType[]> {
  return http.request<DelegationType[]>("get", "/delegation/paged-list", {
    params
  });
}

export function updateDelegation(
  delegatorAccount: string,
  data: DelegationType[]
): Promise<any> {
  return http.request("put", "/delegation/delegation", {
    params: { delegatorAccount }, // query 参数
    data // 请求体
  });
}

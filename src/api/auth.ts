import type { UserInfoType } from "@/store/modules/types";
import { http } from "@/utils/http";

export interface OrganizationTreeNode {
  id: number;
  name: string;
  children?: OrganizationTreeNode[];
  remark: string;
}
export interface UserInfo {
  name?: string;
  account?: string;
  dept?: string;
  telephone?: string;
  email?: string;
  labCategory?: number;
}
/** 登录 */
export const login = async (data?: object) => {
  return http.request<UserInfoType>("post", "/auth/login", { data });
};
/** 获取权限 */
export const getUserPermissions = async () => {
  const result = await http.request<string[]>("get", "/auth/functions");
  return http.request<string[]>("get", "/auth/functions");
};
/** 获取组织机构 */
export const getOrganizationTreeData = () => {
  return http.request<OrganizationTreeNode[]>("get", "/auth/organization-tree");
};

export const getUserInfo = () => {
  return http.request<UserInfo>("get", "/auth/user-info");
};
export const editUserInfo = (params: any) => {
  return http.request<UserInfo>("put", "/auth/user-info", {
    data: params
  });
};
export const getUnReadNotice = (account: string) => {
  return http.request("get", `/auth/unread-notice?account=${account}`);
};

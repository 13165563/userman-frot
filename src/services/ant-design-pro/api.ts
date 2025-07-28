// src/services/ant-design-pro/api.ts
import { request } from '@umijs/max';

/** 获取当前用户 */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.User>>('/api/user/current', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 登录接口 */
export async function login(
  body: API.LoginParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponse<API.User>>('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 注册接口 */
export async function register(
  body: API.RegisterParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponse<number>>('/api/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 退出登录接口 */
export async function outLogin(options?: { [key: string]: any }) {
  return request<API.BaseResponse<number>>('/api/user/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 搜索用户 */
export async function searchUser(
  params: { username?: string; current?: number; pageSize?: number }
) {
  // 根据实际后端响应结构调整类型定义
  return request<API.BaseResponse<API.User[]>>('/api/user/search', {
    method: 'GET',
    params,
  });
}

/** 删除用户（管理员） */
export async function deleteUser(params: { id: number }) {
  return request<API.BaseResponse<boolean>>('/api/user/delete', {
    method: 'POST',
    data: params,
  });
}

// src/utils/request.ts
import { extend } from '@umijs/max';
import { message } from 'antd';
import { history } from '@umijs/max';

const loginPath = '/user/login';

const request = extend({
  timeout: 10000,
  credentials: 'include', // 保持 cookie 登录状态
});

// 响应拦截器：处理通用逻辑
request.interceptors.response.use(async (response) => {
  const res = await response.clone().json();

  // 如果是未登录状态，跳转到登录页
  if (res.code === 4011001) {
    message.error('未登录，请重新登录');
    if (typeof window !== 'undefined') {
      history.push(loginPath);
    }
    throw new Error('未登录');
  }

  // 如果是无权限状态
  if (res.code === 4031001) {
    message.error('无权限访问');
    throw new Error('无权限');
  }

  // 其他错误状态统一处理
  if (res.code !== 0) {
    message.error(res.message || '请求失败');
    throw new Error(res.message || '请求失败');
  }

  // 返回完整响应结构，便于上层处理
  return res;
});

export default request;

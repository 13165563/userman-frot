// src/app.tsx
import '@ant-design/v5-patch-for-react-19'
import { AvatarDropdown, AvatarName, Footer, Question } from '@/components';
import { currentUser as queryCurrentUser } from '@/services/ant-design-pro/api';
import { SettingDrawer } from '@ant-design/pro-components';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { message } from "antd";

const loginPath = '/user/login';

/** 获取初始状态 */
export async function getInitialState() {
  console.log('✅ 初始化开始', Date.now());

  const fetchUserInfo = async () => {
    try {
      console.log('🔄 发起用户信息请求');
      const res = await queryCurrentUser();
      console.log('📦 响应数据:', res);

      if (!res) {
        console.warn('⚠️ 空响应');
        return undefined;
      }

      // 检查是否成功
      if (res.code === 0) {
        return res.data;
      }

      // 处理错误情况
      throw new Error(res.message || '获取用户信息失败');
    } catch (error) {
      console.error('💥 获取用户失败', error);
      return undefined;
    }
  };

  const user = await fetchUserInfo();
  console.log('🏁 初始化完成', user);

  return {
    fetchUserInfo,
    currentUser: user,
    settings: defaultSettings,
  };
}

/** 布局配置 */
export const layout = ({ initialState, setInitialState }) => {
  return {
    actionsRender: () => [<Question key="doc" />],
    avatarProps: {
      src: initialState?.currentUser?.avatarUrl,
      title: <AvatarName />,
      render: (_, avatarChildren) => <AvatarDropdown>{avatarChildren}</AvatarDropdown>,
    },
    waterMarkProps: {
      content:
        initialState?.currentUser?.username || initialState?.currentUser?.userAccount,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      const whiteList = ['/user/login', '/user/register'];
      const isLoginPage = whiteList.includes(location.pathname);

      // 只有在没有用户信息且不是登录相关页面时才跳转
      if (!initialState?.currentUser && !isLoginPage) {
        history.push(loginPath + '?redirect=' + encodeURIComponent(location.pathname));
      }
    },
    childrenRender: (children) => {
      return (
        <>
          {children}
          {process.env.NODE_ENV === 'development' && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) =>
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }))
              }
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

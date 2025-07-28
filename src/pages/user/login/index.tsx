// src/pages/user/login/index.tsx
import { Footer } from '@/components';
import { login } from '@/services/ant-design-pro/api';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { Helmet, history, useModel } from '@umijs/max';
import { Alert, App, Typography } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';
import { SYSTEM_LOGO, YUQUE_URL } from "@/constants/index.ts";

const useStyles = createStyles(({ token }) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'auto',
    backgroundImage:
      "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
    backgroundSize: '100% 100%',
  },
}));

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginError, setUserLoginError] = useState<boolean>(false);
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const { message } = App.useApp();

  // 如果用户已经登录，则重定向到首页
  useEffect(() => {
    if (initialState?.currentUser) {
      const urlParams = new URL(window.location.href).searchParams;
      history.push(urlParams.get('redirect') || '/');
    }
  }, [initialState?.currentUser]);

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 现在 login 返回的是 BaseResponse<User> 结构
      const res = await login(values);

      if (res.code === 0 && res.data) {
        message.success('登录成功');
        setUserLoginError(false);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
      } else {
        setUserLoginError(true);
        message.error(res.message || '登录失败');
      }
    } catch (error: any) {
      console.error('登录失败：', error);
      setUserLoginError(true);
      message.error(error.message || '登录失败，请检查用户名或密码');
    }
  };

  // 如果用户已登录，不渲染登录表单
  if (initialState?.currentUser) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Helmet>
        <title>{'登录'} - {Settings.title}</title>
      </Helmet>
      <div style={{ flex: 1, padding: '32px 0' }}>
        <LoginForm
          logo={<img alt="logo" src={SYSTEM_LOGO} />}
          title="编程导航"
          subTitle={<a href={YUQUE_URL} target="_blank" rel="noreferrer">最好的编程学习圈子</a>}
          initialValues={{ autoLogin: true }}
          onFinish={handleSubmit}
        >
          {userLoginError && (
            <LoginMessage content="用户名或密码错误" />
          )}
          <ProFormText
            name="userAccount"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder="请输入账号"
            rules={[{ required: true, message: '用户名是必填项！' }]}
          />
          <ProFormText.Password
            name="userPassword"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder="请输入密码"
            rules={[
              { required: true, message: '密码是必填项！' },
              { min: 8, message: '密码长度不能少于8位！' },
            ]}
          />
          <div style={{ marginBottom: 24 }}>
            <ProFormCheckbox noStyle name="autoLogin">自动登录</ProFormCheckbox>
            <a style={{ float: 'right' }} href="https://www.bilibili.com/">忘记密码?</a>
          </div>
          <Typography.Text style={{ display: 'block', marginBottom: 24, textAlign: 'center' }}>
            没有账号？<a href="/user/register">立即注册</a>
          </Typography.Text>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

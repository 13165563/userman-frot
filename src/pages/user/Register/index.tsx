import { Footer } from '@/components';
import { register, login } from '@/services/ant-design-pro/api'; // 导入 login API
import {
  LockOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { Helmet, useModel } from '@umijs/max';
import { Alert, App } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';
import { SYSTEM_LOGO, YUQUE_URL } from "@/constants/index.ts";

const useStyles = createStyles(() => ({
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

const RegisterMessage: React.FC<{
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

const Register: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const { message } = App.useApp();

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

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: API.RegisterParams) => {
    if (values.userPassword !== values.checkPassword) {
      message.error('两次输入的密码不一致');
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      // 调用注册接口
      const res = await register(values);

      if (res.code === 0 && res.data > 0) {
        message.success('注册成功，正在为您自动登录...');

        try {
          // 自动登录
          const loginRes = await login({
            userAccount: values.userAccount,
            userPassword: values.userPassword,
          });

          if (loginRes.code === 0 && loginRes.data) {
            await fetchUserInfo();
            const urlParams = new URL(window.location.href).searchParams;
            window.location.href = urlParams.get('redirect') || '/';
          } else {
            message.error('自动登录失败，请手动登录');
          }
        } catch (loginError) {
          console.error('自动登录失败:', loginError);
          message.error('自动登录失败，请手动登录');
        }
      } else {
        message.error(res.message || '注册失败，请重试');
      }
    } catch (error) {
      console.error('注册异常:', error);
      message.error('注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {'注册'}
          {Settings.title && ` - ${Settings.title}`}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src={SYSTEM_LOGO}/>}
          title="编程导航"
          subTitle={<a href={YUQUE_URL} target="_blank" rel="noreferrer">创建您的账号</a>}
          submitter={{
            searchConfig: {
              submitText: '注册',
            },
            submitButtonProps: {
              loading,
              size: 'large',
              style: {
                width: '100%',
              },
            },
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.RegisterParams);
          }}
        >
          <ProFormText
            name="userAccount"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined/>,
            }}
            placeholder={'请输入用户名'}
            rules={[
              {
                required: true,
                message: '用户名是必填项！',
              },
              {
                min: 4,
                max: 20,
                message: '用户名长度在4-20个字符之间',
              }
            ]}
          />

          <ProFormText.Password
            name="userPassword"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined/>,
            }}
            placeholder={'请输入密码'}
            rules={[
              {
                required: true,
                message: '密码是必填项！',
              },
              {
                min: 8,
                type: 'string',
                message: '密码长度不能少于8位！',
              }
            ]}
          />

          <ProFormText.Password
            name="checkPassword"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined/>,
            }}
            placeholder={'请确认密码'}
            rules={[
              {
                required: true,
                message: '请确认密码！',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue(['userPassword']) === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致！'));
                },
              }),
            ]}
          />

          <ProFormText
            name="planetCode"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder={'请输入星球编号'}
            rules={[
              {
                required: true,
                message: '请输入星球编号！',
              },
            ]}
          />

          <ProFormText
            name="email"
            fieldProps={{
              size: 'large',
              prefix: <MailOutlined/>,
            }}
            placeholder={'请输入邮箱'}
            rules={[
              {
                type: 'email',
                message: '请输入有效的邮箱地址！',
              }
            ]}
          />

          <ProFormText
            name="phone"
            fieldProps={{
              size: 'large',
              prefix: <PhoneOutlined/>,
            }}
            placeholder={'请输入手机号'}
            rules={[
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '请输入有效的手机号码！',
              }
            ]}
          />

          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox
              name="agreement"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('必须同意用户协议')),
                },
              ]}
            >
              我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私政策</a>
            </ProFormCheckbox>
          </div>
        </LoginForm>
      </div>
      <Footer/>
    </div>
  );
};

export default Register;

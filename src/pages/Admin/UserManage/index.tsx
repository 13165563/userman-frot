// src/pages/Admin/UserManage/index.tsx
import { deleteUser, searchUser } from '@/services/ant-design-pro/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useRequest, useAccess } from '@umijs/max';
import { Button, message, Modal, Tag, Select } from 'antd';
import React, { useRef, useState } from 'react';
import UpdateForm from './components/UpdateForm';
import { Image } from 'antd';

const UserManage: React.FC = () => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 检查是否具有管理员权限
  if (!access.canAdmin) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>无权限访问</h2>
          <p>您没有权限访问此页面，请联系管理员。</p>
        </div>
      </PageContainer>
    );
  }

  // 删除用户
  const { run: deleteRun } = useRequest((params: { id: number } | { ids: React.Key[] }) => {
    if ('id' in params) {
      return deleteUser({ id: params.id });
    }
    return Promise.resolve({ code: 0, data: true, message: 'success' });
  }, {
    manual: true,
    onSuccess: (res) => {
      if (res.code === 0) {
        messageApi.success('操作成功');
        actionRef.current?.reload();
        setSelectedRowKeys([]);
      } else {
        messageApi.error(res.message || '操作失败');
      }
    },
    onError: (error) => {
      messageApi.error('操作失败: ' + error.message);
    }
  });

  // 用户列表列配置
  const columns: ProColumns<API.User>[] = [
    {
      title: '用户ID',
      dataIndex: 'id',
      key: 'id',
      search: false,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text) => text || '-',
    },
    {
      title: '账号',
      dataIndex: 'userAccount',
      key: 'userAccount',
    },
    {
      title: '头像',
      dataIndex: 'avatarUrl',
      key: 'avatarUrl',
      search: false,
      render: (text) => (
        <Image
          src={text as string}
          width={40}
          height={40}
          preview={true}
          style={{ borderRadius: '50%' }}
          alt="avatar"
          fallback={'https://ts1.cn.mm.bing.net/th/id/R-C.e8ecb45aaab001b608e2101770fc7dce?rik=YpAEUp6uXtSODg&riu=http%3a%2f%2fimg95.699pic.com%2felement%2f40205%2f9426.png_300.png&ehk=4ahNJwjYWXQ4a1po7%2fQ1rUlkKl%2ft%2bDki9%2bb8ruY72SM%3d&risl=&pid=ImgRaw&r=0'}
        />
      ),
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      search: false,
      render: (text) => {
        const genderMap = {
          0: { text: '男', color: 'blue' },
          1: { text: '女', color: 'pink' },
        };
        const gender = genderMap[text as keyof typeof genderMap];
        return gender ? <Tag color={gender.color}>{gender.text}</Tag> : '-';
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (text) => text || '-',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      valueEnum: {
        0: { text: '普通用户', status: 'Default' },
        1: { text: '管理员', status: 'Success' },
      },
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'userStatus',
      key: 'userStatus',
      valueEnum: {
        0: { text: '正常', status: 'Success' },
        1: { text: '禁用', status: 'Error' },
      },
      renderFormItem: (item, { defaultRender }) => {
        return (
          <Select
            placeholder="请选择状态"
            allowClear
            options={[
              { label: '正常', value: 0 },
              { label: '禁用', value: 1 },
            ]}
          />
        );
      },
    },
    {
      title: '星球编号',
      dataIndex: 'planetCode',
      key: 'planetCode',
      search: false,
      render: (text) => text || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <UpdateForm
          key="edit"
          values={record}
          onSuccess={() => actionRef.current?.reload()}
        />,
        <Button
          key="delete"
          type="link"
          danger
          onClick={() => {
            Modal.confirm({
              title: '确认删除',
              content: `确定要删除用户 ${record.username || record.userAccount} 吗？`,
              onOk: () => deleteRun({ id: record.id }),
            });
          }}
        >
          删除
        </Button>,
      ],
    },
  ];

  // 批量操作菜单
  const batchOptions = [
    {
      key: 'delete',
      label: '批量删除',
      danger: true,
    },
  ];

  return (
    <PageContainer>
      {contextHolder}
      <ProTable<API.User>
        headerTitle="用户管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        request={async (params) => {
          console.log('🔍 发送用户搜索请求，参数:', params);
          try {
            const res = await searchUser(params);
            console.log('📥 用户搜索响应:', res);

            if (res.code === 0 && res.data) {
              // 根据实际响应结构调整数据处理逻辑
              return {
                data: Array.isArray(res.data) ? res.data : res.data.records || [],
                success: true,
                total: Array.isArray(res.data) ? res.data.length : res.data.total || 0,
              };
            }

            console.log('❌ 数据获取失败:', res.message);
            return {
              data: [],
              success: false,
              total: 0,
            };
          } catch (error) {
            console.error('💥 用户搜索请求失败:', error);
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        toolBarRender={() => [
          selectedRowKeys.length > 0 && (
            <Select
              key="batchAction"
              placeholder="批量操作"
              style={{ width: 120 }}
              options={batchOptions}
              onChange={(value) => {
                if (value === 'delete') {
                  Modal.confirm({
                    title: '确认删除',
                    content: `确定要删除选中的 ${selectedRowKeys.length} 个用户吗？`,
                    onOk: () => {
                      messageApi.warning('批量删除功能需要后端支持');
                    },
                  });
                }
              }}
            />
          ),
          <Button
            key="refresh"
            onClick={() => {
              actionRef.current?.reload();
            }}
          >
            刷新
          </Button>,
        ]}
      />
    </PageContainer>
  );
};

export default UserManage;

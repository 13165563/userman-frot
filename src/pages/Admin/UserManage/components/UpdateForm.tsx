import { Modal, Form, Input, Select, message } from 'antd';
// import { updateUser } from '@/services/ant-design-pro/api';
import React from 'react';

interface UpdateFormProps {
  values: API.User;
  onSuccess?: () => void;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      // await updateUser({ ...props.values, ...values });
      message.success('更新成功');
      setVisible(false);
      props.onSuccess?.();
    } catch (error) {
      message.error('更新失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <a onClick={() => setVisible(true)}>编辑</a>
      <Modal
        title="编辑用户"
        open={visible}
        onOk={handleSubmit}
        confirmLoading={loading}
        onCancel={() => setVisible(false)}
      >
        <Form
          form={form}
          initialValues={props.values}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="userAccount"
            label="账号"
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="avatarUrl"
            label="头像URL"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
          >
            <Select>
              <Select.Option value={0}>普通用户</Select.Option>
              <Select.Option value={1}>管理员</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="userStatus"
            label="状态"
          >
            <Select>
              <Select.Option value={0}>正常</Select.Option>
              <Select.Option value={1}>禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateForm;

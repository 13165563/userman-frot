import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright="zluolan639"
      links={[
        {
          key: 'bing',
          title: '必应',
          href: 'https://bing.com',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <><GithubOutlined />zluolan</>,
          href: 'https://github.com/13165563',
          blankTarget: true,
        },
        {
          key: 'baidu',
          title: '百度',
          href: 'https://www.baidu.com',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;

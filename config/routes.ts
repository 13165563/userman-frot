export default [
  {
    path: '/user',
    layout: false,
    routes: [{name: '登录', path: '/user/login', component: './user/login'},
      {name: '注册', path: '/user/register', component: './user/register'}
    ],
  },
  {path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome'},
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    layout: true,
    access: 'canAdmin',
    routes: [
      {path: '/admin', redirect: '/admin/sub-page'},
      {path: '/admin/user-manage', name: '用户管理页', component: './Admin/UserManage'},
      // {path: '/admin/sub-page', name: '二级管理页', component: './Admin'},
    ],
  },
  // {name: '查询表格', icon: 'table', path: '/list', component: './table-list'},
  {path: '/', redirect: '/welcome'},
  {path: '*', layout: false, component: './404'},
];

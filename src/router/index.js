import Vue from 'vue';
import VueRouter from 'vue-router';
import BaseLayout from '@/layout/BaseLayout';
import SidebarLayout from '@/layout/SidebarLayout';
import MainView from '@/layout/MainView';

Vue.use(VueRouter);

export const staticRoutes = [
  {
    path: '/login/redirect',
    component: () => import('@/views/login/redirect'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
  },
  {
    path: '/401',
    name: '401',
    component: () => import('@/views/error-pages/401'),
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/error-pages/403'),
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error-pages/404'),
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/views/error-pages/500'),
  },
];

export const dynamicRoutes = [
  {
    path: '/',
    component: BaseLayout,
    meta: { permissions: ['*:*'], redirect: true },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard'),
        meta: { title: 'dashboard', icon: 'dashboard' },
      },
      {
        path: 'map',
        name: 'map',
        component: () => import('@/views/map'),
        meta: { title: 'Map', icon: 'map' },
      },
      {
        path: 'network',
        name: 'network',
        component: () => import('@/views/network'),
        meta: { title: 'network', icon: 'el-icon-stopwatch' },
        children: [
          {
            path: ':_id/properties',
            name: 'networkObjectProperties',
            component: () => import('@/views/network/properties'),
            meta: { title: 'properties', icon: 'el-icon-stopwatch' },
          },
          {
            path: ':_id/configuration',
            name: 'networkObjectConfiguration',
            component: () => import('@/views/network/configuration'),
            meta: { title: 'Configuration', icon: 'el-icon-stopwatch' },
          },
          {
            path: ':_id/cloudwatch',
            name: 'networkObjectCloudWatch',
            component: () => import('@/views/network/cloudwatch'),
            meta: { title: 'CloudWatch', icon: 'el-icon-stopwatch' },
          },
          {
            path: ':_id/zabbix',
            name: 'networkObjectZabbix',
            component: () => import('@/views/network/zabbix'),
            meta: { title: 'Zabbix', icon: 'el-icon-stopwatch' },
          }
        ]
      },
      {
        path: 'credentials',
        name: 'credentials',
        component: () => import('@/views/credentials'),
        meta: { title: 'credentials', icon: 'el-icon-setting', redirect: true },
        children: [
          {
            path: 'cli',
            name: 'cliCredentials',
            component: () => import('@/views/credentials/cli'),
            meta: { title: 'cliCredentials' },
          },
          {
            path: 'aws_access_keys',
            name: 'awsAccessKeys',
            component: () => import('@/views/credentials/aws_access_keys'),
            meta: { title: 'AWS Access Keys' },
          },
        ]
      },
      {
        path: 'tasks',
        name: 'tasks',
        component: MainView,
        meta: { title: 'tasks', icon: 'el-icon-files', redirect: true },
        children: [
          {
            path: 'list',
            name: 'taskList',
            component: () => import('@/views/tasks/list'),
            meta: { title: 'list' },
          },
          {
            path: 'add',
            name: 'addTask',
            component: () => import('@/views/tasks/add'),
            meta: { title: 'add' },
          },
          {
            path: 'edit/:_id',
            name: 'editTask',
            component: () => import('@/views/tasks/edit'),
            meta: { title: 'edit' },
          },
          {
            path: 'view/:_id',
            name: 'viewTask',
            component: () => import('@/views/tasks/view'),
            meta: { title: 'view' },
          },
        ]
      },
    ],
  },
  {
    path: '/admin',
    name: 'admin',
    component: SidebarLayout,
    meta: { title: 'administration', icon: 'admin', permissions: ['admin.*:read'], redirect: true },
    children: [
      {
        path: 'users',
        name: 'users',
        component: MainView,
        redirect: { name: 'userList' },
        meta: { title: 'users', icon: 'user', permissions: ['admin.users:read'] },
        children: [
          {
            path: 'list',
            name: 'userList',
            component: () => import('@/views/admin/users/list'),
            meta: { title: 'list', permissions: ['admin.users:read'] },
          },
          {
            path: 'add',
            name: 'addUser',
            component: () => import('@/views/admin/users/add'),
            meta: { title: 'add', permissions: ['admin.users:write.add'] },
          },
          {
            path: 'edit/:_id',
            name: 'editUser',
            component: () => import('@/views/admin/users/edit'),
            meta: { title: 'edit', permissions: ['admin.users:write.edit'] },
          },
        ]
      },
      {
        path: 'groups',
        name: 'groups',
        component: MainView,
        redirect: { name: 'groupList' },
        meta: { title: 'groups', icon: 'team', permissions: ['admin.groups:read'] },
        children: [
          {
            path: 'list',
            name: 'groupList',
            component: () => import('@/views/admin/groups/list'),
            meta: { title: 'list', permissions: ['admin.groups:read'] },
          },
          {
            path: 'add',
            name: 'addGroup',
            component: () => import('@/views/admin/groups/add'),
            meta: { title: 'add', permissions: ['admin.groups:write.add'] },
          },
          {
            path: 'edit/:_id',
            name: 'editGroup',
            component: () => import('@/views/admin/groups/edit'),
            meta: { title: 'edit', permissions: ['admin.groups:write.edit'] },
          },
        ]
      },
      {
        path: 'settings',
        name: 'systemSettings',
        component: () => import('@/views/admin/settings'),
        meta: { title: 'settings', icon: 'el-icon-setting', permissions: ['admin.settings.*:read'], redirect: true },
        children: [
          {
            path: 'auth',
            name: 'authSettings',
            component: () => import('@/views/admin/settings/auth'),
            meta: { title: 'authenSettings', permissions: ['admin.settings.auth:read'] },
          },
          {
            path: 'email',
            name: 'emailSettings',
            component: () => import('@/views/admin/settings/email'),
            meta: { title: 'emailSettings', permissions: ['admin.settings.email:read'] },
          },
        ]
      },
      {
        path: 'scheduler',
        name: 'scheduler',
        component: MainView,
        redirect: { name: 'jobs' },
        meta: { title: 'scheduler', icon: 'el-icon-alarm-clock', permissions: ['admin.scheduler:read'] },
        children: [
          {
            path: 'jobs',
            name: 'jobs',
            component: () => import('@/views/admin/scheduler/jobs'),
            meta: { title: 'jobs', icon: 'el-icon-notebook-2', permissions: ['admin.scheduler:read'] },
          },
        ]
      },
    ]
  }
];

export const fixedRoutes = [
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  }
];

export const routes = staticRoutes.concat(dynamicRoutes).concat(fixedRoutes);

const createRouter = () => new VueRouter({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  base: process.env.BASE_URL,
  routes: staticRoutes,
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;

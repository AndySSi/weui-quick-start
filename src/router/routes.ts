import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../pages/home/HomePage.vue'),
        meta: { title: '首页', tab: 'home' },
      },
      {
        path: 'projects',
        name: 'projects',
        component: () => import('../pages/projects/ProjectListPage.vue'),
        meta: { title: '项目', tab: 'projects' },
      },
      {
        path: 'projects/:id',
        name: 'project-detail',
        props: true,
        component: () => import('../pages/projects/ProjectDetailPage.vue'),
        meta: { title: '项目详情', tab: 'projects', back: true },
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('../pages/settings/SettingsPage.vue'),
        meta: { title: '设置', tab: 'settings' },
      },
      {
        path: 'examples/tabbar',
        name: 'tabbar-demo',
        component: () => import('../pages/examples/TabbarPage.vue'),
        meta: { title: 'WeUI Tabbar 示例', back: true, hideTabbar: true },
      },
      {
        path: ':pathMatch(.*)*',
        name: 'not-found',
        component: () => import('../pages/NotFoundPage.vue'),
        meta: { title: '页面未找到', back: true },
      },
    ],
  },
]

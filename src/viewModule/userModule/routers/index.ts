// path 路径  Component： 组件 exact ：完全匹配, keepAiveName:  必须唯一
import loadable from '../../../components/loadable'
// 按需加载组件
// const esre = Loadable({
//   loader: () => import('../viewPage/user'),
//   loading: loadingComponent
// })
// 路由配置表
export default [
  {
    path: "/user",
    keepAiveName: 'user',
    Component: loadable(() => import("../viewPage/user"))
  }
];
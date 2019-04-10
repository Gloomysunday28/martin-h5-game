import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Games',
      meta: {
        oDeep: 0,
        title: '马丁的游戏',
        extra: {
          threeLine: true
        },
        showHeader: true
      },
      component: () => import('@/views/Games')
    },
    {
      path: '/martin/terials',
      name: 'MartinTerials',
      meta: {
        oDeep: 1,
        title: '马丁的俄罗斯方块',
        showHeader: true,
      },
      component: () => import('@/views/MartinTerials')
    },
    {
      path: '/martin/snake',
      name: 'MartinSnake',
      meta: {
        oDeep: 1,
        title: '马丁的贪吃蛇',
        showHeader: true,
      },
      component: () => import('@/views/MartinSnake')
    },
  ]
})

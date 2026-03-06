import { createRouter, createWebHistory } from 'vue-router'
import ListView from '../components/ListView.vue'
import DetailView from '../components/DetailView.vue'

const routes = [
  { path: '/', redirect: '/people' }, // Default route
  {
    path: '/:entity',
    name: 'list',
    component: ListView,
    props: true
  },
  {
    path: '/:entity/:id',
    name: 'detail',
    component: DetailView,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

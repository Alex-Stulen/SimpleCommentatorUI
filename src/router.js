import * as Router from 'vue-router'
import App from "@/App";

const routes = [
    {path: '/', component: App}
]

const router = new Router.createRouter({
    history: Router.createWebHistory(),
    routes: routes
})

export default router

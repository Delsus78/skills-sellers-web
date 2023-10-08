import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore } from '@/stores';
import {HomeView, LoginView, CardsView, StatsView, BuildingsView, OpeningView, UpgradeView} from '@/views';

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    linkActiveClass: 'active',
    routes: [
        { path: '/', component: HomeView },
        { path: '/login', component: LoginView },
        { path: '/cards/:id', component: CardsView },
        { path: '/stats/:id', component: StatsView },
        { path: '/batiments', component: BuildingsView },
        { path: '/opening', component: OpeningView },
        { path: '/upgrade', component: UpgradeView }
    ]
});

router.beforeEach(async (to) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/login'];
    const authRequired = !publicPages.includes(to.path);
    const auth = useAuthStore();

    if (authRequired && !auth.user) {
        auth.returnUrl = to.fullPath;
        return '/login';
    }
});

import { createRouter, createWebHistory } from 'vue-router';

import { useAuthStore } from '@/stores';
import {
    HomeView,
    LoginView,
    CardsView,
    StatsView,
    BuildingsView,
    OpeningView,
    UpgradeView,
    RegisterView,
    ResetPasswordView,
    GamesView,
    RulesView, ActionView, WordleView
} from '@/views';

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    linkActiveClass: 'active',
    routes: [
        { path: '/', component: HomeView },
        { path: '/login', component: LoginView },
        { path: '/register', component: RegisterView },
        { path: '/resetpassword', component: ResetPasswordView },
        { path: '/rules', component: RulesView },
        { path: '/cards', component: CardsView },
        { path: '/stats/:id', component: StatsView },
        { path: '/batiments', component: BuildingsView },
        { path: '/games', component: GamesView },
        { path: '/wordle', component: WordleView },
        { path: '/opening', component: OpeningView },
        { path: '/upgrade', component: UpgradeView },
        { path: '/action/:actionType/:cardsIds?', component: ActionView },
    ]
});

router.beforeEach(async (to) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/login','/register','/rules','/resetpassword'];
    const authRequired = !publicPages.includes(to.path);
    const auth = useAuthStore();

    if (authRequired && !auth.user) {
        auth.returnUrl = to.fullPath;
        return '/login';
    }
});

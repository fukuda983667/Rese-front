export default defineNuxtRouteMiddleware(async (to, from) => {
    const { user } = useSanctumAuth();

    if (!user.value) {
        return navigateTo("/login"); // ログインしていない場合はリダイレクト
    }

    if (user.value.role !== "admin") {
        return abortNavigation(); // ロールが'admin'でない場合はアクセス拒否
    }
});

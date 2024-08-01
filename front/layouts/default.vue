<template>
    <div>
        <header>
        <h1>My Nuxt Application</h1>
        <nav>
            <NuxtLink to="/">topへ</NuxtLink>
            <NuxtLink to="/menu">menuへ</NuxtLink>
            <NuxtLink to="/thanks">thanksへ</NuxtLink>
            <NuxtLink to="/done">doneへ</NuxtLink>
            <button v-if="loggedIn" @click="logout">Logout</button>
            <NuxtLink v-else to="/login">Login</NuxtLink>
            <NuxtLink to="/register">Register</NuxtLink>
        </nav>
        </header>
        <main>
        <NuxtPage />
        </main>
        <footer>
        <p>&copy; 2024 My Nuxt Application</p>
        </footer>
    </div>
</template>

<script setup>
    import { useRouter } from 'vue-router';
    const { user, loggedIn } = useAuth()
    const { $sanctumAuth } = useNuxtApp()
    const router = useRouter();

    const logout = async () => {
    try {
        await $sanctumAuth.logout();
        router.push('/login');
    } catch (error) {
        console.error('Logout error:', error);
    }
    };
</script>

<style>
body {
    display: flex;
    justify-content: center;
    margin: 0;
    background-color: #ededed;
}
</style>

<style scoped>
header {
    text-align: center;
}

nav a {
    margin-right: 10px;
    color: #333;
    text-decoration: none;
}

main {
    padding: 0 20px;
    max-width: 1350px;
    width: 100%;
    box-sizing: border-box;
}

footer {
    text-align: center;
    position: fixed;
    bottom: 0;
    width: 100%;
}
</style>
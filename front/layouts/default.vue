<template>
    <div>
        <header>
        <h1>My Nuxt Application</h1>
        <nav>
            <NuxtLink to="/">topへ</NuxtLink>
            <button v-if="loggedIn" @click="logout">Logout</button>
            <NuxtLink v-else to="/login">Login</NuxtLink>
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

<style scoped>
    header {
    background-color: #f5f5f5;
    padding: 1rem;
    text-align: center;
    }

    nav a {
    color: #333;
    margin-right: 1em;
    text-decoration: none;
    }

    main {
    padding: 2rem;
    }

    footer {
    background-color: #f5f5f5;
    padding: 1rem;
    text-align: center;
    position: fixed;
    bottom: 0;
    width: 100%;
    }
</style>
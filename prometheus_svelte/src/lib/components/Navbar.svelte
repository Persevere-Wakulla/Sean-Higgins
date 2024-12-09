<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { signOut } from '@auth/sveltekit/client';
	import { HomeModernIcon, UserGroupIcon, TrophyIcon } from "heroicons-svelte/24/solid";
    import me from '$lib/assets/me.jpg'

let topNav: HTMLDivElement = $state({} as HTMLDivElement)
</script>

<div bind:this={topNav} class="w-full z-20 fixed bg-gray-800 p-2 shadow-sm shadow-slate-400">
    <div class="flex w-full justify-between">
        <div class="flex items">
            <button onclick={() =>{goto(`/home`)}} 
                class:text-fuchsia-500={$page.route.id?.endsWith('[subscriber]')}
                class="hover:text-fuchsia-500 hover:cursor-pointer text-white duration-500 transition-all">
                <HomeModernIcon class="w-8 h-8"></HomeModernIcon>
            </button>
        </div>
        <div class="flex gap-6">
            <button  
            class:text-fuchsia-500={$page.route.id?.endsWith('/friends')}
            onclick={() =>{goto(`/home/friends`)}} class="hover:text-fuchsia-500 hover:cursor-pointer text-white duration-500 transition-all">
                <UserGroupIcon class="w-8 h-8"></UserGroupIcon>
            </button>
            <button 
            class:text-fuchsia-500={$page.route.id?.endsWith('/leaderboard')}
             onclick={() =>{goto(`/home/leaderboard`)}} class="hover:text-fuchsia-500 hover:cursor-pointer text-white duration-500 transition-all">
                <TrophyIcon class="w-8 h-8"></TrophyIcon>
            </button>
        </div>
        <div class="flex gap-6 text-white">
            <button onclick={() => signOut()}>
                <img src={me} alt="" class="w-8 h-9 rounded-full shadow-sm shadow-white">
            </button>
        </div>
    </div>
</div>
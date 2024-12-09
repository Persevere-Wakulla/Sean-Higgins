<script lang="ts">
  import { page } from "$app/stores";
  import { Toaster } from "svelte-french-toast";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import {
    isImpersonating,
    originalUser,
    project,
    user,
  } from "$lib/stores/layout";
  import { goto } from "$app/navigation";
  export let data;
  user.set(data);
</script>

<body class=" w-screen flex gap-2">
  <Toaster />
  <Sidebar />
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <main
    class="my-4 mx-auto w-full max-w-[1200px] select-none"
  >
    <div
      class="flex gap-4 justify-between items-center my-4 max-sm:my-0 max-sm:flex-col"
    >
      <div class="flex gap-2 items-center">
        {#if $page.url.pathname.endsWith("project")}
          <h4 class=" text-xs">Creating Project</h4>
        {:else}
          <h4 class=" text-xs">Project:</h4>
          <span
            class="text-2xl font-extrabold tracking-wider max-sm:text-sm max-sm:tracking-tighter"
            >{$project?.name}</span
          >
        {/if}
      </div>
      <div class="flex flex-col gap-2 items-center">
        <div class="flex gap-2 items-center">
          <h4 class="text-xs max-sm:hidden">Welcome</h4>
          <h2
            class=" text-2xl font-extrabold max-sm:text-sm max-sm:tracking-tighter font-[bell]"
          >
            {$user.firstName}
            {$user.lastName}
          </h2>
        </div>
        {#if !$page.url.pathname.endsWith("dashboard")}
          <button
            class="hover:shadow-none transition-all duration-500 bg-gradient-to-tr text-fuchsia-500 from-slate-900 to-zinc-700 text-lg px-2 shadow-md rounded shadow-zinc-600"
            on:click={() =>
              goto(`/${$user.id}/${$project?.projectId}/dashboard`)}
            >Dashboard</button
          >
        {/if}
        {#if $isImpersonating}
          <button
            class="hover:shadow-none transition-all duration-500 bg-gradient-to-tr text-fuchsia-500 from-slate-900 to-zinc-700 text-lg px-2 shadow-md rounded shadow-zinc-600"
            on:click={() => {
              user.set($originalUser);
              isImpersonating.set(false);
              goto(`/${$user.id}/${$project?.projectId}/dashboard`);
            }}>Stop Impersonating</button
          >
        {/if}
      </div>
      <h5 class="max-sm:text-sm">{new Date().toDateString()}</h5>
    </div>
    <slot />
  </main>
</body>

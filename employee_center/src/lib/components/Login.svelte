<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import { getRandomCredentials } from "$lib/database/server";
  import { user } from "$lib/stores/layout";

  $: employee_id = "";
  $: password = "";

  const retrieveData = async (type?: string) => {
    const json = await getRandomCredentials(type);
    employee_id = json.username;
    password = json.password;
    user.set(json);
  };
</script>


<section class=" max-sm:max-w-full max-sm:w-[90%] bg-gradient-to-bl from-slate-900 to-zinc-700 p-4 m-auto dark:text-white max-w-[400px] w-[60%] rounded shadow-md shadow-black">
  <div class="border-b-[1px] border-fuchsia-300">
    <div class="flex justify-between items-center  mb-4 mt-4">
      <i class="bi bi-clock-history text-blue-400 text-3xl"></i>
      
      <h3 class="text-2xl tracking-widest">Ticker Time</h3>
      <i class="bi bi-clock text-fuchsia-400 text-3xl"></i>
    </div>
  </div>
  <div class="my-6">
    <form method="POST" action="?/login" use:enhance>
      <div class="flex flex-col gap-4 w-[80%] mx-auto">
        <div class="relative">
          <label for="employee_id" class="text-lg">Employee Id: </label>
          <input
            bind:value={employee_id}
            class="border-b-[1px] px-2 border-fuchsia-300 mb-2 border-opacity-35 shadow-inner shadow-black bg-transparent"
            autocomplete="off"
            name="employee_id"
            id="employee_id"
            aria-label="Employee Id"
            type="text"
          />
        </div>
        <div class="relative">
          <label for="password" class="text-lg">Password: </label>
          <input
            bind:value={password}
            class="border-b-[1px] px-2 border-fuchsia-300 mb-2 border-opacity-35 shadow-inner shadow-black bg-transparent"
            autocomplete="off"
            name="password"
            aria-label="Password"
            type="password"
          />
        </div>
      </div>
      {#if $page.form?.message}
        <h5 class="text-center">{$page.form.message}</h5>
      {/if}
      <div class="flex justify-center">
        <button class="hover:shadow-none hover:bg-lime-700 transition-all duration-500 bg-lime-500 mt-8 cursor-pointer py-1 uppercase tracking-widest text-xl shadow-md shadow-black w-[80%]" type="submit">Login</button>
      </div>
    </form>
  </div>
</section>
<div class="relative">
  <div class="peer mx-auto text-center cursor-pointer bg-gradient-to-tr from-slate-900 to-zinc-700 p-4 shadow-md shadow-black select-none w-48 dark:text-white">
    <button on:click={() => retrieveData()}>
      <h1 class="text-xl">Get random login credentials</h1>
    </button>
    
  </div>
  <div class=" peer-hover:flex-col hover:flex hover:flex-col w-fit dark:text-white peer-hover:flex shadow-md shadow-black bg-gradient-to-bl from-slate-900 to-zinc-700 hidden absolute p-4 -top-full left-[45%] z-10 gap-4 h-[100px]">
    <button type="button" on:click={() => retrieveData("moderator")}
      ><h2 class="text-xl">Get Moderator Login</h2></button
    >
    <button type="button" on:click={() => retrieveData("admin")}
      ><h2 class="text-xl">Get Admin Login</h2></button
    >
  </div>
</div>


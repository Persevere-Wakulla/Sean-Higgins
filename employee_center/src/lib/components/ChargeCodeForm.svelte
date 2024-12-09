<script lang="ts">
  import { post, put } from "$lib/database/server";
  import { project } from "$lib/stores/layout";
  import toast from "svelte-french-toast";

  export let isNew = false;
  export let charge;


  const updateCode = async () => {
    await put("chargeCode/project", charge.chargeCodeId, charge);
    toast.success(`Updated ${charge.code} for ${$project?.name}`);
  };

  const createCode = async () => {
    await post("chargeCode", {...charge.getJson(), ...charge});
    toast.success(`Created ${charge.code} for ${$project?.name}`);
  };
  
</script>

{#if isNew}
  <div class="flex justify-center gap-2">
    <h4 class="text-center text-2xl">New Charge Code for:</h4>
    <span class="font-[bell] text-fuchsia-500 text-2xl"
      >{$project?.name}</span
    >
  </div>
{:else}
  <div class="flex justify-center gap-2">
    <h4 class="text-center text-2xl">Editing Charge Code:</h4>
    <span class=" font-[bell] text-fuchsia-500 text-2xl">{charge.code}</span>
  </div>
{/if}

<form action="?/update" method="POST" class="p-4">
  <section
    class="flex flex-col flex-wrap gap-4 w-1/2 max-sm:w-full max-sm:py-4"
  >
    <div class="relative">
      <label class="dark:text-fuchsia-300 text-black absolute bottom-full text-lg" for="code"
        >Code
      </label>
      {#if !isNew}
        <h4 class="mb-4 text-xl">{charge.code}</h4>
      {:else}
        <input
          autocomplete="off"
          class="bg-transparent select-none shadow-inner shadow-black px-2 border-b-[1px] border-fuchsia-400 border-opacity-45 mb-4 focus-within:outline-fuchsia-300"
          type="text"
          name="firstName"
          bind:value={charge.code}
        />
      {/if}

      <input
        type="hidden"
        name="chargeCodeId"
        bind:value={charge.chargeCodeId}
      />
      <input type="hidden" name="projectId" bind:value={charge.projectId} />
    </div>
    <div class="relative">
      <label
        class="dark:text-fuchsia-300 text-black absolute bottom-full text-lg"
        for="lastName">Description</label
      >
      <input
        autocomplete="off"
        class="bg-transparent shadow-inner shadow-black px-2 border-b-[1px] border-fuchsia-400 border-opacity-45 mb-4 focus-within:outline-fuchsia-300"
        type="text"
        name="lastName"
        bind:value={charge.descr}
      />
    </div>
    <div class="relative">
      <label
        class="dark:text-fuchsia-300 text-black absolute bottom-full text-lg"
        for="hours"
        >Hours
      </label>
      {#if !isNew}
        <h4 class="mb-4 text-xl">{charge.hours}</h4>
      {:else}
        <input
          autocomplete="off"
          class="bg-transparent shadow-inner shadow-black px-2 border-b-[1px] border-fuchsia-400 border-opacity-45 mb-4 focus-within:outline-fuchsia-300"
          type="number"
          name="hours"
          bind:value={charge.hours}
        />
      {/if}
    </div>
    <div class="relative">
      <label
        class="dark:text-fuchsia-300 text-black absolute bottom-full text-lg"
        for="username"
        >Rate per Hour
      </label>
      <input
        autocomplete="off"
        class="bg-transparent shadow-inner shadow-black px-2 border-b-[1px] border-fuchsia-400 border-opacity-45 mb-4 focus-within:outline-fuchsia-300"
        type="number"
        name="rate"
        bind:value={charge.rate}
      />
    </div>
    <div class="relative">
      <label class="dark:text-fuchsia-300 text-black absolute bottom-full text-lg" for="role"
        >Additional Hours (if over budget)
      </label>
      <input
        autocomplete="off"
        class="bg-transparent shadow-inner shadow-black px-2 border-b-[1px] border-fuchsia-400 border-opacity-45 mb-4 focus-within:outline-fuchsia-300"
        type="number"
        name="additionalHours"
        bind:value={charge.additionalHours}
      />
    </div>
  </section>

  <div class="flex justify-end">
    <button
      on:click={() => (!isNew ? updateCode() : createCode())}
      class=" transition-all text-black duration-500 rounded bg-lime-500 hover:shadow-none hover:bg-lime-700 hover:dark:text-white text-lg px-8 py-1 shadow-md shadow-slate-800 flex gap-4 content-center"
      type="button"><i class="bi bi-save"></i>Save</button
    >
  </div>
</form>

<script lang="ts">
  import { page } from "$app/stores";
  import { blur } from "svelte/transition";

  export let pageHeader;
</script>

<div
  class="md:w-full py-4 px-8 max-sm:px-2 max-sm:h-full select-none shadow-lg  shadow-zinc-900 text-nowrap rounded w-full bg-gradient-to-br from-gray-300 to-transparent from-40% dark:from-40% dark:bg-gradient-to-r dark:from-slate-900 dark:to-zinc-700"
>
  <h3 class=" dark:text-fuchsia-500 tracking-widest text-3xl max-sm:text-lg max-sm:text-center">{pageHeader}</h3>
  <div class="flex gap-4 max-sm:flex-col max-sm:gap-0">
    <div class="my-8 dark:dark:text-white flex flex-col gap-8 text-nowrap max-sm:my-2 max-sm:gap-4 max-sm:flex-row max-sm:flex-wrap max-sm:justify-center">
      <slot name="navigation" />
    </div>
    <div class=" w-full p-8 max-sm:p-2 dark:text-fuchsia-100 text-black overflow-x-hidden shadow-inner rounded-sm mt-4 shadow-black dark:bg-gradient-to-tl dark:from-slate-800 dark:to-slate-600">
      {#key $page.url.pathname}
      <div in:blur={{duration:700}}>
        <slot name="main" />
      </div>
      {/key}
    </div>
  </div>
</div>

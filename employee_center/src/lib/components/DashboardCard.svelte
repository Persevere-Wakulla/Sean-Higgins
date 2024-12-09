<script lang="ts">
  import { page } from "$app/stores";

  export let header;

</script>

<section
  class="flex flex-col max-w-fit max-sm:w-full max-sm:max-w-full w-72 min-w-72 py-4 px-8 select-none dark:shadow-lg shadow-md dark:shadow-zinc-900 shadow-zinc-500 text-nowrap rounded bg-gray-200 dark:bg-gradient-to-r dark:from-slate-900 dark:to-zinc-700"
>
  <h4 class="dark:text-fuchsia-500 text-fuchsia-700 text-2xl">{header}</h4>
  {#key $page.url.pathname}
    <slot><h4 class="dark:text-white text-xl">Could Not Load Anything</h4></slot>
  {/key}
</section>

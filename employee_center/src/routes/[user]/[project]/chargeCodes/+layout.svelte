<script>
  import GenericLayoutCard from "$lib/components/GenericLayoutCard.svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { project, user } from "$lib/stores/layout";
</script>

<GenericLayoutCard pageHeader="Project Charge Codes">
  <div slot="navigation">
    <ul class="flex flex-col gap-6 max-sm:flex-row">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <li
        on:click={() => goto(`/${$user.id}/${$project?.projectId}/chargeCodes`)}
        class:text-fuchsia-500={$page.url.pathname.endsWith("chargeCodes")}
        class="flex gap-4 cursor-pointer hover:text-fuchsia-500 transition-all duration-500"
      >
        <i class="bi bi-credit-card text-2xl"></i>
        <h4 class="text-xl">Existing</h4>
      </li>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <li
        on:click={() =>
          goto(`/${$user.id}/${$project?.projectId}/chargeCodes/create`)}
        class:text-fuchsia-500={$page.url.pathname.endsWith("create")}
        class="flex gap-4 cursor-pointer hover:text-fuchsia-500 transition-all duration-500"
      >
        <i class="bi bi-hammer text-2xl"></i>
        <h4 class="text-xl">Create</h4>
      </li>
    </ul>
  </div>
  <div slot="main" class="max-sm:p-4 h-[600px] max-sm:h-full" >
    <slot></slot>
  </div>
</GenericLayoutCard>

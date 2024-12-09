<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { project, user } from "$lib/stores/layout";
  import GenericLayoutCard from "$lib/components/GenericLayoutCard.svelte";

</script>

<GenericLayoutCard pageHeader={`${$project?.name} User Setup`}>
  <svelte:fragment slot="navigation">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      on:click={() => goto(`/${$user.id}/${$project?.projectId}/userSetup`)}
      class={` ${$page.url.pathname.endsWith("userSetup") ? "text-fuchsia-500" : "dark:text-white"} flex gap-4 items-center hover:text-fuchsia-500 hover:cursor-pointer transition-all duration-500`}
    >
      <i class="bi bi-people-fill text-2xl"></i>
      <h5 class="text-xl">Users View</h5>
    </div>
    <div
      class={`${$page.url.pathname.endsWith("create") ? " text-fuchsia-500" : "dark:text-white"} flex gap-4 items-center hover:text-fuchsia-500 hover:cursor-pointer transition-all duration-500`}
    >
      <i class="bi bi-person-plus-fill text-2xl"></i>
      <h5 class="text-xl">
        <a href={`/${$user.id}/${$project?.projectId}/userSetup/create`}
          >Create User</a
        >
      </h5>
    </div>
  </svelte:fragment>
  <div slot="main" class=" min-h-[600px] max-sm:h-full max-sm:min-h-full">
    <slot />
  </div>
</GenericLayoutCard>

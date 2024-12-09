<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { project, user } from "$lib/stores/layout";
</script>

<svelte:head>
  <title>Charge Codes</title>
  <meta name="description" content="Ticker Time" />
</svelte:head>

<table class="table snap-proximity border-spacing-0 w-full">
  <thead class="table-header-group border-b-[1px] border-fuchsia-300">
    <th class="text-justify"><h4 class="text-3xl">Charge Code</h4></th>
    <th class="text-justify"><h4 class="text-3xl">Description</h4></th>
    <th><h4 class="text-3xl text-justify">Hours Remaining/Original</h4></th>
  </thead>
  <tbody>
    {#each $page.data.codes as charge}
      <tr
        on:click={() =>
          goto(
            `/${$user.id}/${$project?.projectId}/chargeCodes/${charge.chargeCodeId}`
          )}
        class="table-row cursor-pointer border-b-[1px] border-fuchsia-300 hover:text-fuchsia-500 dark:hover:bg-gray-900 hover:bg-gray-300 duration-500 transition-all"
      >
        <td class="table-cell min-w-48 py-2"><h4>{charge.code}</h4></td>
        <td class="table-cell min-w-80 py-2"><h4>{charge.descr}</h4></td>
        <td class="flex py-2 mx-[20%] gap-4"
          >
          <h4
            class:bg-lime-500={(charge.hours + charge.additionalHours) <= charge.originalHours}
            class:bg-red-500={(charge.hours + charge.additionalHours) > charge.originalHours}
            class="text-center w-16 rounded-full shadow-sm shadow-black dark:text-white"
          >
            {charge.hours + charge.additionalHours}
          </h4>
          <h4
            class="text-center bg-lime-500 w-16 rounded-full shadow-sm shadow-black dark:text-white"
          >
            {charge.originalHours}
          </h4>
          </td
        >
      </tr>
    {:else}
      <h4>No Charge Codes for Project</h4>
    {/each}
  </tbody>
</table>

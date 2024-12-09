<script lang="ts">
  import { goto } from "$app/navigation";
  import { project, user } from "$lib/stores/layout";
  import type { PageData } from "./$types";

  export let data: PageData;

  const getHours = (hours: number[]) => {
    return hours.reduce((accum, curr) => accum + curr, 0);
  };
</script>

<svelte:head>
  <title>Timesheets</title>
  <meta name="description" content="Ticker Time" />
</svelte:head>

<table class="table min-w-full border-separate border-spacing-0 snap-proximity">
  <thead class="text-justify tracking-widest">
    <th
      scope="col"
      class=" border-fuchsia-300 backdrop-blur-xl text-sm font-semibold sticky top-0 z-10 border-b-[1px] px-2 py-3 border-opacity-75"
    >
      <h4 class="text-2xl text-fuchsia-400">Week</h4>
    </th>
    <th
      scope="col"
      class="border-fuchsia-300 backdrop-blur-xl text-sm font-semibold sticky top-0 z-10 border-b-[1px] px-2 py-3 border-opacity-75"
    >
      <h4 class="text-2xl text-fuchsia-400">Hours</h4>
    </th>
    <th
      scope="col"
      class="border-fuchsia-300 backdrop-blur-xl text-sm font-semibold sticky top-0 z-10 border-b-[1px] px-2 py-3 border-opacity-75"
    >
      <h4 class="text-2xl text-fuchsia-400">Status</h4>
    </th>
  </thead>
  <tbody>
    {#each data.userTimesheets.sort((a, b) => a.weekId < b.weekId ? 1: -1) as timesheet}
      <tr
        on:click={() => {
          goto(
            `/${$user.id}/${$project?.projectId}/timesheet/${timesheet.timesheetId}`
          );
        }}
        class=" table-row hover:cursor-pointer hover:text-fuchsia-500 dark:hover:bg-gray-900 hover:bg-gray-300 duration-500 transition-all"
      >
        <td
          class=" min-w-36 table-cell p-2 whitespace-nowrap border-b-[1px] border-fuchsia-300 text-sm font-medium"
        >
          <p class="text-lg tracking-wider">{timesheet.weekId}</p>
        </td>
        <td
          class="min-w-24 table-cell p-2 whitespace-nowrap border-b-[1px] border-fuchsia-300 text-sm font-medium"
        >
          {getHours(timesheet.days.map((x) => x.total))}
        </td>
        <td
          class="min-w-24 table-cell p-2 whitespace-nowrap border-b-[1px] border-fuchsia-300 text-sm font-medium"
        >
          {timesheet.status}
        </td>
      </tr>
    {/each}
  </tbody>
</table>

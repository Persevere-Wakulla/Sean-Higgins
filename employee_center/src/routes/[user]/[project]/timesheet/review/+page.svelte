<script lang="ts">
  import { goto } from "$app/navigation";
  import { user, project } from "$lib/stores/layout";
  import type { PageData } from "./$types";

  export let data: PageData;

  const getHours = (hours: number[]) => {
    return hours.reduce((accum, curr) => accum + curr, 0);
  };
</script>

<table class="table min-w-full border-separate border-spacing-0 snap-proximity">
  <thead class="text-justify tracking-widest">
    <th
      scope="col"
      class=" border-fuchsia-300 backdrop-blur-xl text-sm font-semibold sticky top-0 border-b-[1px] px-2 py-3 border-opacity-75"
    >
      <h4 class="text-2xl text-fuchsia-400">Employee</h4>
    </th>
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
  <tbody class="">
    {#each data.toReview as timesheet}
      <tr
        on:click={() => {
          goto(
            `/${$user.id}/${$project?.projectId}/timesheet/review/${timesheet.timesheetId}`
          );
        }}
        class=" table-row hover:cursor-pointer hover:text-fuchsia-500 dark:hover:bg-gray-900 hover:bg-gray-300 duration-500 transition-all"
      >
        <td
          class=" min-w-36 table-cell p-2 whitespace-nowrap border-b-[1px] border-fuchsia-300 text-sm font-medium"
        >
        <h4 class="text-xl">
            {timesheet.employee.firstName}
            {timesheet.employee.lastName}
        </h4>
        </td>
        <td
          class="min-w-24 table-cell p-2 whitespace-nowrap border-b-[1px] border-fuchsia-300 text-sm font-medium"
        >
        <h5 class="text-xl">{timesheet.weekId}</h5>
        </td>
        <td
          class="min-w-24 table-cell p-2 whitespace-nowrap border-b-[1px] border-fuchsia-300 text-sm font-medium"
        >
        <h5>{getHours(timesheet.days.map(x=> x.total))}</h5>
        </td>
        <td
          class="min-w-24 table-cell p-2 whitespace-nowrap border-b-[1px] border-fuchsia-300 text-sm font-medium"
        >
        <h5>{timesheet.status === 'Submitted' && 'Needs Review'}</h5>
        </td>
      </tr>
      {:else}
        <tr>
            <td>No Timesheets to review</td>
        </tr>
    {/each}
  </tbody>
</table>

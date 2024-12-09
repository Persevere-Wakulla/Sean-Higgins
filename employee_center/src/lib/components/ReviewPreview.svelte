<script>
  import { goto } from "$app/navigation";
  import { project, user } from "$lib/stores/layout";

  export let timesheets;
</script>

<table class="table min-w-full snap-proximity">
  <thead class="dark:text-white">
    <th class="text-2xl text-justify">Employee</th>
    <th class="text-2xl text-justify">Week</th>
  </thead>
  <tbody>
    {#each timesheets as timesheet}
      <tr
        on:click={() =>
          goto(
            `/${$user.id}/${$project?.projectId}/timesheet/review/${timesheet.timesheetId}`
          )}
        class="table-row text-black dark:hover:bg-gray-900 hover:bg-gray-300 duration-500 transition-all hover:cursor-pointer"
      >
        <td class="table-cell min-w-36 w-1/2">
          <span class="flex items-center">
            <span
              class="rounded-full bg-fuchsia-500 px-[.5rem] flex items-center justify-center shadow-lg shadow-black"
            >
              <h4>{timesheet.employee.firstName} {timesheet.employee.lastName}</h4>
            </span>
          </span>
        </td>
        <td class="table-cell w-1/2 min-w-16 py-1">
          <span class="flex justify-between items-center relative">
            <span
              class="rounded-full bg-blue-300 px-[.5rem] flex items-center justify-center relative shadow-lg shadow-black"
            >
              <h4>{timesheet.weekId}</h4>
            </span>
          </span>
        </td>
      </tr>
    {:else}
      <tr>
        <td colspan="2"><h4 class="dark:text-white">No timesheets to review</h4></td>
      </tr>
    {/each}
  </tbody>
</table>

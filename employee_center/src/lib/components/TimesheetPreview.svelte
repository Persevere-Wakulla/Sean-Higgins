<script>

  import { goto } from "$app/navigation";
  import { project, user } from "$lib/stores/layout";

  export let timesheets;
</script>
<table class="table min-w-full snap-proximity">
    <thead class="dark:text-white">
      <th class="text-2xl text-justify">Week</th>
      <th class="text-2xl text-justify">Hours</th>
    </thead>
    <tbody>
      {#each timesheets as timesheet}
        <tr
          on:click={() => goto(`/${$user.id}/${$project?.projectId}/timesheet/${timesheet.timesheetId}`)}
          class="table-row text-black dark:hover:bg-gray-900 hover:bg-gray-300 duration-500 transition-all hover:cursor-pointer"
        >
          <td class="table-cell min-w-36 w-1/2">
            <span class="flex items-center">
              <span class="rounded-full bg-blue-300 px-[.5rem] py-1 flex items-center justify-center shadow-lg shadow-black">
                <h4>{timesheet.weekId}</h4>
              </span>
            </span>
          </td>
          <td class="table-cell w-1/2 min-w-16 py-1">
            <span class="flex justify-between items-center relative">
              <span 
              class:bg-red-500={timesheet.days.map((x) => x.total).reduce((a, b) => a + b, 0) > 40}
              class="rounded-full bg-blue-300 px-[1rem] py-1 flex w-6 items-center justify-center relative shadow-lg shadow-black">
                <h4 class="peer">{timesheet.days.map((x) => x.total).reduce((a, b) => a + b, 0)}</h4>
                <div
                class="absolute hidden peer-hover:flex bottom-full dark:text-white z-50 backdrop-blur-md bg-slate-800 px-2 py-1 text-sm rounded-md shadow-sm shadow-black"
              >
                {timesheet.days.map((x) => x.total).reduce((a, b) => a + b, 0) < 10 ? 'Partime' : timesheet.days.map((x) => x.total).reduce((a, b) => a + b, 0) > 40 ? 'Overtime' : 'Regular Hours'}
              </div>
              </span>
              <i
                class:bi-watch={timesheet.status === "Unsubmitted"}
                class:bg-lime-400={timesheet.status === "Unsubmitted"}
                class:bi-airplane={timesheet.status === "Submitted"}
                class:bg-lime-500={["Submitted",'Paid'].includes(timesheet.status)}
                class:bi-sign-stop={timesheet.status === "Rejected"}
                class:bg-red-400={timesheet.status === "Rejected"}
                class:bi-check={timesheet.status === "Approved"}
                class:bg-blue-400={timesheet.status === "Approved"}
                class:bi-currency-dollar={timesheet.status === "Paid"}
                class="peer bi bi-check bg-red-400 px-[0.5rem] py-1 rounded-full text-black shadow-md shadow-slate-800"
              ></i>
              <div
                class="absolute hidden peer-hover:flex bottom-full dark:text-white left-1/3 z-50 backdrop-blur-md bg-slate-800 px-2 py-1 text-sm rounded-md shadow-sm shadow-black"
              >
                {timesheet.status}
              </div>
            </span>
          </td>
        </tr>
      {:else}
        <tr>
            <td colspan="2"><h4 class="dark:text-white">No timesheets</h4></td>
        </tr>
      {/each}
    </tbody>
  </table>
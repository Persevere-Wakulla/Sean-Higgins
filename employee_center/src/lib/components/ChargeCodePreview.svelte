<script>

    import { goto } from "$app/navigation";
    import { project, user } from "$lib/stores/layout";
  
    export let chargeCodes;
  </script>
  <table class="table min-w-full snap-proximity">
      <thead class="dark:text-white">
        <th class="text-2xl text-justify">Code</th>
        <th class="text-2xl text-justify">Hours</th>
      </thead>
      <tbody>
        {#each chargeCodes as charge}
          <tr
            on:click={() => goto(`/${$user.id}/${$project?.projectId}/chargeCodes/${charge.chargeCodeId}`)}
            class="table-row text-black dark:hover:bg-gray-900 hover:bg-gray-300 duration-500 transition-all hover:cursor-pointer"
          >
            <td class="table-cell min-w-36 w-1/2">
              <span class="flex items-center">
                <span class="rounded-full bg-blue-300 px-[.5rem] py-1 flex items-center justify-center shadow-lg shadow-black">
                  <h4>{charge.code}</h4>
                </span>
              </span>
            </td>
            <td class="table-cell w-1/2 min-w-16 py-1">
              <span class="flex justify-between items-center relative">
                  <div class="peer rounded-full bg-lime-300 px-[.5rem] w-16 py-1 flex items-center justify-center shadow-lg shadow-black">{charge.hours + charge.additionalHours}</div>
                <div
                  class="absolute hidden peer-hover:flex peer-hover:flex-col bottom-full dark:text-white left-1/3 z-50 backdrop-blur-md bg-slate-800 px-2 py-1 text-sm rounded-md shadow-sm shadow-black"
                >
                    <h4>Original:{charge.hours}</h4>
                    <h4>Additional: {charge.additionalHours}</h4>
                </div>
              </span>
            </td>
          </tr>
        {:else}
          <tr>
              <td colspan="2"><h4 class="dark:text-white">No project charge codes</h4></td>
          </tr>
        {/each}
        <tr>
            <td colspan="2">
                <div class="flex justify-center">
                    <button 
                    on:click={() => goto(`/${$user.id}/${$project?.projectId}/chargeCodes/create`)}
                    class="dark:text-white px-4 my-4 bg-fuchsia-500 flex gap-4 shadow-md shadow-black rounded hover:bg-fuchsia-700 hover:shadow-none duration-500 transition-all">
                        <i class="bi bi-gear"></i>
                        Create</button>
                </div>
            </td>
        </tr>
      </tbody>
    </table>
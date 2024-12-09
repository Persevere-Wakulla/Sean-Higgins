<script lang="ts">
  import { goto, invalidate } from "$app/navigation";
  import { page } from "$app/stores";
  import { deleteItem, put } from "$lib/database/server";
  import {
    allProjects,
    isImpersonating,
    originalUser,
    user,
    type User,
  } from "$lib/stores/layout";
  import toast from "svelte-french-toast";

  export let users;
  export let skip;
  export let total;
  export let pageChange;
  $: configUser = {};
  $: pageNum = 1;
  $: currentFilter = {
    sortBy: "",
    ordering: "",
  };
  $: order = {
    firstName: false,
    lastName: false,
    role: false,
    ssn: false,
  };

  let dialog: HTMLDialogElement;
  let configMenu: HTMLElement;

  const changeOrder = (val: boolean) => (val ? "asc" : "desc");

  const handleUpdate = async (isDisabled = false) => {
    await put("user", configUser.id, configUser);

    if (!isDisabled) {
      toast.success(
        `Updated ${configUser.firstName} ${configUser.lastName}`
      );
    } else {
      toast.success(`Disabled ${configUser.firstName} ${configUser.lastName}`);
    }

    invalidate("userSetup:id");
  };

  const handleRemove = async (person: User) => {
    await deleteItem("user", person.id);

    toast.success(`Deleted ${person.firstName} ${person.lastName} from system`);

    invalidate("userSetup:id");
  };
</script>

<dialog
  bind:this={dialog}
  class="w-1/2 m-auto shadow-lg z-40 shadow-black rounded bg-gradient-to-bl from-slate-900 to-zinc-700"
>
  <div class="flex flex-col p-4 gap-6">
    <h4 class="text-3xl text-fuchsia-500">
      Move {configUser.firstName}
      {configUser.lastName} to other Projects
    </h4>
    <div class="flex w-full">
      {#if configUser.hasOwnProperty("projectId")}
        <select
          multiple
          bind:value={configUser.projectId}
          name="project"
          id="project"
          class="p-4 overflow-y-auto w-full h-[400px] max-h-[400px] shadow-md shadow-black dark:text-white bg-gradient-to-bl from-slate-700 to-zinc-700 outline-fuchsia-500 border-fuchsia-500"
        >
          {#each $allProjects as project (project.projectId)}
            <option
              value={project.projectId}
              class="checked:text-fuchsia-500 checked:bg-transparent"
            >
              {project.name}
            </option>
          {:else}
            <h4>No projects loaded</h4>
          {/each}
        </select>
      {/if}
    </div>
    <div class="flex justify-center">
      <h4 class="dark:text-white">Hold ctrl to select multiple</h4>
    </div>
    <div class="flex justify-end gap-4">
      <button
        class="bg-teal-400 px-8 shadow-md shadow-black hover:bg-teal-600 hover:shadow-none duration-500 transition-all"
        on:click={() => dialog.close()}>Close</button
      >
      <button
        class="bg-lime-500 px-8 shadow-md shadow-black hover:bg-lime-700 hover:shadow-none duration-500 transition-all"
        on:click={() => {
          handleUpdate();
          dialog.close();
        }}>Update</button
      >
    </div>
  </div>
</dialog>

<table
  class="table table-fixed"
  on:mouseleave={() => {
    configMenu.querySelectorAll(".config-menu").forEach((x) => {
      x.classList.add("hidden");
    });
  }}
>
  <thead class=" text-fuchsia-500 tracking-widest">
    <tr>
      <th class="w-6"></th>
      <th
        class="cursor-pointer w-36 text-start text-2xl"
        on:click={() => {
          order.firstName = !order.firstName;
          currentFilter.sortBy = "firstName";
          currentFilter.ordering = order.firstName ? "asc" : "desc";
          pageChange(pageNum, "firstName", changeOrder(order.firstName));
        }}>First</th
      >
      <th
        class="cursor-pointer w-36 text-start text-2xl"
        on:click={() => {
          order.lastName = !order.lastName;
          currentFilter.sortBy = "lastName";
          currentFilter.ordering = order.lastName ? "asc" : "desc";
          pageChange(pageNum, "lastName", changeOrder(order.lastName));
        }}>Last</th
      >
      <th
        class="cursor-pointer w-36 text-start text-2xl"
        on:click={() => {
          order.role = !order.role;
          currentFilter.sortBy = "role";
          currentFilter.ordering = order.role ? "asc" : "desc";
          pageChange(pageNum, "role", changeOrder(order.role));
        }}>Role</th
      >
      <th
        class="cursor-pointer w-36 text-start text-2xl"
        on:click={() => {
          order.ssn = !order.ssn;
          currentFilter.sortBy = "ssn";
          currentFilter.ordering = order.ssn ? "asc" : "desc";
          pageChange(pageNum, "ssn", changeOrder(order.ssn));
        }}>SSN</th
      >
      <th class=" w-36 text-start text-2xl">Reports</th>
    </tr>
  </thead>
  <tbody
    class="dark:text-fuchsia-200 text-fuchsia-950 transition-all select-none"
    bind:this={configMenu}
  >
    {#each users as person (person.id)}
      <tr
        on:mouseenter={() => {
          configMenu.querySelectorAll(".config-menu").forEach((x) => {
            x.classList.add("hidden");
          });
        }}
        class:line-through={person.isDisabled}
        class:text-fuchsia-400={person.isDisabled}
        class="border-b-[1px]  dark:border-fuchsia-300 border-fuchsia-700 tracking-wider hover:text-fuchsia-500 transition-all duration-500 dark:hover:bg-gray-900 hover:bg-gray-300 hover:cursor-pointer"
      >
        <td class="relative">
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <i
            class="peer bi bi-gear"
            on:mouseenter={() => {
              let menu = document.getElementById(`${person.id}`);
              menu?.classList.remove("hidden");
            }}
          ></i>

          <div
            id={person.id}
            class="config-menu hidden p-4 absolute z-20 left-0 top-full shadow-lg shadow-black rounded bg-gradient-to-bl from-slate-900 to-zinc-700 dark:text-white"
          >
            <ul class="flex flex-col gap-2">
              <li
                class="duration-500 transition-all hover:text-fuchsia-500 flex gap-4"
              >
                <i class="bi bi-cone-striped"></i>
                <button
                  on:click={() => {
                    configUser = {
                      ...person,
                      projectId: [...person.projectId],
                    };
                    dialog.show();
                    document.getElementById(person.id)?.classList.add("hidden");
                  }}>Assign new Project</button
                >
              </li>
              {#if $user.id !== person.id}
                <li
                  class="duration-500 transition-all hover:text-fuchsia-500 flex gap-4"
                >
                  <i class="bi bi-robot"></i>
                  <button
                    on:click={() => {
                      isImpersonating.set(true);
                      originalUser.set($user);
                      user.set({ ...person });
                      goto(`/${person.id}/${person.projectId[0]}/dashboard`);
                    }}>Impersonate User</button
                  >
                </li>

                <li
                  class="duration-500 transition-all hover:text-fuchsia-500 flex gap-4"
                >
                  {#if !person.isDisabled}
                    <i class="bi bi-fire"></i>
                    <button
                      on:click={() => {
                        configUser = person;
                        configUser.isDisabled = true;
                        handleUpdate(true);
                      }}>Disable User</button
                    >
                  {:else}
                  <i class="bi bi-activity"></i>
                  <button
                    on:click={() => {
                      configUser = person;
                      configUser.isDisabled = false;
                      handleUpdate();
                    }}>ReEnable User</button
                  >
                  {/if}
                </li>
                {#if person.role !== "admin"}
                  <li
                    class="duration-500 transition-all hover:text-fuchsia-500 text-red-700 flex gap-4"
                  >
                    <i class="bi bi-trash"></i>
                    <button on:click={() => handleRemove(person)}
                      >Remove (not recommended)</button
                    >
                  </li>
                {/if}
              {/if}
            </ul>
          </div>
        </td>
        <td on:click={() => goto(`userSetup/${person.id}`)}
          ><h4 class="p-2 text-lg">{person.firstName}</h4></td
        >
        <td on:click={() => goto(`userSetup/${person.id}`)}
          ><h4 class="p-2 text-lg">{person.lastName}</h4></td
        >
        <td on:click={() => goto(`userSetup/${person.id}`)}
          ><h4 class="p-2 text-lg">{person.role}</h4></td
        >
        <td on:click={() => goto(`userSetup/${person.id}`)}
          ><h4 class="p-2 text-lg tracking-widest">
            {person.ssn.slice(-4).padStart(9, "*")}
          </h4></td
        >
        <td on:click={() => goto(`userSetup/${person.id}`)}
          ><h4 class="p-2 text-lg">
            {person.reportsToName ?? "Not Set"}
          </h4></td
        >
      </tr>
    {:else}
      <tr>
        <td>No Data</td>
      </tr>
    {/each}
  </tbody>
  <tfoot>
    <tr>
      <td class="text-xl">
        {#if skip === 0}
          Page: 1
        {:else}
          Page: {pageNum}
        {/if}</td
      >
      <td colspan="4">
        <div class="flex w-full justify-center">
          {#if pageNum > 1}
            <button
              class="border-none bg-transparent p-4 cursor-pointer hover:text-fuchsia-500 transition-all duration-300 text-xl"
              type="button"
              on:click={() => {
                pageNum--;
                pageChange(
                  pageNum,
                  currentFilter.sortBy,
                  currentFilter.ordering
                );
              }}>Prev</button
            >
          {:else}
            <button disabled class="p-4 invisible">Prev</button>
          {/if}
          {#if users.length > 0 && users[users.length - 1].id < total}
            <button
              class="border-none bg-transparent p-4 cursor-pointer hover:text-fuchsia-500 transition-all duration-300 text-xl"
              type="button"
              on:click={() => {
                pageNum++;
                pageChange(
                  pageNum,
                  currentFilter.sortBy,
                  currentFilter.ordering
                );
              }}>Next</button
            >
          {/if}
        </div>
      </td>
      <td class="text-right text-xl">Total: {total}</td>
    </tr>
  </tfoot>
</table>

<style>
  .table {
    width: 100%;
    caption-side: bottom;
    border-collapse: collapse;
    overflow: auto;
  }
</style>

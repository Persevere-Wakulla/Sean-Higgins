<script lang="ts">
  import { onMount } from "svelte";
  import { allProjects, project as projectStore, user } from "../stores/layout";
  import { getAll } from "$lib/database/server";
  import { goto, invalidate } from "$app/navigation";

  $: myProjects = [];

  export let isAdmin = false;

  onMount(async () => {
    let response = await getAll("project");
    myProjects = [...response.data];
    allProjects.set(myProjects);
  });

  $: filteredProjects = myProjects;
  $: projectSelected = myProjects.find(
    (x) => x.projectId === $user.projectId[0]
  ) ?? { name: "", projectId: 0 };
  $: projectStore.set(projectSelected);
</script>

<div class="mt-2">
  {#if isAdmin}
    <input
      type="text"
      value={projectSelected.name}
      class=" text-center placeholder:text-center placeholder:text-teal-800 dark:text-white peer bg-transparent text-lg"
      placeholder="Change Project"
      on:focusout={(e) =>
        (e.target.value =
          e.target?.value === "" ? projectSelected.name : e.target?.value)}
      on:keyup={(e) => {
        filteredProjects = myProjects.filter((x) =>
          x.name.toLowerCase().includes(e.target?.value.toLowerCase())
        );
      }}
    />
    <div
      class="hidden hover:flex peer-focus-within:flex absolute bg-slate-800 text-slate-400 p-4 w-full shadow-md shadow-slate-800 flex-col gap-2 max-h-[40%] overflow-y-auto"
    >
      {#each filteredProjects as project}
        <button
          on:click={() => {
            projectSelected = project;
            goto(`/${$user.id}/${project.projectId}/dashboard`);
          }}
          class="text-justify cursor-pointer duration-300 transition-all hover:text-fuchsia-500 font-bold"
          >{project.name}</button
        >
      {/each}
    </div>
  {:else if $user.projectId.length > 1}
    <input
      type="text"
      value={projectSelected.name}
      class=" text-center placeholder:text-center placeholder:text-teal-800 dark:text-white peer bg-transparent text-lg"
      placeholder="Change Project"
      on:focusout={(e) =>
        (e.target.value =
          e.target?.value === "" ? projectSelected.name : e.target?.value)}
      on:keyup={(e) => {
        filteredProjects = myProjects.filter((x) => $user.projectId.includes(x.projectId)).filter((x) =>
          x.name.toLowerCase().includes(e.target?.value.toLowerCase())
        );
      }}
    />
    <div
      class="hidden hover:flex peer-focus-within:flex absolute bg-slate-800 text-slate-400 p-4 w-full shadow-md shadow-slate-800 flex-col gap-2 max-h-[40%] overflow-y-auto"
    >
      {#each filteredProjects.filter(x=> $user.projectId.includes(x.projectId)) as project}
        <button
          on:click={() => {
            projectSelected = project;
            invalidate(`dashboard:${project.projectId}`)
            goto(`/${$user.id}/${project.projectId}/dashboard`);
          }}
          class="text-justify cursor-pointer duration-300 transition-all hover:text-fuchsia-500 font-bold"
          >{project.name}</button
        >
      {/each}
    </div>
  {:else}
    <h4 class="text-center font-extrabold text-2xl text-fuchsia-100">
      {projectSelected.name}
    </h4>
  {/if}
</div>

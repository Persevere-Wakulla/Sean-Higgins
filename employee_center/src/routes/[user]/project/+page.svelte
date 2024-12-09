<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import GenericLayoutCard from "$lib/components/GenericLayoutCard.svelte";
  import type Project from "$lib/types/project";
  import toast from "svelte-french-toast";
  import type { ActionData, PageData } from "./$types";
  import MultiSelect from "svelte-multiselect";
  import { goto, invalidate } from "$app/navigation";
  import { user, project as projectStore } from "$lib/stores/layout";

  export let data: PageData;

  $: project = {} as Project;
  $: selected = [];

  const options = data.employees.map((x) => {
    x.label = `${x.firstName} ${x.lastName}`;
    return x;
  });
</script>

<GenericLayoutCard pageHeader="New Project Creation Tool">
  <div slot="main" class="h-[600px]">
    <form
      action="?/project"
      method="post"
      use:enhance={() => {
        return async ({ result }) => {
          toast.success(`Created Project: ${project.name}`);
          await applyAction(result);
          projectStore.set(result.data.project);
          invalidate(`dashboard:${project.projectId}`)
          setTimeout(() => {
            goto(`/${$user.id}/${result.data.project.projectId}/dashboard`)
          }, 200);
        };
      }}
    >
      <div class="flex flex-col gap-4">
        <div class="flex justify-center gap-2">
          <h4 class="text-2xl">Project:</h4>
          <span class="text-fuchsia-500 font-[bell] text-2xl"
            >{project.name ?? ""}</span
          >
        </div>
        <input
          autocomplete="off"
          class="bg-transparent shadow-inner shadow-black border-b-2 border-fuchsia-500 border-opacity-50"
          type="text"
          bind:value={project.name}
          name="projectName"
        />
      </div>
      <div class="flex flex-col gap-2 mt-8">
        <div class="flex gap-2">
          <h4 class="text-2xl">
            Add Employees <span class="text-sm">(optional)</span>
          </h4>
        </div>
        <MultiSelect
          --sms-options-max-height="200px"
          --sms-li-active-bg="rgb(57, 52, 55)"
          liOptionClass="bg-slate-700 dark:text-white text-xl tracking-widest"
          bind:selected
          {options}
          let:option
          name="employees"
        >
          <span>
            {option.firstName}
            {option.lastName}
          </span>
        </MultiSelect>
      </div>
      <div class="flex justify-end mt-8">
        <button
          type="submit"
          disabled={project.name === "" || project.name === undefined}
          class="px-8 py-1 disabled:bg-lime-800 disabled:cursor-not-allowed hover:shadow-none hover:bg-lime-800 transition-all duration-500 font-semibold bg-lime-500 rounded-md text-gray-100 text-xl shadow-md shadow-black"
          >Create</button
        >
      </div>
    </form>
  </div>
</GenericLayoutCard>

<style>
  ::highlight(sms-search-matches) {
    color: rgb(222, 36, 166);
  }
</style>

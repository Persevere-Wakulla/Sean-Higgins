<script lang="ts">
  import { enhance } from "$app/forms";
  import { getAll } from "$lib/database/server";
  import UserSetupCard from "$lib/components/UserSetupCard.svelte";
  import type { PageData } from "./$types";
  import { page } from "$app/stores";
  import { project } from "$lib/stores/layout";

  export let data: PageData;

  $: searchBar = '';

  const updatePage = async (
    page: number,
    sortBy?: string,
    ordering?: string
  ) => {
    const limit = 12;
    let skip = limit * (page - 1);
    if(page === 1){
      skip = 0;
    }
    let qs = `setupUser/project/${$project?.projectId}/filter?limit=${limit}&skip=${skip}`;
    if (sortBy) {
      qs += `&sortBy=${sortBy}&order=${ordering}`;
    }
    await retreiveData(qs);
  };

  const retreiveData = async (qs: string) => {
    const response = await getAll(qs);
    data = response.data;
  };
</script>

<svelte:head>
  <title>Setup</title>
  <meta name="description" content="Ticker Time" />
</svelte:head>


<div class="flex flex-col gap-6">
  <form method="post" action="?/filter" class="flex gap-4 w-1/2 mx-auto" use:enhance>
    <input
      name="lastName"
      type="text"
      autocomplete="off"
      bind:value={searchBar}
      class=" dark:border-b-2 border-b dark:border-white border-slate-800 border-opacity-65 bg-transparent px-4 placeholder:text-black"
      placeholder="Search..."
    />
    <button type="submit">
    <i class="bi bi-search text-xl dark:text-white"></i>
    </button>
  </form>
  <UserSetupCard
    users={$page.form?.users ?? data.users}
    skip={$page.form?.skip ?? data.skip}
    total={$page.form?.total ?? data.total}
    pageChange={updatePage}
  />
</div>

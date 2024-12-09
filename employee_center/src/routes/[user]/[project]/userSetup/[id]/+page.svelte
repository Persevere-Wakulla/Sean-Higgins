<script lang="ts">
  import type { PageData } from "../$types";
  import UserSetupEdit from "$lib/components/UserSetupEdit.svelte";

  `// your script goes here`;
  export let data: PageData;
</script>

<UserSetupEdit user={data.user} reportsTo={data.reportsToUsers} isNew={false} />

<style>
  /* your styles go here */
</style>

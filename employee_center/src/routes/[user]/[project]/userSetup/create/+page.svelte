<script lang="ts">
  import { User } from "$lib/classes/user";
  import UserSetupEdit from "$lib/components/UserSetupEdit.svelte";

    let user = new User();

    export let data;
    
</script>

<div>
    <UserSetupEdit {user} reportsTo={data.reportsToUsers} isNew={true}  />
</div>
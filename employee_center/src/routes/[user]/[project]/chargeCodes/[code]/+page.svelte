<script lang="ts">
  import ChargeCodeForm from "$lib/components/ChargeCodeForm.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  
  let isNew = false;
</script>

<ChargeCodeForm charge={data.chargeCode} {isNew}></ChargeCodeForm>

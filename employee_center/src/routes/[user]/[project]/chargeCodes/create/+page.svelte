<script lang="ts">
  import Charge from "$lib/classes/charge";
  import ChargeCodeForm from "$lib/components/ChargeCodeForm.svelte";

  let charge = new Charge();
  let isNew = true;
</script>

<ChargeCodeForm {charge} {isNew}></ChargeCodeForm>

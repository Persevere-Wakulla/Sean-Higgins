<script lang="ts">
  import type PayCheck from "$lib/types/paycheck";

  import type { PageData } from "./$types";

  export let data: PageData;

  const { check }: { check: PayCheck } = data;
</script>

<section class="flex flex-col gap-4 w-full">
  <div class="flex justify-between">
    <div class="flex flex-col">
        <h2 class="text-3xl text-fuchsia-500">{check.name}</h2>
        <h4 class="text-md tracking-widest">{check.ssn.slice(-4).toString().padStart(11, '*')}</h4>
        <h4 class="text-md">{check.title}</h4>
        <h4 class="text-lg">{check.company}</h4>
    </div>
    <div class="flex flex-col">
        <h2 class="text-3xl">{check.week}</h2>
        <h4 class="text-sm">{check.employeeAddress.street}</h4>
        <h4 class="text-sm">{check.employeeAddress.city} {check.employeeAddress.state}</h4>
        <h4 class="text-sm">{check.employeeAddress.zip}</h4>
    </div>
  </div>
  <div class="flex justify-between w-full border-b ">
    <h4 class="text-2xl">Net Pay:</h4>
    <h4 class="text-xl text-lime-400 tracking-widest">${check.totalPay.toFixed(2)}</h4>
  </div>
  <div class="flex justify-between">
    <h4 class="text-xl">Federal Taxes:</h4>
    <h4 class="text-xl text-red-400 tracking-widest">${check.taxes.toFixed(2)}</h4>
  </div>
  {#if check.medicalCost}
     <div class="flex justify-between">
       <h4 class="text-xl">Monthly Health Plan:</h4>
       <h4 class="text-xl text-red-400 tracking-widest">${check.medicalCost.toFixed(2)}</h4>
     </div>
  {/if}
  <div class="flex justify-between w-full">
    <h4 class="text-xl">Social Security:</h4>
    <h4 class="text-xl text-red-400 tracking-widest">${check.socialSecurity.toFixed(2)}</h4>
  </div>
  <div class="flex justify-between w-full">
    <h4 class="text-xl">401k Deduction:</h4>
    <h4 class="text-xl text-red-400 tracking-widest">${check.stockContribution.toFixed(2)}</h4>
  </div>
  <div class="flex justify-between w-full border-t">
    <h4 class="text-2xl">Gross Pay:</h4>
    <h4 class="text-xl text-lime-400 tracking-widest">${check.basePay.toFixed(2)}</h4>
  </div>
</section>

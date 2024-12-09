<script lang="ts">
  import { goto } from '$app/navigation';
  import { user } from '$lib/stores/layout';
    import type { PageData } from './$types';
    
    export let data: PageData;
</script>

<div class="flex justify-between mb-4">
    <h4 class="text-2xl tracking-widest">Net Ytd: <span class="text-lime-500">${data.netYtd.toFixed(2)}</span></h4>
    <h4 class="text-2xl tracking-widest">Gross Ytd: <span class="text-lime-500">${data.grossYtd.toFixed(2)}</span></h4>
</div>
<table class="table table-fixed w-full">
    <thead class="tracking-widest">
        <th class="text-justify text-2xl">Week</th>
        <th class="text-justify text-2xl">Total</th>
    </thead>
    <tbody>
        {#each data.checks as check (check.payCheckId)}
             <tr on:click={() => goto(`/${$user.id}/benefits/deposit/${check.payCheckId}`)} class="border-b-[1px]  border-fuchsia-300 tracking-wider hover:text-fuchsia-500 transition-all duration-500 dark:hover:bg-gray-900 hover:bg-gray-300 hover:cursor-pointer">
                <td class=" table-cell text-lg">{check.week}</td>
                <td class=" table-cell text-lg tracking-widest text-lime-500"><span class="text-2xl">$</span>{check.totalPay.toFixed(2)}</td>
             </tr>
        {/each}
    </tbody>
</table>
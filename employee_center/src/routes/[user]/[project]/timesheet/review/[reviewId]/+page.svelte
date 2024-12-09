<script lang="ts">
  import Timesheet from '$lib/components/Timesheet.svelte';
  import { currentTimesheet } from '$lib/stores/layout';
    import type { PageData } from './$types';
    
    export let data: PageData;

    currentTimesheet.set(data.timesheet);
</script>


<div class=" h-[40rem]">
    <Timesheet isReview={data.isReview}/>
  </div>
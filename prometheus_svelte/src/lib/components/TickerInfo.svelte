<script lang="ts">
  import format from "number-format.js";

  let { ticker }: {ticker: any} = $props();
</script>

<div class="flex w-full justify-center gap-20 text-slate-300">
    <div class="flex flex-col items-center">
        <h4 class="text-lg">{ticker.name}</h4>
        <h4 class="text-lg">{ticker.symbol}</h4>
        <h4 class="text-lg">
          {format("$#,###.####", ticker.marketCap)}
        </h4>
        <h4 class="text-lg">{ticker.sector}</h4>
        <h4 class="text-lg">{ticker.industry}</h4>
        <h4 class="text-lg">{ticker.country}</h4>
        <h4 class="text-lg">{ticker.ipoyear && `IPO: ${ticker.ipoyear}`}</h4>

    </div>
</div>

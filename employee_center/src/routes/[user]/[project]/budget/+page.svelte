<script lang="ts">
  import { project } from "$lib/stores/layout";
  import * as Plot from "@observablehq/plot";

  export let data: PageData;
  let div: HTMLElement;

  $: {
    div?.firstChild?.remove(); // remove old chart, if any
    div?.append(
      Plot.plot({
        y: { label: `${$project?.name} $` },
        x: { label: "Week" },
        grid: true,
        caption: "Expense overview",
        nice: true,
        marks: [
          Plot.ruleY([0]),
          Plot.barY(data.paychecks, {
            x: "key",
            y: (d) =>
              d.items
                .map((x) => x.basePay)
                .reduce((acc, item) => acc + item, 0)
                .toFixed(2),
            fill: "red",
            tip: "xy",
          }),
        ],
        title: "Expense Chart",
        style: {
          color: "rgb(157, 149, 149)",
        },
      })
    ); // add the new chart
  }
</script>

<div class="flex flex-col gap-4">
  <div bind:this={div} role="img"></div>
  <div class="flex flex-col">
    <span class="text-lg tracking-wide">Total Expense YTD:</span>
    <h4 class=" text-xl tracking-widest text-red-500">
      ${data.totalYear.toFixed(2)}
    </h4>

  </div>
</div>


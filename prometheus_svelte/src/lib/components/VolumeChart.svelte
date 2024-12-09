<script lang="ts">
  import type { TickerHistory } from "$lib/types/tickerHistory";
  import { scaleLinear } from "d3-scale";
  import { bisector, max } from "d3-array";
  import { pointer, select } from "d3-selection";
  import { axisLeft, axisBottom } from "d3-axis";
  import { utcMonday } from "d3-time";
  import { utcFormat } from "d3-time-format";
  import { format, precisionFixed } from "d3-format";

  const {
    data,
    width,
    height,
    onpointerenter,
    padding,
    chartIndex
  }: {
    data: any[];
    width: number;
    height: number;
    onpointerenter: Function;
    padding: number;
    chartIndex: number;
  } = $props();

  let yAxis: SVGGElement = $state({} as SVGGElement);
  let xAxis: SVGGElement = $state({} as SVGGElement);
	let crossHairX: SVGLineElement = $state({} as SVGLineElement);
	let crossHairY: SVGLineElement = $state({} as SVGLineElement);

  let yScale = $derived(
    scaleLinear()
      .domain([
        0,
        Number(max(data.map((x) => +x.volume.toString().replaceAll(",", "")))),
      ])
      .range([height - padding, padding])
  );

  let xScale = $derived(
    scaleLinear()
      .domain([+data.at(0)?.date, +data.at(-1)?.date])
      .range([25, width - 100])
  );

  $effect(() => {
    if(chartIndex !== -1){
      calculateCrossHairs(chartIndex);
    }
    select(xAxis)
      .call(
        axisBottom(xScale)
          .tickValues(
            utcMonday
              .every(width > 720 ? 2 : 4)
              .range(data.at(0).date, data.at(-1).date)
          )
          .tickFormat(utcFormat("%-m/%-d") as any)
      )
      .call((g) => g.select(".domain").remove());

    select(yAxis)
      .call(axisLeft(yScale).tickFormat(format("~s")).ticks(2))
      .call((g) =>
        g
          .selectAll(".tick line")
          .attr("stroke-opacity", 0.4)
          .attr("x2", width - 50)
          .attr("stroke", "white")
      )
      .call((g) => g.select(".domain").remove());
  });

  const handleMove = (e: Event) => {
			const bisect = bisector((d: any) => d.date).center;
			const i = bisect(data, xScale.invert(pointer(e)[0]));
      onpointerenter(i);
      calculateCrossHairs(i);
  }

  const calculateCrossHairs = (i: number) => {
    const day = data.at(i);
      
      if(day){
        select(crossHairX).attr("y1", height).attr('y2', 25).attr('x1', xScale(+day.date)).attr('x2', xScale(+day.date))
        select(crossHairY).attr("y1", yScale(+day.volume.toString().replaceAll(",", ""))).attr('y2', yScale(+day.volume.toString().replaceAll(",", ""))).attr('x1', 0).attr('x2', width)
      }
  }
</script>

<svg width={width - 50} {height} onpointerenter={handleMove} onpointermove={handleMove}>
  <g stroke="gray" transform="translate({40},0)" bind:this={yAxis}></g>
  <g stroke="gray" transform="translate(25,{height - 30})" bind:this={xAxis}
  ></g>
  <g stroke="gray" transform="translate({25},0)">
    {#each data as ticker}
      <rect
        onpointerenter={() =>
          onpointerenter(+ticker.volume.toString().replaceAll(",", ""))}
        x={xScale(+ticker.date)}
        class=" stroke-fuchsia-500 hover:cursor-pointer"
        height={yScale(0) -
          yScale(+ticker.volume.toString().replaceAll(",", ""))}
        width="3"
        y={yScale(+ticker.volume.toString().replaceAll(",", ""))}
      >
      </rect>
    {/each}
  </g>
  <g stroke="red"  transform="translate(0,0)">
    <line bind:this={crossHairX}></line>
    <line  bind:this={crossHairY}></line>
  </g>
</svg>

<script lang="ts">
  import { scaleLinear } from "d3-scale";
  import { line } from "d3-shape";
  import { select, pointer } from "d3-selection";
  import { axisLeft, axisBottom } from "d3-axis";
	import { bisector } from 'd3-array';
  import { utcMonday } from "d3-time";
  import { utcFormat } from "d3-time-format";
  import type { TickerHistory } from "$lib/types/tickerHistory";
	import { calculateRSI } from "$lib/utils/chartTools";

  let {
    width = 0,
    height,
    data,
    onpointerenter,
    chartIndex,
    padding = 25,
    timeFrame = 14,
  }: {
    width: number;
    height: number;
    data: TickerHistory[];
    onpointerenter: Function;
    chartIndex: number;
    padding?: number;
    timeFrame: number;
  } = $props();

  let yAxis: SVGGElement = $state({} as SVGGElement);
  let xAxis: SVGGElement = $state({} as SVGGElement);
  let dayLine: SVGLineElement = $state({} as SVGLineElement);
  let crossLine: SVGLineElement = $state({} as SVGLineElement);

  let yScale = $derived(
    scaleLinear()
      .domain([0, 120])
      .range([height - padding, padding])
  );
  
  let xScale = $derived(
    scaleLinear()
      .domain([+data.at(0).date, +data.at(-1)?.date])
      .range([60, width - 75])
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
      .call(axisLeft(yScale).tickValues([40, 80]))
      .call((g) =>
        g
          .selectAll(".tick line")
          .attr("stroke-opacity", 0.4)
          .attr("x2", width - 50)
          .attr("stroke", "white")
      )
      .call((g) => g.select(".domain").remove());
  });
  const path = line()
    .x((d: any) => xScale(d.date))
    .y((d, index) => yScale(calculateRSI({ data, index }))) as any;

  const handleMove = (e: Event) => {
			const bisect = bisector((d: any) => d.date).center;
			const i = bisect(data, xScale.invert(pointer(e)[0]));
      onpointerenter(i);
      calculateCrossHairs(i);
  }
  const calculateCrossHairs = (i: number) => {
    const day = data.at(i);
      const rsi = calculateRSI({data, index: i});
      
      if(day){
        select(dayLine).attr("y1", height).attr('y2', 25).attr('x1', xScale(+day.date)).attr('x2', xScale(+day.date))
        select(crossLine).attr("y1", yScale(rsi)).attr('y2', yScale(rsi)).attr('x1', 0).attr('x2', width)
      }
  }
</script>

<svg width={width - 50} class="hover:cursor-pointer" onpointerenter={handleMove} onpointermove={handleMove} {height}>
  <g stroke="gray" transform="translate({50},0)" bind:this={yAxis}></g>
  <g stroke="gray" transform="translate(0,{height - 30})" bind:this={xAxis}></g>
  <path fill="none" stroke="white" d={path(data)} stroke-width="2"></path>
  <g stroke="red">
    <line bind:this={dayLine}></line>
    <line  bind:this={crossLine}></line>
  </g>
</svg>

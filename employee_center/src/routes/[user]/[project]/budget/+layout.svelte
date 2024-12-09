<script lang="ts">
  import { invalidate } from "$app/navigation";
  import GenericLayoutCard from "$lib/components/GenericLayoutCard.svelte";
  import { post } from "$lib/database/server";
  import dayjs from "dayjs";
  import toast from "svelte-french-toast";

  const handlePayroll = async () => {
    let week = dayjs().startOf("week").toDate();
    let weekString = `${(week.getMonth() + 1).toString().padStart(2, "0")}/${week.getDate().toString().padStart(2, "0")}/${week.getFullYear()}`;

    const { data } = await post("payroll/run", { date: weekString });

    invalidate('budget:week');
    if (typeof data.checks === "string") {
      toast.error(`${weekString} ${data.checks}`);
    } else {
      toast.success(`Processed payroll for ${weekString}`);
    }
  };
</script>

<GenericLayoutCard pageHeader="Project Budget">
  <div slot="navigation">
    <ul class="flex flex-col gap-4">
      <li
        class="flex gap-4 hover:text-fuchsia-500 duration-500 transition-all hover:cursor-pointer"
      >
        <i class="bi bi-envelope-paper-fill text-xl"></i>
        <button on:click={() => handlePayroll()} class="text-xl"
          >Process Payroll</button
        >
      </li>
    </ul>
  </div>
  <div slot="main"  class=" h-[600px] max-sm:h-full">
    <slot></slot>
  </div>
</GenericLayoutCard>

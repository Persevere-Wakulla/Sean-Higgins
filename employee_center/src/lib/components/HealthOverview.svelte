<script lang="ts">
  import type { User } from "$lib/stores/layout";
  
  export let employee: User;

  const calculateMonthlyHealth = (employee: User) => {
    let spousalCost = employee.health.spouseIncludedHealth
      ? employee.health.medicalPlan.spouseCost
      : 0;

    return (
      employee.health.medicalPlan.monthlyCost +
      spousalCost +
      employee.health.dependents * employee.health.medicalPlan.dependentsCost
    );
  };
</script>

<div class="flex flex-col dark:text-white">
  <h4 class="text-xl">{employee.health.medicalPlan.name}</h4>
  <h4 class="text-xl">
    Spouse Covered: {employee.health.spouseIncludedHealth ? "Yes" : "No"}
  </h4>
  <h4 class="text-xl">Dependents: {employee.health.dependents}</h4>
  <div class="flex gap-4 text-wrap">
    <h4 class="text-lg">
      PCP: ${employee.health.medicalPlan?.copayments?.primaryCare}
    </h4>
    <h4 class="text-lg">
      Specialist: ${employee.health.medicalPlan?.copayments?.specialist}
    </h4>
    <h4 class="text-lg">
      Outside Network: ${employee.health.medicalPlan?.copayments?.outOfNetwork}
    </h4>
  </div>
  <div class="flex">
    <h4 class="text-2xl">
      Total Monthly: <span class="text-red-400"
        >${calculateMonthlyHealth(employee)}</span
      >
    </h4>
  </div>
</div>

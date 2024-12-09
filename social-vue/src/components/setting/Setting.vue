<script>
    export default {

    }
</script>

<template>
    <div class="container">
        <div class="light-card">
            <h2>Welcome to your settings</h2>
        </div>
    </div>
</template>

<style>
    .container {
        background-color: hsl(248, 17%, 91%);
        grid-row: 2;
        grid-column: 2;
        padding: 1.5em;
        width: 100%;
    }

    @media (max-width: 700px) {
        .container {
            grid-column: 1 / span 2;
        }
    }
</style>
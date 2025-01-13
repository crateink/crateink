<template>
  <div v-for="i in 1000">
    <heavy-comp v-if="defer(i)">{{ i }}</heavy-comp>
  </div>
</template>

<script setup>
import HeavyComp from "./components/HeavyComp.vue";
import { useDefer } from "./defer.js";
const defer = useDefer();
</script>

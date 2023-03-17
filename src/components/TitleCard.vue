<template>
  <v-card class="pa-5 mb-5">
    <h1>{{ headline }}</h1>
  </v-card>
</template>

<script>
export default {
  name: "TitleCard",
  props: {
    headline: {
      type: String,
      default: "",
    },
  },
  data: () => ({}),
};
</script>

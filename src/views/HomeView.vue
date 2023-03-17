<template>
  <div class="home">
    <div class="d-flex flex-column justify-center align-center">
      <h1>{{ $t("menu.title") }}</h1>
      <img
        class="ma-5"
        src="https://www.dokumenta.sk/wp-content/uploads/2020/02/Dokumenta-logo-80-px-1.png"
        height="auto"
        width="auto"
      />
      <div>{{ $t("about.description") }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  components: {},
};
</script>

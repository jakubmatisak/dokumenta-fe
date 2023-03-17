<template>
  <v-app id="app">
    <navigation-card></navigation-card>
    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import NavigationCard from "@/components/NavigationCard";

export default {
  components: { NavigationCard },
};
</script>

<style lang="scss">
@import "scss/_variables.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $dokumenta-grey;
}

tr:hover {
  cursor: pointer;
}

::-webkit-scrollbar {
  width: 6px; /* Set the width of the scrollbar */
}

::-webkit-scrollbar-track {
  background-color: $dokumenta-white; /* Set the background color of the track */
}

::-webkit-scrollbar-thumb {
  background-color: $dokumenta-orange; /* Set the color of the thumb */
}
</style>

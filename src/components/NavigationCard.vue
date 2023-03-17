<template>
  <div class="navigation">
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="navigate(item.path)"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn icon @click="changeLocale">
          <v-icon>mdi-web</v-icon>
          {{ locale }}
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>

<script>
import i18n from "@/i18n";

export default {
  name: "NavigationCard",
  data: () => ({
    drawer: false,
    locale: "sk",
    title: process.env.VUE_APP_TITLE,
    items: [
      {
        title: i18n.t("menu.home"),
        icon: "mdi-home",
        path: "/",
      },
      {
        title: i18n.t("addressBook.individuals"),
        icon: "mdi-book-account",
        path: "/address-book-individuals",
      },
      {
        title: i18n.t("addressBook.legal_persons"),
        icon: "mdi-book-account-outline",
        path: "/address-book-legal-persons",
      },
    ],
  }),
  methods: {
    /**
     * Navigate in menu
     * @param {string} path - The path to navigate to.
     */
    navigate(path) {
      this.$router.push(path);
      this.drawer = false;
    },
    /**
     * Change local language in I18n library.
     */
    changeLocale() {
      switch (this.locale) {
        case "sk":
          this.locale = "en";
          this.$i18n.locale = "en";
          break;
        case "en":
          this.locale = "sk";
          this.$i18n.locale = "sk";
          break;
        default:
          this.locale = "sk";
          this.$i18n.locale = "sk";
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/_variables.scss";

.navigation {
  padding-bottom: 1rem;

  ::v-deep .v-list-item__title {
    font-weight: bold;
    text-decoration: none;
    &:hover {
      color: $dokumenta-orange;
    }
  }
}
</style>

import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/address-book-individuals",
    name: "Individuals",
    component: () => import("@/views/AddressBookIndividualsView.vue"),
  },
  {
    path: "/address-book-legal-persons",
    name: "Legal Persons",
    component: () => import("@/views/AddressBookLegalPersonsView.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;

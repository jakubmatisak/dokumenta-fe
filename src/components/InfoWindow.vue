<template>
  <v-dialog v-model="dialog" persistent max-width="700px">
    <v-card>
      <v-row no-gutters class="d-flex justify-center">
        <v-col
          v-for="(v, k) in data"
          :key="k"
          cols="12"
          :md="getMdSize(v.type)"
        >
          <v-card-text v-if="k !== 'id'">
            <h2 v-if="v.type === 'headline'" class="pt-6">
              {{ translate(k) }}
            </h2>
            <div
              v-if="
                v.type !== 'headline' &&
                v.type !== 'checkbox' &&
                v.type !== 'select-insert'
              "
              class="item-headline"
            >
              {{ translate(k) }}
            </div>
            <div v-if="v.type !== 'headline' && v.type !== 'checkbox'">
              {{ v.value }}
            </div>
          </v-card-text>
        </v-col>
      </v-row>
      <v-card-actions class="d-flex justify-end">
        <v-btn
          color="red darken-1"
          text
          class="mt-5"
          @click="
            $emit('send-data', false);
            dialog = false;
          "
          >{{ $t("actions.close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { translate } from "@/locales";

export default {
  name: "InfoWindow",
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      dialog: true,
      translate: translate,
    };
  },
  computed: {
    // eslint-disable-next-line valid-jsdoc
    /**
     * set responsive size
     */
    getMdSize() {
      return function (type) {
        switch (type) {
          case "headline":
            return 12;
          case "select-insert":
            return 12;
          default:
            return 4;
        }
      };
    },
  },
};
</script>

<style scoped lang="scss">
@import "../scss/_variables.scss";

.item-headline {
  font-size: 01.15rem;
  color: $dokumenta-orange;
  font-weight: bold;
}
</style>

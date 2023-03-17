<template>
  <v-col class="pa-0">
    <title-card :headline="$t('addressBook.headline_individuals')"></title-card>
    <v-card>
      <v-data-table
        ref="individuals"
        v-model="selected"
        :headers="headers"
        :items="individuals"
        sort-by="id"
        mobile-breakpoint="900"
        class="elevation-0"
        :items-per-page="20"
        item-key="id"
        :search="search"
        :loading="loading"
        @click:row="openInfo"
      >
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title> {{ $t("actions.list") }}</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>

            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              :label="$t('actions.search')"
              single-line
              hide-details
            />
            <modal-card
              v-if="showModal"
              :data="showedItem"
              @send-data="receiveDataFromChild"
            />
            <v-dialog v-model="dialog" max-width="700px" persistent>
              <template #activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="ma-2"
                  v-bind="attrs"
                  v-on="on"
                  @click="newIndividual"
                >
                  {{ $t("actions.new.new") }}
                </v-btn>
              </template>
              <v-card class="pa-4">
                <v-card-title class="pb-6">
                  <span class="text-h4">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container class="pa-0">
                    <v-form ref="form" lazy-validation>
                      <v-row>
                        <template v-for="(v, k) in editedItem">
                          <v-col v-if="k !== 'id'" :key="k" cols="12">
                            <v-text-field
                              v-if="editedItem[k].type === 'text'"
                              v-show="
                                !editedItem[k].contact_address || showContact
                              "
                              v-model.trim="editedItem[k].value"
                              v-mask="editedItem[k].mask"
                              :label="translate(k)"
                              :rules="
                                !showContact
                                  ? rules.getRules(editedItem[k].rules)
                                  : [
                                      ...rules.getRules(
                                        editedItem[k].rulesOptional
                                      ),
                                      ...rules.getRules(editedItem[k].rules),
                                    ]
                              "
                              :counter="editedItem[k].counter"
                              :disabled="editedItem[k].disabled"
                              :type="editedItem[k].type"
                              :prefix="editedItem[k].prefix"
                            />
                            <v-checkbox
                              v-else-if="editedItem[k].type === 'checkbox'"
                              v-model="showContact"
                              :label="translate(k)"
                            >
                            </v-checkbox>
                            <h2
                              v-else
                              v-show="
                                !editedItem[k].contact_address || showContact
                              "
                            >
                              {{ translate(k) }}
                            </h2>
                          </v-col>
                        </template>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer />
                  <v-btn color="red darken-1" text @click="close">
                    {{ $t("actions.close") }}
                  </v-btn>
                  <v-btn color="green darken-1" text @click="save">
                    {{ $t("actions.save") }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5">
                  {{ $t("actions.delete") }}
                </v-card-title>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="red darken-1" text @click="closeDelete">
                    {{ $t("actions.cancel") }}
                  </v-btn>
                  <v-btn color="green darken-1" text @click="deleteItemConfirm">
                    {{ $t("actions.ok") }}
                  </v-btn>
                  <v-spacer />
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click.stop="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click.stop="deleteItem(item)"> mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-col>
</template>

<script>
import apiUrls from "@/resources/apis.json";
import individualData from "@/resources/individuals.json";
import services from "@/services/axiosService";
import rulesServices from "@/services/validationRulesService";
import TitleCard from "@/components/TitleCard";
import ModalCard from "@/components/InfoWindow";
import _ from "lodash";
import legalPersonData from "@/resources/legal_persons.json";

export default {
  name: "AddressBookIndividualsView",
  components: { TitleCard, ModalCard },
  data() {
    return {
      selected: [],
      search: "",
      loading: true,
      dialog: false,
      dialogDelete: false,
      showContact: false,
      showModal: false,
      individuals: [],
      headers: [
        {
          text: this.$t("addressBook.id"),
          align: "start",
          value: "id",
        },
        {
          text: this.$t("addressBook.name"),
          value: "name.value",
        },
        {
          text: this.$t("addressBook.surname"),
          value: "surname.value",
        },
        {
          text: this.$t("addressBook.phone"),
          value: "phone.value",
        },
        {
          text: this.$t("addressBook.email"),
          value: "email.value",
        },
        {
          text: this.$t("addressBook.billing_address_city"),
          value: "billing_address_city.value",
        },
        {
          text: this.$t("addressBook.billing_address_street"),
          value: "billing_address_street.value",
        },
        {
          text: this.$t("addressBook.billing_address_post_code"),
          value: "billing_address_post_code.value",
        },
        {
          text: this.$t("actions.actions"),
          value: "actions",
          sortable: false,
        },
      ],
      editedIndex: -1,
      editedItem: individualData.item,
      defaultItem: individualData.item,
      showedItem: legalPersonData.item,
      rules: rulesServices,
    };
  },
  computed: {
    /**
     * Change between new item and edit item - language translation
     * @returns {VueI18n.TranslateResult} - from locale json
     */
    formTitle() {
      return this.editedIndex === -1
        ? this.$t("actions.new.individual")
        : this.$t("actions.edit.individual");
    },
  },
  watch: {
    /**
     * watch dialog opening
     * @param {Boolean} val - closing dialog
     */
    dialog(val) {
      val || this.close();
    },
    /**
     * watch dialog - Delete -  opening
     * @param {Boolean} val - closing dialog
     */
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  created() {
    this.getIndividuals();
  },
  methods: {
    /**
     * receive data about closeing/opening info
     * @param {Boolean} data - closed/opened dialog
     */
    receiveDataFromChild(data) {
      this.showModal = data;
    },
    /**
     * open modal info window about subjects
     * @param {Int} item variable for indexing of object
     */
    openInfo(item) {
      this.showModal = true;
      this.showedIndex = this.individuals.indexOf(item);
      this.showedItem = _.cloneDeep(item);
    },
    /**
     * get all Legal Persons
     * @returns {Promise<void>} waiting for response
     */
    async getIndividuals() {
      const individualsResponse = await services.get(
        apiUrls.get.individuals,
        "individuals"
      );
      this.setIndividuals(
        individualsResponse ? individualsResponse.data : null
      );
      this.loading = false;
    },
    /**
     * set Individuals to list
     * @param {data} data  - input data for list
     * @returns {null} - when data is empty
     */
    setIndividuals(data) {
      if (!data) {
        return null;
      }
      this.individuals = [];

      for (let item of data) {
        let individual = _.cloneDeep(individualData.item);

        individual.id = item.id;
        individual.name.value = item.name;
        individual.surname.value = item.surname;
        individual.email.value = item.email;
        individual.phone.value = item.phone;

        individual.billing_address_street.value = item.billing_address.street;
        individual.billing_address_city.value = item.billing_address.city;
        individual.billing_address_post_code.value =
          item.billing_address.post_code;

        if (item.contact_address !== null) {
          individual.contact_address_street.value = item.contact_address.street;
          individual.contact_address_city.value = item.contact_address.city;
          individual.contact_address_post_code.value =
            item.contact_address.post_code;
        }

        this.individuals.push(individual);
      }
    },
    /**
     * translate labels
     * @param {String} v - value for label
     * @returns {VueI18n.TranslateResult} translated string
     */
    translate(v) {
      return this.$t("addressBook." + v);
    },
    /**
     * create new individual
     */
    newIndividual() {
      this.editedItem = _.cloneDeep(individualData.item);
      this.dialog = true;
      this.editedIndex = -1;
    },
    /**
     * Edit individual
     * @param {item} item which will be changed
     */
    editItem(item) {
      console.log(item);
      this.dialog = true;
      this.editedIndex = this.individuals.indexOf(item);
      this.editedItem = _.cloneDeep(item);
      this.defaultItem = _.cloneDeep(this.editedItem);

      console.log(this.editedItem);
    },
    /**
     * Delete individual
     * @param {item} item which will be deleted
     */
    deleteItem(item) {
      this.dialog = false;
      this.editedIndex = this.individuals.indexOf(item);
      this.editedItem = _.cloneDeep(item);
      this.defaultItem = _.cloneDeep(this.editedItem);
      this.dialogDelete = true;
    },
    /**
     * Delete confirmation an end dialog
     * @returns {Promise<void>} waiting for delete success response
     */
    async deleteItemConfirm() {
      this.individuals.splice(this.editedIndex, 1);
      await services.destroy(
        apiUrls.delete.individuals + this.editedItem.id,
        this.editedItem
      );
      this.closeDelete();
    },
    /**
     * Close Edit mode
     */
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedIndex = -1;
      });
      this.editedItem = _.cloneDeep(this.defaultItem);
    },
    /**
     * Close Delete mode
     */
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedIndex = -1;
      });
      this.editedItem = _.cloneDeep(this.defaultItem);
    },
    /**
     * Save individual to database
     */
    async save() {
      if (this.$refs.form.validate()) {
        console.log(this.editedItem);

        let individual = {
          name: this.editedItem.name.value,
          surname: this.editedItem.surname.value,
          phone: this.editedItem.phone.value.replaceAll(" ", ""),
          email: this.editedItem.email.value,
          billing_address: {
            street: this.editedItem.billing_address_street.value,
            city: this.editedItem.billing_address_city.value,
            post_code: this.editedItem.billing_address_post_code.value.replace(
              " ",
              ""
            ),
          },
          contact_address: null,
        };

        if (this.showContact) {
          individual.contact_address = {
            street: this.editedItem.contact_address_street.value,
            city: this.editedItem.contact_address_city.value,
            post_code: this.editedItem.contact_address_post_code.value.replace(
              " ",
              ""
            ),
          };
        }

        if (this.editedIndex > -1) {
          await services.put(
            apiUrls.put.individuals + this.editedItem.id,
            individual,
            { alert: true }
          );
        } else {
          const createResponse = await services.post(
            apiUrls.post.individuals,
            individual,
            { alert: true }
          );
          console.log(createResponse);
          this.dialog = false;
          await this.getIndividuals();
        }
      }
    },
  },
};
</script>

<template>
  <v-col class="pa-0">
    <title-card
      :headline="$t('addressBook.headline_legal_persons')"
    ></title-card>
    <v-card>
      <v-data-table
        ref="individuals"
        v-model="selected"
        :headers="headers"
        :items="legal_persons"
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
                  @click="newLegalPerson"
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
                            <v-combobox
                              v-else-if="editedItem[k].type === 'select-insert'"
                              v-model="editedItem[k].value"
                              v-mask="editedItem[k].mask"
                              :disabled="editedItem[k].disabled"
                              :items="legals"
                              item-title="text"
                              item-value="id"
                              :item-text="editedItem[k].showed"
                              :label="translate(k)"
                              :rules="rules.getRules(editedItem[k].rules)"
                              :prefix="editedItem[k].prefix"
                              no-data-text=""
                              @focus="
                                ($event) => {
                                  $event.target.click();
                                }
                              "
                            >
                            </v-combobox>
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
import { translate } from "@/locales";
import legalPersonData from "@/resources/legal_persons.json";
import services from "@/services/axiosService";
import rulesServices from "@/services/validationRulesService";
import TitleCard from "@/components/TitleCard";
import ModalCard from "@/components/InfoWindow";
import _ from "lodash";

export default {
  name: "AddressBookLegalPersonsView",
  components: { TitleCard, ModalCard },
  data() {
    return {
      showModal: false,
      selected: [],
      search: "",
      loading: true,
      dialog: false,
      dialogDelete: false,
      showContact: false,
      legal_persons: [],
      legals: [],
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
          text: this.$t("addressBook.registration_number"),
          value: "registration_number.value",
        },
        {
          text: this.$t("addressBook.tin"),
          value: "tin.value",
        },
        {
          text: this.$t("addressBook.vat_number"),
          value: "vat_number.value",
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
      editedItem: legalPersonData.item,
      defaultItem: legalPersonData.item,
      showedItem: legalPersonData.item,
      rules: rulesServices,
      translate: translate,
    };
  },
  computed: {
    /**
     * Change between new item and edit item - language translation
     * @returns {VueI18n.TranslateResult} - from locale json
     */
    formTitle() {
      return this.editedIndex === -1
        ? this.$t("actions.new.legal_person")
        : this.$t("actions.edit.legal_person");
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
  async created() {
    await this.getLegalPersons();
    await this.getOffices();
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
      this.showedIndex = this.legal_persons.indexOf(item);
      this.showedItem = _.cloneDeep(item);
    },
    /**
     * get all Legal Persons
     * @returns {Promise<void>} waiting for response
     */
    async getLegalPersons() {
      const legalPersonsResponse = await services.get(
        apiUrls.get.legal_persons,
        "legal_persons"
      );
      this.setLegalPersons(
        legalPersonsResponse ? legalPersonsResponse.data : null
      );
      this.loading = false;
    },
    /**
     * get all offices for selection
     */
    async getOffices() {
      this.loading = true;
      await services.getChecklist(
        apiUrls.get.legal_persons_checklist,
        "legals"
      );
      this.legals = await this.$store.state.checklists.legals;

      this.loading = false;
    },
    /**
     * set Individuals to list
     * @param {data} data  - input data for list
     * @returns {null} - when data is empty
     */
    setLegalPersons(data) {
      if (!data) {
        return null;
      }

      this.legal_persons = [];

      for (let item of data) {
        let legal_persons = _.cloneDeep(legalPersonData.item);

        legal_persons.id = item.id;
        legal_persons.name.value = item.name;
        legal_persons.registration_number.value = item.registration_number;
        legal_persons.tin.value = item.tin;
        legal_persons.vat_number.value = item.vat_number;

        legal_persons.billing_address_street.value =
          item.billing_address.street;
        legal_persons.billing_address_city.value = item.billing_address.city;
        legal_persons.billing_address_post_code.value =
          item.billing_address.post_code;

        if (item.contact_address !== null) {
          legal_persons.contact_address_street.value =
            item.contact_address.street;
          legal_persons.contact_address_city.value = item.contact_address.city;
          legal_persons.contact_address_post_code.value =
            item.contact_address.post_code;
        }
        if (item.office !== null) {
          legal_persons.office.value = item.office.legal_person.name;
        }

        this.legal_persons.push(legal_persons);
      }
    },
    /**
     * create new individual
     */
    newLegalPerson() {
      this.editedItem = _.cloneDeep(legalPersonData.item);
      this.dialog = true;
      this.editedIndex = -1;
    },
    /**
     * Edit individual
     * @param {item} item which will be changed
     */
    editItem(item) {
      this.dialog = true;
      this.editedIndex = this.legal_persons.indexOf(item);
      this.editedItem = _.cloneDeep(item);
      this.defaultItem = _.cloneDeep(this.editedItem);
    },
    /**
     * Delete individual
     * @param {item} item which will be deleted
     */
    deleteItem(item) {
      this.dialog = false;
      this.editedIndex = this.legal_persons.indexOf(item);
      this.editedItem = _.cloneDeep(item);
      this.defaultItem = _.cloneDeep(this.editedItem);
      this.dialogDelete = true;
    },
    /**
     * Delete confirmation an end dialog
     * @returns {Promise<void>} waiting for delete success response
     */
    async deleteItemConfirm() {
      await services.destroy(
        apiUrls.delete.legal_persons + this.editedItem.id,
        this.editedItem
      );
      this.legal_persons.splice(this.editedIndex, 1);
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
        let legal_person = {
          name: this.editedItem.name.value,
          registration_number: this.editedItem.registration_number.value,
          vat_number: this.editedItem.vat_number.value,
          tin: this.editedItem.tin.value,
          billing_address: {
            street: this.editedItem.billing_address_street.value,
            city: this.editedItem.billing_address_city.value,
            post_code: this.editedItem.billing_address_post_code.value,
          },
          contact_address: null,
          id_office: this.editedItem.office.value
            ? this.editedItem.office.value.id
            : null,
        };

        if (this.showContact) {
          legal_person.contact_address = {
            street: this.editedItem.contact_address_street.value,
            city: this.editedItem.contact_address_city.value,
            post_code: this.editedItem.contact_address_post_code.value,
          };
        }

        if (this.editedIndex > -1) {
          await services.put(
            apiUrls.put.legal_persons + this.editedItem.id,
            legal_person,
            { alert: true }
          );
        } else {
          await services.post(apiUrls.post.legal_persons, legal_person, {
            alert: true,
          });
        }
        this.dialog = false;
        await this.getLegalPersons();
      }
    },
  },
};
</script>

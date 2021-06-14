<template>
  <div>
    <h1>Questions</h1>
    <v-container fluid>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <p>Please answer the following questions carefully:</p>
        <div
          v-for="(formInfo, outerIndex ) in formInfos"
          :key="outerIndex"
        >
          <p>{{ formInfo.label }}</p>
          <v-radio-group
            v-if="formInfo.type === 'radio'"
            v-model="models[formInfo.name]"
            :rules="formInfo.rules"
          >
            <v-radio
              v-for="(value, index) in formInfo.values"
              :key="index"
              :label="value"
              :value="index + 1"
            />
          </v-radio-group>
          <div v-else-if="formInfo.type === 'checkbox'">
            <div
              v-for="(value, index) in formInfo.values"
              :key="index"
            >
              <v-img
                v-if="formInfo.hasOwnProperty('images') && formInfo.images[index]"
                :src="formInfo.images[index]"
                aspect-ratio="1"
                class="grey lighten-2"
                max-width="100"
              />
              <v-checkbox
                v-model="models[formInfo.name]"
                :label="value"
                :value="index + 1"
                :rules="formInfo.rules"
              />
            </div>
          </div>
          <v-text-field
            v-else-if="formInfo.type === 'number'"
            v-model.number="models[formInfo.name]"
            :type="formInfo.type"
            :min="formInfo.min"
            :max="formInfo.max"
            :rules="formInfo.rules"
          />
          <v-select
            v-else-if="formInfo.type === 'select'"
            v-model="models[formInfo.name]"
            :item-text="formInfo.itemTextKey"
            :item-value="formInfo.itemValueKey"
            :items="formInfo.items"
            :clearable="true"
            :rules="formInfo.rules"
          />
        </div>
        <v-btn
          color="primary"
          @click="validate"
        >
          Continue
        </v-btn>
      </v-form>
    </v-container>
  </div>
</template>

<script src="./DemographicInfo.js"></script>

<style scoped src="./DemographicInfo.css"></style>

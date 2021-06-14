<template>
  <v-dialog
    scrollable
  >
    <template v-slot:activator="{ on }">
      <v-chip
        class="ma-2"
        :color="colorOfJobUserValidity(jobUser)"
        dark
        v-on="on"
      >
        {{ verboseOfJobUserValidity(jobUser) }}
        <v-icon right>
          mdi-eye
        </v-icon>
      </v-chip>
    </template>
    <v-card>
      <v-card-title>
        <span>The job session was</span>
        <v-chip
          class="title-v-chip"
          :color="colorOfJobUserValidity(jobUser)"
          dark
          small
        >
          {{ verboseOfJobUserValidity(jobUser) }}
        </v-chip>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            md="4"
          >
            <strong>Session Id/Payment code</strong>
          </v-col>
          <v-col>
            {{ jobUser.id }}
          </v-col>
        </v-row>
        <v-divider />
        <v-row>
          <v-col
            cols="5"
            md="4"
          >
            <strong>Test</strong>
          </v-col>
          <v-col>
            <strong>Validity</strong>
          </v-col>
        </v-row>
        <div
          v-for="(test, index ) in jobUser.validity.tests"
          :key="index"
        >
          <v-row>
            <v-col
              cols="5"
              md="4"
            >
              <span>{{ nameOfValidityTest(test) }}</span>
            </v-col>
            <v-col>
              <v-chip
                :color="colorOfValidityTest(test)"
                dark
                small
              >
                {{ verboseOfValidityTest(test) }}
              </v-chip>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script src="./JobValidityView.js"></script>
<style src="./JobValidityView.css"></style>

<template>
  <v-container>
    <v-container>
      <v-row>
        <h2>Completion</h2>
      </v-row>
      <v-row>
        <v-col
          cols="2"
          md="2"
        >
          Internal
        </v-col>
        <v-col>
          <v-progress-linear
            v-model="internalCompletion"
            height="5"
            reactive
          />
        </v-col>
        <v-col
          cols="4"
          md="4"
        >
          {{ internalCompletion }} %
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="2"
          md="2"
        >
          External
        </v-col>
        <v-col>
          <v-progress-linear
            v-model="externalCompletion"
            height="5"
            reactive
          />
        </v-col>
        <v-col
          cols="4"
          md="4"
        >
          {{ externalCompletion }} %
        </v-col>
      </v-row>
    </v-container>  
    <h2>Internal jobs</h2>
    <v-container />
    <v-card class="parent">
      <v-card-title>
        <v-btn
          icon
          small
          @click="loadData"
        >
          <v-icon>
            mdi-reload
          </v-icon>
        </v-btn>
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search by payment code or User id"
          single-line
          hide-details
          clearable
          @click:append="loadData"
          @keyup.enter="loadData"
        />
      </v-card-title>
      <v-data-table
        :search="search"
        :headers="headers"
        :items="lastJobUsers"
        :options.sync="options"
        :server-items-length="totalJobUsers"
        :loading="loading"
        :footer-props="footerProps"
        height="74vh"
        dense
      >
        <template v-slot:item.User="{ item }">
          <UserView
            :job-user="item"
            @user-updated="loadData"
          />
        </template>
        <template v-slot:item.validity="{ item }">
          <div v-if="item.validity">
            <JobValidityView :job-user="item" />
          </div>
        </template>
        <template v-slot:item.startTime="{ item }">
          <div v-if="item.startTime">
            {{ formattedTime(item.startTime) }}
          </div>
        </template>
        <template v-slot:item.finishTime="{ item }">
          <div v-if="item.finishTime">
            {{ formattedTime(item.finishTime) }}
          </div>
        </template>
        <template v-slot:item.expirationTime="{ item }">
          <div v-if="item.expirationTime">
            {{ formattedTime(item.expirationTime) }}
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script src="./JobUsersAdmin.js"></script>
<style src="./JobUsersAdmin.css"></style>


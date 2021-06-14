<template>
  <v-container>
    <span>{{ jobUser.UserId }}</span>
    <v-dialog
      v-model="dialog"
      scrollable
    >
      <template v-slot:activator="{ on }">
        <v-btn
          color="primary"
          dark
          icon
          small
          v-on="on"
        >
          <v-icon
            :color="getColorOfAccessStatus(jobUser.User.accessStatus)"
          >
            mdi-eye
          </v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span>Worker information</span>
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
              cols="12"
              md="4"
            >
              <strong>User id</strong>
            </v-col>
            <v-col>
              {{ jobUser.User.id }}
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="4"
            >
              <strong>Worker id</strong>
            </v-col>
            <v-col>
              {{ jobUser.User.workerId }}
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="4"
            >
              <strong>Campaign id</strong>
            </v-col>
            <v-col>
              {{ jobUser.User.campaignId }}
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="4"
            >
              <strong>First access</strong>
            </v-col>
            <v-col>
              {{ formattedTime(jobUser.User.createdAt) }}
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
            >
              <strong>Access status</strong>
              <v-radio-group
                v-model="jobUser.User.accessStatus"
              >
                <v-radio
                  v-for="(accessStatus, index) in accessStatusInfo"
                  :key="index"
                  :value="accessStatus.id"
                  :label="labelOfStatus (accessStatus, jobUser.User) "
                  :color="getColorOfAccessStatus(accessStatus.id)"
                />
              </v-radio-group>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="saveUser(jobUser.User)"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script src="./UserView.js"></script>
<style src="./UserView.css"></style>

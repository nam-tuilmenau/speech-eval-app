<template>
  <v-container fluid>
    <v-row v-if="id">
      <v-col cols="12">
        <v-row v-if="title">
          <v-col
            align="center"
            justify="center"
          >
            <h3>{{ title }}</h3>
          </v-col>
        </v-row>
        <v-row
          align="center"
          justify="center"
        >
          <v-btn
            ref="playBtn"
            @click="playPause"
          >
            <v-icon
              ref="icon"
              large
            >
              {{ playing ? 'mdi-pause' : 'mdi-play' }}
            </v-icon>
          </v-btn>
        </v-row>
        <v-row
          align="center"
          justify="center"
        >
          <span id="tracktime">00:00 / 00:00</span>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script src="./Audio.js"></script>

<style scoped src="./Audio.css"></style>

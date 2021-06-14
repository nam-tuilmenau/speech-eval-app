<template>
  <v-container>
    <p>
      In each of the following tests, you hear a combination of three digits (for example 1 5 3),
      spoken with noise in the background. Simply enter the three numbers that you have understood
      in the answer boxes below each audio file.
    </p>
    <v-row>
      <v-col
        v-for="(audiosInfo, id) in audiosInfos"
        :key="id"
        cols="12"
      >
        <DigitTestQuestion
          :ref="`question${id}`"
          :audios-info="audiosInfo"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script src="./DigitTest.js"></script>
<style scoped src="./DigitTest.css"></style>

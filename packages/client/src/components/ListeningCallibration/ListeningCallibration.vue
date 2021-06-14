<template>
  <v-container v-if="readyToPlay">
    Please adjust the level of your computer to a comfortable level so that you hear the following audio sample very well.
    <Audio
      :id="id"
      ref="audio"
    />
    <p><b>NOTE:</b> After that, you are not allowed to change the volume anymore. Otherwise your response will be rejected.</p>
  </v-container>
</template>

<script src="./ListeningCallibration.js"></script>

<style scoped src="./ListeningCallibration.css"></style>

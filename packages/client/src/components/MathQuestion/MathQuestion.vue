<template>
  <v-container v-if="audioId">
    <span>Please listen to the following audio file and type in the answer:</span>
    <v-row justify="center">
      <v-col
        cols="12"
        md="4"
      >
        <Audio
          :id="audioId"
          ref="audio"
        />
      </v-col>
      <v-col
        cols="12"
        md="8"
      >
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
            v-model="answer"
            label="Answer"
            :rules="rules"
            :hint="`Example: ${answerSample}`"
          />
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script src="./MathQuestion.js"></script>
<style scoped src="./MathQuestion.css"></style>

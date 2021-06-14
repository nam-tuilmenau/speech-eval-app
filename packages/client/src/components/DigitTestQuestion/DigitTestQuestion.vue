<template>
  <v-container v-if="enoughAudios">
    <p>
      Below you hear a combination of {{ numberOfDigits }} digits spoken with noise in the background. Simply enter the numbers that you have understood
      in the answer box <strong>separated by a space</strong>. Please <strong>type '{{ noDigitChar }}'</strong> if you don't understand a digit. For example: {{ answerSample }}.
    </p>
    <v-row justify="center">
      <v-col
        cols="12"
        md="4"
      >
        <AudioSequence
          ref="audioSequence"
          :audios-info="audiosInfo"
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
            validate-on-blur
            label="Answer"
            :rules="rules"
            :hint="`Example: ${answerSample}`"
          />
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script src="./DigitTestQuestion.js"></script>
<style scoped src="./DigitTestQuestion.css"></style>

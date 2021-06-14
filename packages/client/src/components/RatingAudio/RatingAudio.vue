<template>
  <v-container v-if="audioInfo.id">
    <v-row>
      <v-col cols="12">
        {{ questionNumber }}. How do you rate <b>the overall quality</b> of the following speech sample?
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <Audio
          :id="audioInfo.id"
          ref="audio"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8">
        <b>Quality of speech</b>
      </v-col>
      <v-col
        cols="4"
        class="text-right"
      >
        <b>Score</b>
      </v-col>
      <v-col cols="12">
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-radio-group
            v-model="rating"
            class="radio-group-full-width"
            :mandatory="true"
            :rules="rules"
          >
            <v-row
              v-for="(possibleAnswer, index) in possibleAnswers"
              :key="index"
            >
              <v-col cols="8">
                <v-radio
                  :id="getElementId(index)"
                  tabindex="0"
                  :label="possibleAnswer.qualityOfSpeech"
                  :value="possibleAnswer.score"
                  :disabled="!canBeRated"
                />
              </v-col>
              <v-col
                cols="4"
                class="text-right"
              >
                <label
                  :for="getElementId(index)"
                >
                  {{ possibleAnswer.score }}
                </label>
              </v-col>
            </v-row>
          </v-radio-group>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script src='./RatingAudio.js'></script>
<style src='./RatingAudio.css' scoped></style>

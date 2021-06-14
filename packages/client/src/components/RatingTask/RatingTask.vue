<template>
  <v-container v-if="readyToStart">
    <div v-show="!started">
      <v-row>
        <v-col>
          <h1>Ratings</h1>
          <p>Please answer the following {{ audiosInfo.length }} questions. For each question, please listen to the audio sample and give your opinion about the quality of the speech you hear on the following scale. Note that the scale will be activated when the speech sample is played until the end. In case you hear an interruption message, please follow the instruction given in the message.</p>
          <p>There is no right or wrong answer as long as you listen to the audio files and give your opinion.</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-expansion-panels v-if="isRepeatingRatingJob">
            <v-expansion-panel>
              <v-expansion-panel-header>
                Check general information again
                <template v-slot:actions>
                  <v-icon>mdi-eye</v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <RatingIntroduction
                  :show-action-button="false"
                  :show-greeting="false"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            color="primary"
            @click="startRatingTask"
          >
            Continue
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <v-container v-if="started">
      <v-row justify="center">
        <v-col
          cols="12"
          sm="8"
          md="8"
        >
          <div class="caption font-weight-bold text-center">
            {{ `${currentQuestion}/${totalQuestions}` }}
          </div>
          <v-progress-linear
            v-model="progress"
            height="5"
            reactive
          />
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col
          v-for="(audioInfo, index) in audiosInfo"
          :key="index"
          cols="12"
          sm="8"
          md="8"
          class="ma-0 pa-0"
        >
          <div v-if="currentAudioIndex === index">
            <DegradationCategoryRating 
              v-if="isDegradationCategoryRating(audioInfo)"
              :ref="`question${index}`"
              :audios-info="audioInfo"
              :question-number="index + 1"
            />
            <ComparisonCategoryRating 
              v-else-if="isComparisonCategoryRating(audioInfo)"
              :ref="`question${index}`"
              :audios-info="audioInfo"
              :question-number="index + 1"
            />
            <RatingAudio
              v-else
              :ref="`question${index}`"
              :question-number="index + 1"
              :audio-info="audioInfo"
            />
          </div>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col
          cols="12"
          md="8"
          sm="8"
        >
          <v-btn
            color="primary"
            tabindex="0"
            @click="nextAudio"
          >
            {{ currentQuestion === totalQuestions && isRatingJob ? 'Finish' : 'Continue' }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script src="./RatingTask.js"></script>
<style scoped src="./RatingTask.css"></style>

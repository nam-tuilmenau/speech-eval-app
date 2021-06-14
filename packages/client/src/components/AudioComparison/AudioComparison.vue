<template>
  <v-container>
    <p>{{ instruction }}</p>
    <v-row v-if="rightNumberOfAudios">
      <v-col
        v-for="(audioInfo, id) in audiosInfo"
        :key="id"
        cols="6"
      >
        <Audio
          :id="audioInfo.id"
          :ref="audioInfo.id"
          :title="id === 0 ? sampleAName : sampleBName"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        justify="center"
        align="center"
      >
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-radio-group
            v-model="selectedAnswer"
            :rules="rules"
            :disabled="listeningIsRequired && !(playbackAEnded && playbackBEnded)"
          >
            <v-radio
              v-for="(answerOption, index) in answerOptions"
              :key="index"
              :value="index"
            >
              <template v-slot:label>
                <span v-html="answerOption.text" />
              </template>
            </v-radio>
          </v-radio-group>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script src="./AudioComparison.js"></script>

<template>
  <v-container>
    <AudioComparison
      ref="audioComparison"
      :audios-info="audiosInfo"
      :answer-options="answerOptions"
      :listening-is-required="true"
      :instruction="instruction"
      :auto-focus="true"
    />
  </v-container>
</template>

<script src="./DegradationCategoryRating.js"></script>

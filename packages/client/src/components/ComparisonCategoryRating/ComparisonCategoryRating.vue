<template>
  <v-container>
    <AudioComparison
      v-if="rightNumberOfAudios"
      ref="audioComparison"
      :audios-info="shuffledAudiosInfo"
      :answer-options="answerOptions"
      :listening-is-required="true"
      :instruction="instruction"
      :auto-focus="true"
    />
  </v-container>
</template>

<script src="./ComparisonCategoryRating.js"></script>

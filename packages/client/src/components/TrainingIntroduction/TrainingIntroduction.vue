<template>
  <v-container>
    <div v-if="!retraining">
      <h1>Training job</h1>
      <p>
        Welcome and congratulaitions! You have been selected to participate in our speech quality assessment experiment.
      </p>
      <p>
        This is a training job. By completing this job, you will get acess to rating tasks which will expire in {{ trainingJob.qualificationExpiration }}. Within that time, you can perform the rating job as long as it is available for you.
      </p>
      <p>
        <b>Please use {{ trainingJob.device }}</b> for listening to the audio files.
      </p>
    </div>
    <div v-else>
      <h1>Welcome</h1>
      <p>
        You should repeat a training session to be able to conduct more rating tasks.
      </p>
      <p>
        <b>Please use {{ trainingJob.device }}</b> for listening to the audio files.
      </p>
    </div>
    <v-btn
      color="primary"
      @click="next"
    >
      Continue
    </v-btn>
  </v-container>
</template>

<script src="./TrainingIntroduction.js"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped src="./TrainingIntroduction.css"></style>

<template>
  <v-container class="qualification-introduction">
    <div class="introduction">
      <h1>Introduction</h1>
      <p>
        We are looking for crowdworkers who are willing to participate in a <b>speech quality assessment</b> experiment.
        During this test you will listen to {{ qualificationJob.numberOfStimuli }} <b>audio files</b>,
        each 6-8 seconds long (two sentences), via your listening device and you will be asked to indicate
        your opinion quality of each on the following scale:
      </p>
      <img
        class="pure-img rating-scale-img"
        src="/static/img/rating_scale.png"
      >
      <p>
        Each of these tasks can be completed in about <b>{{ qualificationJob.taskDuration }} minutes</b>.
        There will be several tasks available for each crowdworker.
        It results in <b>$ {{ qualificationJob.compensationWithBonuses }}</b> compensation.
      </p>
    </div>
    <div class="procedure">
      <h1>Procedure</h1>
      <ol>
        <li>To get access to the above mentioned <b>rating job</b>, you should first complete this <b>qualification job.</b></li>
        <li>A selected group of crowdworkers will be invited to perform the <b>training job ({{ trainingJob.duration }} minutes)</b> in which you will listen to {{ trainingJob.numberOfStimuli }} sample audio files.</li>
        <li>Then, they get access to the <b>rating job</b> and can perform the tasks several times.</li>
      </ol>
    </div>
    <div class="conditions">
      <h1>Conditions</h1>
      <ul>
        <li>You must perform the task in a <b>quiet environment</b>, like at home.</li>
        <li>You must use <b>headphones</b>. Note that <u>loudspeakers</u> are <b>not acceptable</b>.</li>
      </ul>
    </div>
    <div>
      <p>Thank you for your help in this experiment.</p>
    </div>
    <v-btn
      color="primary"
      @click="next"
    >
      Continue
    </v-btn>
  </v-container>
</template>

<script src="./QualificationIntroduction.js"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped src="./QualificationIntroduction.css"></style>

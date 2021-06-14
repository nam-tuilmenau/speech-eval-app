<template>
  <v-container>
    <div class="welcome">
      <h1 v-if="showGreeting">
        Rating job
      </h1>
      <p>
        This task has two sections:
        <ul>
          <li><b>Setup:</b> Configure your system and validate it by answering {{ ratingJob.numberValidationQuestions }} questions</li>
          <li><b>Rating:</b> Listen to {{ ratingJob.numberOfStimuli }} audio files and give your opinion about the quality of the speech you hear</li>
        </ul>
      </p>
      <p>
        You can perform as many tasks from this job using the same url until your qualification expires ({{ ratingJob.expirationTimeVerbose }} after assigning). When your qualification is expired, you can obtain it again by repeating the training job.
      </p>
      <p>
        You should follow the below mentioned rules, otherwise your answers will be invalid.
      </p>
    </div>
    <div class="rules">
      <h1>Rules</h1>
      <p>
        <ul>
          <li>Use a <b>headset</b>, not the loudspeaker: otherwise your response will be rejected</li>
          <li>Perform the task in a <b>quiet environment</b></li>
          <li>Do not change the volume after modifying it in the Setup section</li>
        </ul>
      </p>
    </div>
    <div class="payment">
      <h1>Payment</h1>
      <p>
        The result of this experiment is <b>very important for us and other scientists</b> working in this area. We have methods that analyse the consistency of your answers. We will use these methods to rank the submitted assignments according to quality.
      </p>
      <p>
        For this experiment, we will pay a base reward of <b>{{ ratingJob.currencySymbol + ratingJob.baseReward }}</b> for every accepted {{ ratingJob.hitName }}. We have made available a set of <b>{{ ratingJob.numberOfHits }}</b> different {{ ratingJob.hitName }}s. You will receive a bonus of:
        <ul>
          <li>{{ ratingJob.currencySymbol + ratingJob.bonusRewardAll }}/{{ ratingJob.hitName }}(for a total of <b>{{ ratingJob.currencySymbol + allCompletedReward }}/{{ ratingJob.hitName }}</b>) if you submit <b>more than {{ ratingJob.minTasksBonus }} {{ ratingJob.hitName }}s</b> or</li>
          <li>{{ ratingJob.currencySymbol + ratingJob.bonusRewardBest }}/{{ ratingJob.hitName }}(for a total of <b>{{ ratingJob.currencySymbol + bestCompletedReward }}/{{ ratingJob.hitName }}</b>) if you submit <b>more than {{ ratingJob.minTasksBonus }} {{ ratingJob.hitName }}s</b> and are in the <b>top 20% quality group</b>.</li>
        </ul>
      </p>
    </div>
    <div v-if="showActionButton">
      <v-btn
        color="primary"
        @click="next"
      >
        Continue
      </v-btn>
    </div>
  </v-container>
</template>

<script src="./RatingIntroduction.js"></script>

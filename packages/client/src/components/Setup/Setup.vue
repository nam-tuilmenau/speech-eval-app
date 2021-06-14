<template>
  <v-container>
    <AudioPreloader
      v-if="!ready"
      ref="audioPreloader"
      v-bind="{ audioInfos: audioList }"
      @complete="startTest"
    />
    <div v-show="ready">
      <h1>Setup</h1>
      <h2>Please wear your headphones now</h2>
      <ol>
        <li v-if="showCallibration">
          <ListeningCallibration ref="callibrationTest" />
        </li>
        <li v-if="showDigitQuestion">
          <DigitTestQuestion ref="digitTest" />
        </li>
        <li v-if="showMathQuestion">
          <MathQuestion ref="mathQuestion" />
        </li>
        <li v-if="showComparison">
          <ListeningComparisonTest ref="comparison" />
        </li>
      </ol>
      <v-btn
        color="primary"
        @click="checkSetup"
      >
        {{ isQualificationJob && jobsAreSeparated ? 'Finish' : 'Continue' }}
      </v-btn>
    </div>
  </v-container>
</template>

<script src="./Setup.js"></script>

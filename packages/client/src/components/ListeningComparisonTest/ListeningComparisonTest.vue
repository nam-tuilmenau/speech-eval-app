<template>
  <v-container>
    <v-row v-if="availableAudios">
      <p>
        For the following questions, please specify which sample has a better quality compared to the other one from your perspective.
      </p>
      <ol>
        <li
          v-for="(audiosInfo, id) in audiosInfoPairs"
          :key="id"
        >
          <ListeningComparison
            :ref="`question${id}`"
            :audios-info="audiosInfo"
          />
        </li>
      </ol>
    </v-row>
  </v-container>
</template>

<script src="./ListeningComparisonTest.js"></script>

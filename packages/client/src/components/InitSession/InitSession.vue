<template>
  <v-container>
    <MessagePage v-if="startedSession">
      <template v-slot:title>
        <h1 v-if="sessionExpired">
          Your session has expired
        </h1>
        <h1 v-else>
          You have already started a job
        </h1>
      </template>
      <template v-slot:message>
        <p v-if="sessionExpired">
          Please continue your session where you started.
          <a @click="forceInitSession">Click here</a> to continue your job.
        </p><p v-else>
          Please continue your session where you started.
          Or <a @click="forceInitSession">click here</a> to continue your job in this window.
        </p>
      </template>
    </MessagePage>
  </v-container>
</template>

<script src="./InitSession.js"></script>

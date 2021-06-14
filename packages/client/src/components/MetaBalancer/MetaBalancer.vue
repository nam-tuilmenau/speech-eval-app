<template>
  <v-container>
    <MessagePage v-if="noMoreJobs">
      <template v-slot:title>
        <h1>
          Sorry!
        </h1>
      </template>
      <template v-slot:message>
        <p>
          There are no more available jobs.
        </p>
      </template>
    </MessagePage>
    <v-container v-else-if="askWorkerId">
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <p>Please type your worker id:</p>
        <div>
          <v-text-field
            ref="workerIdTF"
            v-model="selfWorkerId"
            :rules="rules"
          />
        </div>
        <v-btn
          color="primary"
          @click="validate"
        >
          Continue
        </v-btn>
      </v-form>
    </v-container>
    <h1 v-else>
      Loading ...
    </h1>
  </v-container>
</template>

<script src="./MetaBalancer.js"></script>

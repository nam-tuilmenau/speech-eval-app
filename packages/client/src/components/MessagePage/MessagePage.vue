<template>
  <v-container>
    <h1 v-if="title">
      {{ title }}
    </h1>
    <p v-if="message">
      {{ message }}
    </p>
    <slot name="title" />
    <slot name="message" />
  </v-container>
</template>

<script src="./MessagePage.js"></script>

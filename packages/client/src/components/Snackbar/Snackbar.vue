<template>
  <v-snackbar
    v-model="notification.show"
    :color="notification.type"
    :multi-line="multiline"
  >
    {{ notification.message }}
    <v-btn
      text
      @click="notification.show = false"
    >
      Close
    </v-btn>
  </v-snackbar>
</template>

<script src="./Snackbar.js"></script>

<template>
  <v-container>
    <MessagePage
      :title="title"
      :message="message"
    />
    <v-container v-if="showFinishCode">
      <p>Use the following code to recieve yor payment:</p>
      <div>
        <v-text-field
          ref="finishCodeText"
          :append-outer-icon="'mdi-content-copy'"
          readonly
          :value="paymentCode"
          @click:append-outer="copyToClipboard"
        />
      </div>
    </v-container>
  </v-container>
</template>

<script src="./FinishJobPage.js"></script>

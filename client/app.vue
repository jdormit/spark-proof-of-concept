<template>
    <div class="container">
        <editor v-on:input="serializeInput" v-bind:text="text" filename="test"></editor>
    </div>
</template>
<script>
 import Editor from './components/editor.vue';

 const SEND_INPUT_INTERVAL = 200;

 export default {
     name: 'app',
     props: {
         'text': {
             type: String,
             required: true
         },
         'inputSerializer': {
             type: Object,
             required: true
         },
         'socket': {
             type: Object,
             required: true
         }
     },
     components: {
         'editor': Editor
     },
     mounted: function() {
         var self = this;
         setInterval(() => {
             if (self.inputSerializer.getBuffer().length > 0) {
                 let inputBuffer = self.inputSerializer.flushInputBuffer();
                 self.socket.emit("input", inputBuffer);
             }
         }, SEND_INPUT_INTERVAL);
     },
     methods: {
         serializeInput: function(input) {
             this.inputSerializer.addInput(input);
         }
     }
 }
</script>
<style>
 .container {
     margin: auto;
     width: 80%;
     text-align: center;
 }
</style>

<template>
    <div class="container">
        <editor
            v-on:input="serializeInput"
            v-on:cursor="sendCursorData"
            v-on:save="handleSave"
            v-bind:text="text"
            v-bind:inputBuffer="inputBuffer"
            v-bind:remoteCursors="cursors"
            filename="test">
        </editor>
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
         },
         'id': {
             type: String,
             required: true
         }
     },
     data() {
         return {
             inputBuffer: [],
             cursors: {}
         };
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
         self.socket.on("input", function(inputBuffer) {
             self.inputBuffer = inputBuffer;
         });
         self.socket.on("cursors", function(cursors) {
             cursors.self = cursors[self.id];
             delete cursors[self.id];
             self.cursors = cursors;
         });
     },
     methods: {
         serializeInput: function(input) {
             this.inputSerializer.addInput(input);
         },
         sendCursorData: function(cursor) {
             this.socket.emit("cursor", cursor);
         },
         handleSave: function() {
             this.socket.emit("save");
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

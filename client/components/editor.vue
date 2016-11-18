<template>
    <div>
        <div class="text-buffer" v-on:keydown="handleKeydown" tabindex="1" autofocus>
            <div v-for="(row, index) in rows" :key="index" class="row-container">
                <div v-for="cursor in cursors">
                    <span v-if="cursor.row === index" v-bind:style="calculateCursorPositionStyle(cursor)" class="cursor"></span>
                </div>
                <span class="row">{{row}}</span>
            </div>
        </div>
    </div>
</template>
<script>
 import Remington from 'remington';
 import calculatePixelSize from 'calculate-pixel-size';
 
 export default {
     name: 'editor',
     mounted() {
         const self = this;
         self.rows = self.parseRows(self.text);
         self.writer = new Remington(this.$el, this.rows, function(inputEvent) {
             for (let i = 0; i < self.writer.getBuffer().length; i++) {
                 self.rows.splice(i, 1, self.writer.getBuffer()[i]);
             }
             const oldCursor = Object.assign({}, inputEvent.oldCursor);
             self.cursors.self = self.writer.getCursor();
             // Figure out whether to serialize the character or the keyCode.
             // This jank is a result of the buffer abstraction.
             // A better choice would have been to separate the buffer API from
             // the input API
             switch(inputEvent.type) {
                 case "keypress":
                     self.$emit('input', {
                         cursor: oldCursor,
                         value: inputEvent.key
                     });
                     break;
                 case "keydown":
                     self.$emit('input', {
                         cursor: oldCursor,
                         value: inputEvent.keyCode
                     });
                     break;
             }
         });
      },
     methods: {
         parseRows(text) {
             if (Array.isArray(text)) {
                 return text;
             }
             else {
                 const rows = text.split('\n');
                 for (let i = 0; i < rows.length; i++) {
                     rows[i] += '\n';
                 }
                 return rows;
             }
         },
         calculateCursorPositionStyle(cursor) {
             const styleOptions = {
                 style: {
                     fontFamily: "monospace"
                 }
             }
             const textToCursor = this.rows[cursor.row].slice(0, cursor.col);
             const leftOffset = calculatePixelSize(textToCursor, styleOptions).width;
             const cursorHeight = calculatePixelSize("I", styleOptions).height;
             const cursorWidth = calculatePixelSize(this.rows[cursor.row].slice(cursor.col, cursor.col + 1), styleOptions).width;
             return {
                 left: leftOffset + "px",
                 width: cursorWidth + "px",
                 height: cursorHeight + "px"
             }
         },
         moveCursor(colChange, rowChange) {
             this.writer.setCursor(this.writer.getCursor().col + colChange, this.writer.getCursor().row + rowChange);
             this.cursors.self = this.writer.getCursor();
             this.$emit('cursor', this.writer.getCursor());
         },
         handleKeydown(event) {
             var validKeydown = true;
             switch(event.keyCode) {
                 // Up
                 case 38:
                     event.preventDefault();
                     event.stopPropagation();
                     this.moveCursor(0, -1);
                     break;
                 // Down
                 case 40:
                     event.preventDefault();
                     event.stopPropagation();
                     this.moveCursor(0, 1);
                     break;
                 // Left
                 case 37:
                     event.preventDefault();
                     event.stopPropagation();
                     this.moveCursor(-1, 0);
                     break;
                 // Right
                 case 39:
                     event.preventDefault();
                     event.stopPropagation();
                     this.moveCursor(1, 0);
                     break;
                 // ctrl-s
                 case 83:
                     if (event.ctrlKey) {
                         event.preventDefault();
                         event.stopPropagation();
                         this.$emit('save');
                         alert("Document saved.");
                     }
                     break;
             }
         }
     },
     props: {
         'text': {
             type: String,
             default: ""
         },
         'initialCursors': {
             type: Object,
             default: function() {
                 return {
                     self: {
                         row: 0,
                         col: 0
                     }
                 };
             }
         },
         'remoteCursors': {
             type: Object,
             required: true
         },
         'filename': {
             type: String,
             required: true
         },
         'inputBuffer': {
             type: Array,
             required: true
         }
     },
     watch: {
         'inputBuffer': function(buffer) {
             var self = this;
             const cursorPos = Object.assign({}, self.writer.getCursor());
             buffer.forEach(function(input) {
                 self.writer.setCursor(input.cursor.col, input.cursor.row);
                 self.writer.sendInput(input.value);
             });
             self.writer.setCursor(cursorPos.col, cursorPos.row);
             for (let i = 0; i < self.writer.getBuffer().length; i++) {
                 self.rows.splice(i, 1, self.writer.getBuffer()[i]);
             }
         },
         'remoteCursors': function(cursors) {
             const newCursors = {};
             for (let cursorName in cursors) {
                 let currentCursor = cursors[cursorName];
                 if (!this.cursors[cursorName]) {
                     this.cursors[cursorName] = {};
                 }
                 newCursors[cursorName] = currentCursor;
             }
             this.cursors = newCursors;
         }
     },
     data() {
         return {
             'cursors': this.initialCursors,
             'rows': []
         };
     }
 }
</script>
<style>
 .text-buffer {
     border: 1px solid black;
     padding: 4px;
     margin: auto;
     outline: none;
     font-family: monospace;
     text-align: left;
     overflow-x: scroll;
 }
 .row-container {
     position: relative;
 }
 .row {
     white-space: pre;
 }
 .cursor {
     position: absolute;
     border-left: 1px solid black;
 }
</style>

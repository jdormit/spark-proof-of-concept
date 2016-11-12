<template>
    <div>
        <div class="text-buffer" v-on:keydown="handleKeydown" tabindex="1" autofocus>
            <div v-for="(row, index) in rows" :key="index" class="row-container">
                <div v-for="cursor in cursorsAtRow(index)">
                    <span v-bind:style="calculateCursorPositionStyle(cursor)" class="cursor"></span>
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
             self.cursors.self = self.writer.getCursor();
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
         cursorsAtRow(row) {
             const cursors = [];
             Object.keys(this.cursors).forEach((cursorName) => {
                 const cursor = this.cursors[cursorName];
                 if (cursor.row === row) {
                     cursors.push(cursor);
                 }
             });
             return cursors;
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
         handleKeydown(event) {
             var preventDefault = true;
             switch(event.keyCode) {
                 // Up
                 case 38:
                     this.writer.setCursor(this.writer.getCursor().col, this.writer.getCursor().row - 1);
                     break;
                 // Down
                 case 40:
                     this.writer.setCursor(this.writer.getCursor().col, this.writer.getCursor().row + 1);
                     break;
                 // Left
                 case 37:
                     this.writer.setCursor(this.writer.getCursor().col - 1, this.writer.getCursor().row);
                     break;
                 // Right
                 case 39:
                     this.writer.setCursor(this.writer.getCursor().col + 1, this.writer.getCursor().row);
                     break;
                 default:
                     preventDefault = false;
                     break;
             }
             this.cursors.self = this.writer.getCursor();
             if (preventDefault) {
                 event.preventDefault();
                 event.stopPropagation();
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
         'filename': {
             type: String,
             required: true
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

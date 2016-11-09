<template>
    <div>
        <div class="text-buffer" tabindex="1">
            <div class="row" v-for="(row, index) in rows" :key="index">{{row}}</div>
        </div>
    </div>
</template>
<script>
 import Remington from 'remington'
 
 export default {
     name: 'editor',
     mounted() {
         const self = this;
         const writer = new Remington(this.$el, this.rows, function(inputEvent) {
             for (let i = 0; i < writer.getBuffer().length; i++) {
                 self.rows.splice(i, 1, writer.getBuffer()[i]);
             }
         });
     },
     methods: {
         parseInitialRows(initialRows) {
             if (Array.isArray(initialRows)) {
                 return initialRows;
             }
             else {
                 const rows = initialRows.split('\n');
                 for (let i = 0; i < rows.length; i++) {
                     rows[i] += '\n';
                 }
                 return rows;
             }
         }
     },
     props: {
         'initialRows': {
             type: Array,
             default: () => []
         },
         'initialCursors': {
             type: Array,
             default: () => [{row: 0, col: 0}]
         },
         'filename': {
             type: String,
             required: true
         }
     },
     data() {
         return {
             'rows': Array.isArray(this.initialRows) ? this.initialRows : this.parseInitialRows(this.initialRows),
             'cursors': this.initialCursors
         };
     }
 }
</script>
<style>
 .text-buffer {
     width: 500px;
     height: 750px;
     border: 1px solid black;
 }

 .row {
     white-space: pre;
 }
</style>

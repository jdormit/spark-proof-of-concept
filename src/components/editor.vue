<template>
    <div>
        <div class="text-buffer" tabindex="1">
            <div v-for="(row, index) in rows" :key="index">
                {{ row }}
            </div>
        </div>
    </div>
</template>
<script>
 import Remington from 'remington'
 
 export default {
     name: 'editor',
     mounted() {
         const self = this;
         const writer = new Remington(this.$el, function(inputEvent) {
             for (let i = 0; i < writer.getBuffer().length; i++) {
                 self.rows.splice(i, 1, writer.getBuffer()[i]);
             }
         });
     },
     props: {
         'initialRows': {
             type: Array,
             default: () => []
         },
         'initialCursors': {
             type: Array,
             default: () => []
         },
         'filename': {
             type: String,
             required: true
         }
     },
     data() {
         return {
             'rows': this.initialRows,
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
</style>

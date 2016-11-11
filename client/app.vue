<template>
    <div class="container">
        <editor v-bind:text="text" filename="test"></editor>
    </div>
</template>
<script>
 import Editor from './components/editor.vue';

 export default {
     name: 'app',
     props: {
         'text': {
             type: String,
             required: true
         }
     },
     components: {
         'editor': Editor
     }
 }
</script>

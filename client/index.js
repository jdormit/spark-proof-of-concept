import Vue from 'vue';
import App from './app.vue';
import io from 'socket.io-client';

// No URL specified defaults to connecting to the serving host
const socket = io();

socket.on('fileText', function(text) {
    new Vue({
        el: '#app',
        render: function(createElement) {
            return createElement(App, {
                props: {
                    text: text
                }
            })
        }
    });
});

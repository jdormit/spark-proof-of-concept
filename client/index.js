import Vue from 'vue';
import io from 'socket.io-client';
import App from './app.vue';
import InputSerializer from './input-serializer';

// No URL specified defaults to connecting to the serving host
const socket = io();
const inputSerializer = new InputSerializer();

socket.on('fileText', function(text) {
    new Vue({
        el: '#app',
        render: function(createElement) {
            return createElement(App, {
                props: {
                    text: text,
                    inputSerializer: inputSerializer,
                    socket: socket
                }
            })
        }
    });
});

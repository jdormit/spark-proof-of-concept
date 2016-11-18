# Spark Proof of Concept
This is a proof of concept for a real-time collaborative text editor. Project details can be found [here](https://jdormit.github.io/senior-project-site/).

## Installation and Usage
To install and start the server:

```
$ git clone https://github.com/jdormit/spark-proof-of-concept
$ cd spark-proof-of-concept
$ npm install
$ npm run build
$ npm start -- path/to/a/file
```

The server is now running on port 8080. If you visit http://localhost:8080 in your browser, you will be able to edit the specified file in your browser. If you visit the server from another tab or browser, you'll be able to see both cursors and watch the text get update in real-time.

## Editor Navigation
As this is just a proof of concept, navigation is limited. Arrow keys to move the cursor, ctrl-s to save.

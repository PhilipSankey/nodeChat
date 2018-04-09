var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
  socket.username = "Anonymous";
  io.emit("join", "hi " + socket.username + ":)");

  socket.on("chat message", function(msg) {
    socket.broadcast.emit("chat message", {
      username: socket.username,
      message: msg
    });
  });

  socket.on("typing", function() {
    socket.broadcast.emit("typing", { username: socket.username });
  });

  socket.on("update username", function(data) {
    console.log(
      "usename is being update from:" + socket.username + " to:" + data.username
    );
    socket.username = data.username;
  });

  socket.on("disconnect", function() {
    io.emit("disconnect", "user disconnected");
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});

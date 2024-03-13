const express = require("express");
const expressSession = require("express-session");
const morgan = require("morgan");
const passport = require("./middlewares/authentication");
const db = require("./models");
const { Server } = require("socket.io");
const { createServer } = require("http");
const app = express();
const PORT = process.env.PORT;

app.use(express.json({ limit: "10mb" }));

// setup session cookies
app.use(
	expressSession({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
	})
);

app.use(passport.initialize());
app.use(passport.session());

const logFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(logFormat));

app.use("/api", require("./controllers"));

// update DB tables based on model updates
// toggling force to true resets all tables
db.sequelize.sync({ force: false });

// Websocket
const httpServer = createServer(app);
const io = new Server(httpServer, {
	/* options */
});

io.on("connection", (socket) => {
	console.log("user connected");
	socket.join("room1");
	socket.on("disconnect", function () {
		console.log("user disconnected");
	});
	io.to("room1").emit("A client has joined!");
});

// start up the server
if (PORT) {
	httpServer.listen(PORT, () => console.log(`Listening on ${PORT}`));
} else {
	console.log("===== ERROR ====\nCREATE A .env FILE!\n===== /ERROR ====");
}

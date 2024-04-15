const express = require("express");
const GameManager = require("./game/gameManager");
const expressSession = require("express-session");
const morgan = require("morgan");
const passport = require("./middlewares/authentication");
const db = require("./models");
const { Server } = require("socket.io");
const { createServer } = require("http");
const app = express();
const server = createServer(app);
const registerEventHandlers = require("./eventHandlers/eventhandler");

const corsOrigin =
	process.env.NODE_ENV === "production"
		? process.env.CLIENT_URL
		: "http://localhost:3000";

const io = require("socket.io")(server, {
	cors: {
		origin: corsOrigin,
		methods: ["GET", "POST"],
	},
});

function useHandshakeMiddleware(middleware) {
	return (req, res, next) => {
		const isHandshake = req._query.sid === undefined;
		if (isHandshake) {
			middleware(req, res, next);
		} else {
			next();
		}
	};
}

const sessionMiddleware = expressSession({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
});

const PORT = process.env.PORT;

app.use(express.json({ limit: "10mb" }));

// setup session cookies
app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

io.engine.use(useHandshakeMiddleware(sessionMiddleware));
io.engine.use(useHandshakeMiddleware(passport.session()));
io.engine.use(
	useHandshakeMiddleware((req, res, next) => {
		if (req.user) {
			next();
		} else {
			return res.end();
		}
	})
);

const logFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(logFormat));

app.use("/api", require("./controllers"));

// update DB tables based on model updates
// toggling force to true resets all tables
db.sequelize.sync({ force: false });

const gameManager = new GameManager(io);

const onConnection = (socket) => {
	console.log(
		`user connected: ${socket.request.user.First_Name} ${socket.request.user.Last_Name}`
	);
	registerEventHandlers(io, socket, gameManager);
};

io.on("connection", onConnection);

// start up the server
if (PORT) {
	server.listen(PORT, () => console.log(`Listening on ${PORT}`));
} else {
	console.log("===== ERROR ====\nCREATE A .env FILE!\n===== /ERROR ====");
}

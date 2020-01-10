const http = require('http');

let repeater = require("../lib/");

let params = {
	urls: ["http://127.0.0.1:8091", "http://127.0.0.1:8092", "http://127.0.0.1:8093"],
	port: 8081
};

var httpServer = new http.Server(params.port, [
	(req) => {
		req.session = {}
	}, {
		"*": repeater(params.urls)
	}
]);


setInterval(() => {
	console.warn("server is running", new Date());
}, 1000 * 5);


httpServer.enableCrossOrigin();

let version = process.version.split("-")[0].split('.')[1];
if (Number(version) < 29) {
	httpServer.run(() => {});
} else {
	httpServer.start();
}
const http = require('http');
const url = require('url');
const net = require('net');
const coroutine = require('coroutine');

http.timeout = 200;

let temp_urls;

let checkUrlsWorker = (urls, path, r) => {

	let _urls = [];

	coroutine.parallel(urls, function(e) {

		let _url = new net.url(e + path);

		let rs;

		try {
			rs = http.get(_url);
		} catch (f) {
			return;
		}

		if (rs && rs.data && new Buffer(rs.data, "utf8").toString() == "true") {
			_urls.push(e);
		}

	})

	_urls.sort();

	let url_p = temp_urls.toString();
	let url_n = _urls.toString();

	if (url_p != url_n) {
		temp_urls = _urls;
		r.load(temp_urls);
	}

	console.warn(" checkUrlsWorker is running ", temp_urls);
}

module.exports = params => {

	let urls, path;

	if (!params) {
		console.warn("no params");
		process.exit();
	}

	if (!params.urls) {
		console.warn("no urls");
		process.exit();
	}

	urls = params.urls.sort();
	temp_urls = params.urls;

	path = params.path || "/health";

	let r = new http.Repeater(urls);

	checkUrlsWorker(urls, path, r)

	setInterval(() => {
		checkUrlsWorker(urls, path, r)
	}, 1000 * 5);

	return r;
}
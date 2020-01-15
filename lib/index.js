const http = require('http');
const url = require('url');
const net = require('net');
const coroutine = require('coroutine');

http.timeout = 200;

let temp_urls;

function equar(a, b) {
	if (a.length !== b.length) {
		return false
	} else {
		for (let i = 0; i < a.length; i++) {
			if (a[i] !== b[i]) {
				return false
			}
		}
		return true;
	}
}

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

	if (!equar(temp_urls, _urls)) {
		temp_urls = _urls;
		r.load(temp_urls);
	}

	console.warn(" checkUrlsWorker is running ", temp_urls);
}

module.exports = params => {

	let urls, path;

	if (!params) {
		throws new Error("No Params")
	}

	if (!params.urls) {
		throws new Error("No Urls");
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
const http = require('http');

let checkUrlsWorker = (urls, r) => {

	let _urls = [];

	urls.forEach(e => {

		let rs;

		try {
			rs = http.post(e + "/health");
		} catch (f) {
			return;
		}

		if (rs && rs.data && new Buffer(rs.data, "utf8").toString() == "true") {
			_urls.push(e);
		}
	})

	r.load(_urls);

	console.warn(" checkUrlsWorker is running ", _urls);

}

module.exports = params => {

	let urls;

	urls = params;

	let r = new http.Repeater(urls);

	checkUrlsWorker(urls, r)

	setInterval(() => {
		checkUrlsWorker(urls, r)
	}, 1000 * 5);

	return r;
}
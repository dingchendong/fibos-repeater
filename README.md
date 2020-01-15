#fibos-repeater

## Introduction

This is a fibjs ServerLoadBalancer module

An example:

```javascript
...
let repeater = require("../lib/");

let params = {
	urls: ["http://127.0.0.1:8091", "http://127.0.0.1:8092", "http://127.0.0.1:8093"],
	path: "/health"
};

var httpServer = new http.Server(8081, [
	(req) => {
		req.session = {}
	}, {
		"*": repeater(params.urls)
	}
]);
...
```

## Precautions

URLs for ServerLoadBalancer must have `/ health` routes, the response content is true, and the type is boolean or string.

[example code](./examples/index.js)
/*
 GRest 1.3.0
 RESTful web service wrapper.
 
 DEPENDENCIES:
 axios, GObservable
 */

class GRest extends GObservable {

	/**
	@param {String} url The full url of the REST webservice
	@param {() : String} jwtGetter? If this function is provided, will call it to get the current JWT Token and auto-append it to a header named "Authorization" on every request.
	@returns {GRest}
	*/
	constructor(url, jwtGetter) {
		super();

		//normalize the url provided so it ends with /
		this.url = url.trim().replace(new RegExp("(\/)*$", "m"), "/");
		this.jwtGetter = jwtGetter;
	}

	/**
	 Makes an HTTP request.
	 
	 @param {String} method The HTTP method to request (GET, PUT, POST, DELETE)
	 
	 @param {Object} params Request configuration:
	 
	 String resource: name of resources requesting
	 
	 ((Mixed response)=>{}) success: callback on success
	 
	 ((Object fail)=>{})? fail: callback on fail
	 
	 Object? query: object literal with key:value pairs to pass as query params

	 Object? headers: object literal with key:value pairs to pass as headers

	 Object? body: object literal with key:value pairs to pass as body data

	 @returns {undefined}
	 */
	request(method, params) {
		this.notify(method);

		params.headers = params.headers || {};
		params.headers['X-Requested-With'] = 'XMLHttpRequest';

		//auto-token in requests
		if (typeof this.jwtGetter == "function") {
			let token = this.jwtGetter();
			if (token) {
				params.headers['Authorization'] = token;
			}
		}

		axios({
			method: method.toLowerCase(),
			url: this.url + params.resource,
			params: params.query || {},
			data: params.body || {},
			headers: params.headers
		})
			.then(r => {
				this.notify("/" + method);
				(params.success || function () { })(r.data);
			})
			.catch(e => {
				this.notify("/" + method);
				(params.fail || function () { })(e);
			})
	}

	/*
	Quick usage mode:
	get("resource/12345", (success) => {...}, (fail) => {...})
	*/
	get(p, success, fail) {
		if (typeof p == "string") {
			p = {
				resource: p, success, fail
			}
		}
		this.request("GET", p);
	}

	/*
	Quick usage mode:
	post("resource", data?, (success) => {...}, (fail) => {...})
	*/
	post(p, body, success, fail) {
		this._postPut("POST", p, body, success, fail)
	}

	/*
	Quick usage mode:
	put("resource", {data}, (success) => {...}, (fail) => {...})
	*/
	put(p, body, success, fail) {
		this._postPut("PUT", p, body, success, fail)
	}

	_postPut(method, p, body, success, fail) {
		if (typeof p == "string") {
			p = {
				resource: p, body, success, fail
			}
		}
		this.request(method, p);
	}

	/*
	Quick usage mode:
	delete("resource", (success) => {...}, (fail) => {...})
	*/
	delete(p, success, fail) {
		if (typeof p == "string") {
			p = {
				resource: p, success, fail
			}
		}
		this.request("DELETE", p);
	}
};




class GRestEndpoint {

	constructor(id, gRest) {
		//normalize the endpoint id so it ends with /
		this.id = id.trim().replace(new RegExp("(\/)*$", "m"), "/");;
		this.rest = gRest;
	}

	/*
	For more customized requests, see GRest methods
	*/
	request(method, o) {
		o.resource = this.id;
		this.rest[method](o);
	}

	get(query, callback) {
		this._getDel('get', query, callback);
	}

	delete(query, callback) {
		this._getDel('delete', query, callback);
	}

	_getDel(method, query, callback) {
		let type = typeof query;

		//get("?query=string", fn)
		if (type == "string" || type == "number") {
			this.rest[method](this.id + query, callback, callback)
		}

		//get({ query: string }, fn)
		else if (type == "object") {
			this.request(method, {
				query,
				success: callback,
				error: callback
			})
		}

		//get(fn)
		else if (type == "function") {
			this.request(method, {
				success: query,
				error: query
			})
		}
	}

	post(query, data, callback) {
		this._postPut("post", query, data, callback);
	}

	put(query, data, callback) {
		this._postPut("put", query, data, callback);
	}

	_postPut(method, query, data, callback) {
		let type = typeof query;

		//post("?query=string", data?, fn)
		if (type == "string" || type == "number") {
			this.rest[method](this.id + query, data, callback, callback)
		}

		//post({ query: string }, data!, fn)
		else if (type == "object" && typeof data == "object") {
			this.request(method, {
				query,
				body: data,
				success: callback,
				error: callback
			});
		}

		//post(data?, fn)
		else if (type == "object") {
			this.request(method, {
				body: query,
				success: data,
				error: data
			});
		}

		//post(fn)
		else if (type == "function") {
			this.request(method, {
				success: query,
				error: query
			});
		}
	}


	//Ignores keys with null
	static obj2QueryString(o){
		return Object.keys(o).filter(k => o[k] != null).map(k => k + "=" + o[k]).join("&")
	}

};
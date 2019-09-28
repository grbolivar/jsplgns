/*
 GRest 1.1.0
 RESTful web service wrapper.
 
 DEPENDENCIES:
 axios
 */

class GRest {

	/**
	 @param {String} url The full url of the REST webservice
	@param {() : String} jwtGetter? If this function is provided, will call it to get the current JWT Token and auto-append it to a header named "Authorization" on every request.
	@returns {GRest}
	*/
	constructor(url, jwtGetter) {
		//normalize the url provided
		this.url = url.trim().replace(new RegExp("(\/)*$", "m"), "/");
		this.jwtGetter = jwtGetter;
	}

	/**
	 Makes an HTTP request.
	 
	 @param {String} method The HTTP method to request (GET, PUT, POST, DELETE)
	 
	 @param {Object} params Request configuration:
	 
	 String resource: name of resources requesting
	 
	 ((Mixed response)=>{}) success: callback on success
	 
	 ((Object error)=>{})? error: callback on error
	 
	 Object? query: object literal with key:value pairs to pass as query params

	 Object? headers: object literal with key:value pairs to pass as headers

	 Object? body: object literal with key:value pairs to pass as body data

	 @returns {undefined}
	 */
	request(method, p) {
		p.headers = p.headers || {};
		p.headers['X-Requested-With'] = 'XMLHttpRequest';

		//auto-token in requests
		if (typeof this.jwtGetter == "function") {
			let token = this.jwtGetter();
			if (token) {
				p.headers['Authorization'] = token;
			}
		}

		axios({
			method: method.toLowerCase(),
			url: this.url + p.resource,
			params: p.query || {},
			data: p.body || {},
			headers: p.headers
		})
			.then(r => (p.success || function () { })(r.data))
			.catch(e => (p.error || function () { })(e))
	}

	/*
	Quick usage mode:
	get("resource/12345", (success) => {...}, (error) => {...})
	*/
	get(p, success, error) {
		if (typeof p == "string") {
			p = {
				resource: p, success, error
			}
		}
		this.request("GET", p);
	}

	/*
	Quick usage mode:
	post("resource", {data}, (success) => {...}, (error) => {...})
	*/
	post(p, body, success, error) {
		if (typeof p == "string") {
			p = {
				resource: p, body, success, error
			}
		}
		this.request("POST", p);
	}

	put(p, body, success, error) {
		if (typeof p == "string") {
			p = {
				resource: p, body, success, error
			}
		}
		this.request("PUT", p);
	}

	delete(p, success, error) {
		if (typeof p == "string") {
			p = {
				resource: p, success, error
			}
		}
		this.request("DELETE", p);
	}
};
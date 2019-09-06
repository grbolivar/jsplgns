/**
 * GFirebase 1.0.0
 * 
 * Dependencies:
 * firebase, GObservable
 */


class GFirebaseDb extends GObservable {

	constructor() {
		super();
	}

	ref(path) {
		return firebase.database().ref(path);
	}

	get(path, onComplete) {
		this.notify("GET");
		this.ref(path).once("value", (s) => {
			this.notify("/GET");
			onComplete(s);
		});
	}

	getOrderedBy(path, orderByChild, onComplete) {
		this.notify("GET");
		this.ref(path)
			.orderByChild(orderByChild)
			.once("value", (s) => {
				this.notify("/GET");
				onComplete(s);
			});
	}

	put(path, value, onComplete) {
		this.notify("PUT");
		this.ref(path).set(value).then((s) => {
			this.notify("/PUT");
			(onComplete || function () { })(s);
		});
	}
}


class GFirebaseStorage extends GObservable {

	constructor() {
		super();
	}

	ref(path) {
		return firebase.storage().ref(path);
	}

	getUrl(path, callback) {
		this.ref(path)
			.getDownloadURL()
			.then(callback)
	}

	upload(path, file, onComplete, onProgress, payload) {
		this.notify("UPLOAD");

		let task = this.ref(path).put(file);

		if (onProgress) {
			task.on(
				firebase.storage.TaskEvent.STATE_CHANGED,
				(snap) => {
					var p = snap.bytesTransferred /
						snap.totalBytes * 100;
					onProgress(p, payload);
				});
		}

		task.then((r) => {
			this.notify("/UPLOAD");
			(onComplete || function () { })(r);
		});

		return task;
	}

	delete(path, onComplete) {
		this.notify("DELETE");
		this.ref(path).delete().then((r) => {
			this.notify("/DELETE");
			(onComplete || function () { })(r);
		});
	}
}


class GFirebaseAuth {

	constructor() {
	}

	login(email, pass, success, error) {
		let auth = firebase.auth();

		try {
			auth.signInWithEmailAndPassword(email, pass)
				.then(success, error);

			auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
		} catch (exception) {
			error(exception);
		}
	}

	logout() {
		firebase.auth().signOut();
	}
}


/**
 * GObservable 1.0.0
 */

class GObservable {
	constructor() {
		this.observers = [];
	}

	addObserver(obs) {
		this.observers.push(obs);
	}

	notify(message) {
		this.observers.forEach((o) => o.notified(message));
	}
}
class KMListener {
    name = ""
    listenersByKey = {};
    nextKey = 0;
    firingDepth = 0;
    firingDepthMax = 10;

    constructor(name) {
        this.name = name;
    }

    addListener(listener, key = null) {
        if (!key)
            key = ++this.nextKey;
        else if (this.listenersByKey.hasOwnProperty(key))
            return false;
        this.listenersByKey[key] = listener;
        return key;
    }

    removeListener(key) {
        if (this.listenersByKey.hasOwnProperty(key)) {
            delete this.listenersByKey[key];
            return true;
        } else
            return false;
    }

    fireEvent(event) {
        this.firingDepth++;
        if (this.firingDepth > this.firingDepthMax) {
            console.log(`KMListener(${name}): Maximum firing depth reached: ${this.firingDepth}`)
            return;
        }

        for (let listener of this.listenersByKey.values()) {
            setTimeout(() => listener.handleEvent(event));
            listener.handleEvent(event);
        }
        this.firingDepth--;
    }
}
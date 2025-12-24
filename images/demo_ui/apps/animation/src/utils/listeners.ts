
function bindHandlers(obj: any) : void {
    let aThis = obj;
    while (obj = Reflect.getPrototypeOf(obj)) {
        let keys = Reflect.ownKeys(obj)
        keys.forEach((name: any) => {
            if (typeof(name) === 'string')
                if (name.substring(0, 6) === 'handle' && !aThis.hasOwnProperty(name)) {
                    if (typeof aThis[name] === 'function') {
                        aThis[name] = aThis[name].bind(aThis);
                        // console.log(name);
                    }
                }
        });
    }
}

export {bindHandlers}
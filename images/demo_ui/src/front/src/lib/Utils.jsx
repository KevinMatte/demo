
export default function extractProps(props, obj) {
    let newProps = {...props};
    for (let name of Object.keys(obj)) {
        obj[name] = newProps[name];
        delete newProps[name];
    }
    return newProps;
}

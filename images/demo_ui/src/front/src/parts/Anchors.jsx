import React from "react";

export const gitHubURL = "https://github.com";
export const gitProjectURL = gitHubURL + "/KevinMatte/demo";

export default function DemoAnchor(props) {
    let {path, title, label, startAt, children, ...anchorProps} = props;

    let subject = (<span>{title}{title ? ":" : ""}</span>);

    let childrenTitle = "";
    if (children && title)
        childrenTitle = (<span><b>{title}</b>: </span>)
    else if (label && title) {
        childrenTitle = (<span><b>{title}</b>: {label}</span>)
        label = " ";
    }

    if (!label && !children && path.startsWith('images/')) {
        label = path.substring('images/'.length);
        let proj = label.substring(0, label.indexOf('/'));
        let labelPath = label.substring(proj.length);
        if (labelPath[0] === '/')
            labelPath = labelPath.substring(1);
        label = (<span>{labelPath}</span>);
        subject = (<span>{title || proj}: </span>);
    }
    if (startAt && !label && !children)
        label = "..." + path.substring(path.indexOf(`/${startAt}/`));

    return (
        <span>
            &nbsp;{subject}
            <a href={gitProjectURL + "/blob/main/" + path}
               target="km_demo"
               {...anchorProps}
            >
                {childrenTitle}{children || label || path}
            </a>
        </span>
    );
}

export function GitHubAnchor(props) {
    let {path, title, label, children, ...anchorProps} = props;
    if (path[0] !== '/')
        path = "/" + path;
    if (!label && !children)
        label = path.substring(1);
    title = (<span><b>{title || "GitHub"}</b>: </span>)

    return (
        <span>
            &nbsp;
            <a href={gitHubURL + path}
               target="km_github"
               {...anchorProps}
            >
                {title} {children || label || path}
            </a>
        </span>
    );
}

export function Anchor(props) {
    let {path, title, label, children, ...anchorProps} = props;
    if (!label && !children)
        label = path.substring(1);
    if (title)
        title = (<span>{title}: </span>)

    return (
        <span>
            &nbsp;{title}
            <a href={path}
               target="km_github"
               {...anchorProps}
            >
                {children || label || path}
            </a>
        </span>
    );
}

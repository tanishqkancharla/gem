import React from "react";
import styled from "styled-components";
import {
	accentColor,
	articleItemMargin,
	bodyTextColor,
	shadowMd,
	tertiateBackgroundColor,
} from "../styles/vars";

const monospaceFont = `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
"Liberation Mono", "Courier New", monospace;`;

const Pre = styled.pre`
	background-color: ${tertiateBackgroundColor};
	color: ${bodyTextColor};

	margin-top: ${articleItemMargin};
	margin-bottom: ${articleItemMargin};

	border-style: solid;
	border-color: ${accentColor};
	border-radius: 0.25rem;
	border-width: 1.5px;

	font-family: ${monospaceFont};

	${shadowMd}

	line-height: 1.25rem;
	padding: 0.5rem;
	overflow-wrap: break-word;

	& .token.comment,
	.token.prolog,
	.token.doctype,
	.token.cdata {
		color: rgba(99, 99, 99, 1);
		font-style: italic;
	}

	& .token.namespace {
		opacity: 0.7;
	}

	& .token.punctuation,
	.token.operator {
		color: rgba(99, 99, 99, 1);
	}

	& .token.atrule,
	.token.keyword,
	.token.attr-name,
	.language-autohotkey .token.selector {
		color: ${accentColor};
	}

	& .token.string,
	.token.attr-value {
		color: #f76d74;
	}

	& .token.entity,
	.token.url,
	.token.symbol,
	.token.number,
	.token.boolean,
	.token.variable,
	.token.constant,
	.token.property,
	.token.regex,
	.token.inserted {
		color: #5aa9fa;
	}

	& .token.function,
	.token.deleted,
	.language-autohotkey .token.tag {
		color: #ffffff;
	}

	& .token.tag,
	.token.selector,
	.language-autohotkey .token.keyword {
		color: #2d9d78;
	}

	& .token.important,
	.token.bold {
		font-weight: bold;
	}

	& .token.italic {
		font-style: italic;
	}
`;

const Code = styled.code`
	white-space: pre-wrap;
`;

export function CodeBlock(props: { lang?: string; html: string }) {
	const { html, lang } = props;

	return (
		<Pre className={`lang-${lang}`}>
			<Code dangerouslySetInnerHTML={{ __html: html }}></Code>
		</Pre>
	);
}

export function NotHighlightedCodeBlock(props: {
	lang?: string;
	children: React.ReactNode;
}) {
	const { lang } = props;

	return (
		<Pre className={`lang-${lang}`}>
			<Code>{props.children}</Code>
		</Pre>
	);
}

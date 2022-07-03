import React from "react";
import styled from "styled-components";
import { RichTextContent } from "tk-parser/dist/blocks/richText";
import {
	accentColor,
	secondaryBackgroundColor,
	secondaryBodyTextColor,
	transitionDurationSm,
} from "../styles/vars";
import { P } from "./Paragraph";

export const Code = styled.code`
	border-radius: 0.125rem;
	display: inline-block;
	padding-left: 0.25rem;
	padding-right: 0.25rem;

	font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
		"Liberation Mono", "Courier New", monospace;
	font-size: 80%;
	line-height: 1.25rem;

	color: ${accentColor};
	background-color: ${secondaryBackgroundColor};

	overflow-wrap: break-word;
`;

export const A = styled.a`
	cursor: pointer;
	color: ${secondaryBodyTextColor};
	text-decoration: underline;
	transition-property: background-color, border-color, color, fill, stroke,
		opacity, box-shadow, transform;
	transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	transition-duration: ${transitionDurationSm};

	&:hover {
		color: ${accentColor};
	}
`;

export function RichTextParagraph(props: { children: RichTextContent }) {
	const content = props.children.map((token) => {
		switch (token.type) {
			case "bold":
				return <b key={token.content}>{token.content}</b>;
			case "italic":
				return <i key={token.content}>{token.content}</i>;
			case "code":
				return <Code key={token.content}>{token.content}</Code>;
			case "link":
				return (
					<A href={token.href} key={token.content}>
						{token.content}
					</A>
				);
			case "plain":
				return token.content;
		}
	});

	return <P>{content}</P>;
}

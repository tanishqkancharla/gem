import React from "react";
import styled from "styled-components";
import {
	accentColor,
	bodyTextColor,
	borderColor,
	transitionDurationSm,
} from "../styles/vars";
import { P } from "./Paragraph";

const BlockLinkA = styled.a`
	color: ${bodyTextColor};

	border-style: solid;
	border-color: ${borderColor};
	border-radius: 0.25rem;
	border-width: 2px;

	margin-top: 0.3rem;
	margin-bottom: 0.3rem;

	padding: 0.25rem;

	text-decoration: none;

	transition-property: background-color, border-color, color, fill, stroke,
		opacity, box-shadow, transform;
	transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	transition-duration: ${transitionDurationSm};

	width: -webkit-fit-content;
	width: -moz-fit-content;
	width: fit-content;

	& .title {
		margin: 0;
	}

	&:hover {
		color: ${accentColor};
		border-color: ${accentColor};
	}
`;

export function BlockLink(props: { content: string; url: string }) {
	const { content, url } = props;
	return (
		<P>
			<BlockLinkA href={url}>{content}</BlockLinkA>
		</P>
	);
}

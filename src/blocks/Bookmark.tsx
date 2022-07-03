import React from "react";
import styled from "styled-components";
import {
	accentColor,
	borderColor,
	fontSm,
	secondaryBodyTextColor,
	tertiaryBodyTextColor,
	transitionDurationSm,
} from "../styles/vars";
import { P } from "./Paragraph";

const BookmarkTitle = styled.h4`
	color: white;
	margin-top: 0px;
	margin-bottom: 0.5rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-weight: normal;
`;

const _Bookmark = styled.a`
	border-style: solid;
	border-color: ${borderColor};
	border-radius: 0.25rem;
	border-width: 2px;

	display: block;
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;
	padding: 0.5rem;
	text-decoration: none;

	transition-property: background-color, border-color, color, fill, stroke,
		opacity, box-shadow, transform;
	transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	transition-duration: ${transitionDurationSm};

	&:hover {
		border-color: ${accentColor};
	}

	&:focus {
		outline: 0;
		border-color: ${accentColor};
	}

	${P} {
		font-size: 85%;
		line-height: 1.25rem;

		color: ${secondaryBodyTextColor};
		text-overflow: ellipsis;
		overflow: hidden;
		display: -webkit-box !important;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		white-space: normal;
	}

	${P}:not(:last-of-type) {
		margin-bottom: 0.25rem;
	}

	.block-link-lg .favicon {
		margin-right: 0.5rem;
		position: relative;
		height: 1rem;
		width: 1rem;
		display: inline;
	}

	& :last-child {
		margin-bottom: 0px;
	}
`;

const BookmarkUrl = styled.div`
	color: ${tertiaryBodyTextColor};
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: ${fontSm};
	max-width: 80%;
`;

const Spacer = styled.div`
	flex: 1 1 auto;
`;

const _BookmarkHeader = styled.div`
	display: flex;
	flex-direction: row;
`;

const _BookmarkDate = styled.div`
	color: ${secondaryBodyTextColor};
	font-size: ${fontSm};
`;

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

function BookmarkDate(props: { date: Date }) {
	return <_BookmarkDate>{dateFormatter.format(props.date)}</_BookmarkDate>;
}

function BookmarkHeader(props: { title: string; date?: Date }) {
	return (
		<_BookmarkHeader>
			<BookmarkTitle>{props.title}</BookmarkTitle>
			{props.date && (
				<>
					<Spacer />
					<BookmarkDate date={props.date} />
				</>
			)}
		</_BookmarkHeader>
	);
}

export function Bookmark(props: {
	title: string;
	url: string;
	date?: Date;
	children: React.ReactElement | React.ReactElement[];
}) {
	return (
		<_Bookmark href={props.url}>
			<BookmarkHeader {...props} />
			{props.children}
			<BookmarkUrl>{props.url}</BookmarkUrl>
		</_Bookmark>
	);
}

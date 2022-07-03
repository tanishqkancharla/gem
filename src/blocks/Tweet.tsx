import React from "react";
import styled from "styled-components";

const _Tweet = styled.div`
	margin: auto;
	width: 100%;
	max-width: 420px;
`;

export function Tweet(props: { html: string }) {
	return <_Tweet dangerouslySetInnerHTML={{ __html: props.html }}></_Tweet>;
}

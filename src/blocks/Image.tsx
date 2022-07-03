import React from "react";
import styled from "styled-components";
import { fontSm, secondaryBodyTextColor } from "../styles/vars";

const Figure = styled.figure`
	margin: 0;
	margin-top: 1rem;
	margin-bottom: 1rem;

	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.3rem;

	& img {
		max-width: 100%;
	}
`;

const Figcaption = styled.figcaption`
	font-size: ${fontSm};
	color: ${secondaryBodyTextColor};
`;

export function Image(props: { url: string; caption?: string }) {
	return (
		<Figure>
			<img src={props.url} />
			<Figcaption>{props.caption}</Figcaption>
		</Figure>
	);
}

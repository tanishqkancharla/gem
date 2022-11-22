import { css } from "goober";
import { accentColor, articleItemMargin } from "../styles/vars";

export const blockquoteClass = css`
	margin: 0;
	margin-top: ${articleItemMargin};
	margin-bottom: ${articleItemMargin};
	border-style: solid;
	border-width: 0;
	border-color: ${accentColor};
	border-left-width: 3.5px;
	padding-left: 1rem;
`;

export const blockquoteSepClass = css`
	display: inline-block;
	font-size: 1.5rem;
	font-weight: 700;
	padding-right: 0.6rem;
`;

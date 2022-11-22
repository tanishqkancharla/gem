import { css } from "goober";
import { headingTextColor, secondaryHeadingTextColor } from "../styles/vars";

export const h1Class = css`
	font-weight: 600;
	font-size: 2.5rem;
	line-height: 3rem;
	margin-top: 1.5rem;
	margin-bottom: 0.5rem;
	text-decoration: underline;
	color: ${headingTextColor};
`;

export const h2Class = css`
	font-weight: 600;
	font-size: 1.375rem;
	line-height: 1.75rem;
	margin-top: 1rem;
	margin-bottom: 0.3rem;
	color: ${headingTextColor};
`;

export const h3Class = css`
	font-weight: 600;
	font-size: 1.125rem;
	margin-top: 1rem;
	margin-bottom: 0.3rem;
	line-height: 1.75rem;
	color: ${secondaryHeadingTextColor};
`;

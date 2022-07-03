import styled from "styled-components";
import { borderColor } from "../styles/vars";

export const Divider = styled.hr`
	border-color: ${borderColor};
	border-width: 0;
	border-top-width: 2.5px;
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;
	width: 100%;
	border-style: solid;
`;

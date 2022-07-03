import React, { useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { parseTK, TKDoc } from "tk-parser";
import { Block } from "./Block";
import { backgroundColor, bodyTextColor, borderColor } from "./styles/vars";

const StyledApp = styled.div`
	display: flex;
	flex-direction: row;
	gap: 10px;
	background-color: ${backgroundColor};
	margin: 0;
	width: 100vw;
	height: 100vh;
	padding: 30px;
`;

const StyledEditor = styled.div`
	width: 50%;
	border: 1.5px solid ${borderColor};
	border-radius: 3px;
	color: ${bodyTextColor};
	padding: 6px;

	:focus {
		outline: none;
	}
`;

export function App() {
	const [content, setContent] = useState("");

	const doc = useMemo(() => parseTK(content), [content]);

	const ref = useRef<HTMLDivElement>(null);

	return (
		<StyledApp>
			<StyledEditor
				ref={ref}
				contentEditable
				onKeyUp={(event) => {
					setContent(ref.current?.innerText || "");
				}}
			></StyledEditor>
			<Doc doc={doc} />
		</StyledApp>
	);
}
function Doc(props: { doc: TKDoc }) {
	return (
		<div style={{ width: "50%" }}>
			{props.doc.blocks.map((block, index) => (
				<Block key={index} block={block} />
			))}
		</div>
	);
}

import React from "react";
import { isString } from "remeda";
import { TKBlock } from "tk-parser";
import { NotHighlightedCodeBlock } from "./blocks/CodeBlock";
import { Divider } from "./blocks/Divider";
import { Image } from "./blocks/Image";
import { Li, Ul } from "./blocks/List";
import { RichTextParagraph } from "./blocks/RichText";
import { Toggle } from "./blocks/Toggle";

export function Block(props: { block: TKBlock }) {
	const block = props.block;

	switch (block.type) {
		case "codeBlock": {
			// return <CodeBlock {...block} />;
			return (
				<NotHighlightedCodeBlock lang={block.lang}>
					{block.content}
				</NotHighlightedCodeBlock>
			);
		}
		case "divider": {
			return <Divider />;
		}
		case "unorderedList": {
			return (
				<Ul>
					{block.listItems.map((listItemContent, index) => {
						if (isString(listItemContent)) {
							return <Li key={index}>{listItemContent}</Li>;
						} else {
							const [firstContent, indentedList] = listItemContent;
							return (
								<Li key={index}>
									{firstContent}
									<Block block={indentedList} />
								</Li>
							);
						}
					})}
				</Ul>
			);
		}
		case "newLine": {
			return null;
		}
		case "toggle": {
			return <Toggle {...block} />;
		}
		case "tweet": {
			// return <Tweet html={block.html} />;
			return <p>[tweet: {block.url}]</p>;
		}
		case "bookmark": {
			// return (
			// 	<Bookmark title={block.title} url={block.url}>
			// 		<P>{block.description}</P>
			// 	</Bookmark>
			// );
			return (
				<p>
					[<span style={{ color: "#7eb378" }}>bookmark</span>: {block.url}]
				</p>
			);
		}
		case "image": {
			return <Image {...block} />;
		}
		case "paragraph": {
			return <RichTextParagraph>{block.content}</RichTextParagraph>;
		}
		default: {
			throw new Error(`Unknown block: ${JSON.stringify(block, null, 2)}`);
		}
	}
}

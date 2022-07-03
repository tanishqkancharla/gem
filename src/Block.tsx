import React from "react";
import { isString } from "remeda";
import { TKBlock } from "tk-parser";
import { BlockLink } from "./blocks/BlockLink";
import { Blockquote } from "./blocks/Blockquote";
import { Divider } from "./blocks/Divider";
import { H1, H2, H3 } from "./blocks/Heading";
import { Image } from "./blocks/Image";
import { Li, Ul } from "./blocks/List";
import { RichTextParagraph } from "./blocks/RichText";
import { Toggle } from "./blocks/Toggle";

export function Block(props: { block: TKBlock }) {
	const block = props.block;

	switch (block.type) {
		case "codeBlock": {
			// return <CodeBlock {...block} />;
			return <p>{block.content}</p>;
		}
		case "divider": {
			return <Divider />;
		}
		case "h1": {
			return <H1>{block.content}</H1>;
		}
		case "h2": {
			return <H2>{block.content}</H2>;
		}
		case "h3": {
			return <H3>{block.content}</H3>;
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
		case "blockLink": {
			return <BlockLink content={block.content} url={block.href} />;
		}
		case "toggle": {
			return <Toggle {...block} />;
		}
		case "tweet": {
			// return <Tweet html={block.html} />;
			return <p>{block.url}</p>;
		}
		case "bookmark": {
			// return (
			// 	<Bookmark title={block.title} url={block.url}>
			// 		<P>{block.description}</P>
			// 	</Bookmark>
			// );
			return <p>{block.url}</p>;
		}
		case "blockquote": {
			const content = block.content.map((richTextTokens, index) => (
				<RichTextParagraph key={index}>{richTextTokens}</RichTextParagraph>
			));

			return <Blockquote content={content} />;
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

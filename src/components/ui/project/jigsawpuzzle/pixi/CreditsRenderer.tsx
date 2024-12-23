import {
	Container, Graphics, Sprite, Text,
} from '@pixi/react';
import { TextStyle } from 'pixi.js';

interface GenericCreditNode {
	type: string;
}

interface ContainerNode extends GenericCreditNode {
	type: 'container';
	x?: number;
	y?: number;
	children: CreditNode[];
}

interface TextNode extends GenericCreditNode {
	type: 'text';
	text: string;
	fontWeight?: string;
	fontSize?: number;
	fill?: string;
	x: number;
	y: number;
	url?: string;
}

interface PersonNode extends GenericCreditNode {
	type: 'person';
	x: number;
	avatar: string;
	name: string;
	nameX?: number;
	socials?: {
		x: number;
		icon: string;
		url: string;
	}[];
}

interface LineNode extends GenericCreditNode {
	type: 'line';
	x: number;
	y: number;
	startX: number;
	endX: number;
}

export type CreditNode = ContainerNode | TextNode | PersonNode | LineNode;

// eslint-disable-next-line max-len
export default function CreditsRenderer({ nodes, textColor, linkColor }: { nodes: CreditNode[], textColor: number, linkColor: number }) {
	return nodes.map((node) => {
		switch (node.type) {
			case 'container': {
				return (
					<Container
						x={node.x}
						y={node.y}
					>
						<CreditsRenderer
							nodes={node.children}
							textColor={textColor}
							linkColor={linkColor}
						/>
					</Container>
				);
			}
			case 'text': {
				const textStyle: any = { fill: textColor };

				if (node.fontSize) textStyle.fontSize = node.fontSize;
				if (node.fontWeight) textStyle.fontWeight = node.fontWeight;

				return (
					<Text
						text={node.text}
						style={textStyle as TextStyle}
						x={node.x}
						y={node.y}
						anchor={[0.5, 0]}
						scale={[1, 1]}
						eventMode={node.url ? 'static' : undefined}
						cursor={node.url && 'pointer'}
						onpointertap={node.url ? () => window.open(node.url, '_blank', 'noopener') : undefined}
					/>
				);
			}
			case 'line': {
				return (
					<Graphics
						x={node.x}
						y={node.y}
						anchor={[0.5, 0]}
						draw={(g) => {
							g.clear();
							g.lineStyle(2, textColor, 0.8);
							g.moveTo(node.startX, 0);
							g.lineTo(node.endX, 0);
						}}
					/>
				);
			}
			case 'person': {
				return (
					<Container
						x={node.x}
						y={0}
					>
						<Sprite
							image={node.avatar}
							width={128}
							height={128}
						/>
						<Text
							text={node.name}
							style={{
								fill: textColor,
								fontWeight: 'bold',
								fontSize: 16,
							} as TextStyle}
							x={node.nameX ?? 52}
							y={140}
							anchor={[0.5, 0]}
							scale={[1, 1]}
						/>
						{node.socials && node.socials.map((social) => (
							<Sprite
								key={social.url}
								image={social.icon}
								tint={textColor}
								width={18}
								height={18}
								y={140}
								x={social.x}
								eventMode="static"
								cursor="pointer"
								onpointertap={() => window.open(social.url, '_blank', 'noopener')}
							/>
						))}
					</Container>
				);
			}
			default:
				return null;
		}
	});
}

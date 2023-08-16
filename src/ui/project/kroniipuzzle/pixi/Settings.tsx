'use client';

import React from 'react';
import {
	Container, Graphics, Sprite, Text, useApp,
} from '@pixi/react';
import { Graphics as PixiGraphics, TextStyle } from 'pixi.js';
import TaggedText from './TaggedText';
import Button from './Button';
import Scrollbox from './Scrollbox';

const AboutText = 'Lorem ipsum';

interface SettingsModalProps {
	x: number;
	y: number;
	width: number;
	height: number;
	setShowSettingsModal: (val: boolean) => void;
}

export default function SettingsModal({
	x, y, width, height, setShowSettingsModal,
}: SettingsModalProps) {
	const app = useApp();

	return (
		<Container
			x={x}
			y={y}
		>
			<Graphics
				draw={(g: PixiGraphics) => {
					g.clear();
					g.beginFill(0x000000);
					g.drawRect(0, 0, width, height);
					g.endFill();
				}}
			/>
			<Container x={width / 2} y={height / 2} anchor={[0.5, 0.5]}>
				<Container
					x={-732}
					y={-432}
				>
					<Graphics
						draw={(g) => {
							g.clear();
							g.beginFill(0xBDD1EC);
							g.drawRoundedRect(0, 0, 700, 400, 8);
							g.endFill();
						}}
					/>
					<Text
						text="About"
						style={{
							fontWeight: 'bold',
							fontSize: 24,
						} as TextStyle}
						x={350}
						y={32}
						anchor={[0.5, 0]}
					/>
					<TaggedText
						text={AboutText}
						styles={{
							default: {
								fill: 'black',
								fontSize: 20,
								wordWrap: true,
								wordWrapWidth: 636,
							},
							b: {
								fontWeight: 'bold',
							},
							i: {
								fontStyle: 'italic',
							},
							h: {
								fontSize: 24,
							},
						}}
						x={32}
						y={64}
						width={636}
						height={304}
						scale={{ x: 1, y: 1 }}
					/>
				</Container>
				<Container
					x={-732}
					y={32}
				>
					<Graphics
						draw={(g) => {
							g.clear();
							g.beginFill(0xBDD1EC);
							g.drawRoundedRect(0, 0, 700, 400, 8);
							g.endFill();
						}}
					/>
					<Text
						text="Settings"
						style={{
							fontWeight: 'bold',
							fontSize: 24,
						} as TextStyle}
						x={350}
						y={32}
						anchor={[0.5, 0]}
					/>
					<Button
						x={275}
						y={96}
						width={150}
						height={60}
						radius={12}
						color={0xAA2222}
						label="Reset puzzle"
						onClick={() => {
							// TODO
						}}
					/>
					<Button
						x={225}
						y={188}
						width={250}
						height={60}
						radius={12}
						color={0xAA2222}
						label="Cheat (Complete puzzle)"
						onClick={() => {
							// TODO
						}}
					/>
				</Container>
				<Container
					x={32}
					y={-432}
				>
					<Graphics
						draw={(g) => {
							g.clear();
							g.beginFill(0xBDD1EC);
							g.drawRoundedRect(0, 0, 700, 864, 8);
							g.endFill();
						}}
						x={0}
						y={0}
					/>
					<Scrollbox
						boxWidth={700}
						boxHeight={864}
						app={app}
						overflowY="scroll"
						stopPropagation
					>
						<Text
							text="Credits"
							style={{
								fontWeight: 'bold',
								fontSize: 36,
							} as TextStyle}
							x={350}
							y={32}
							anchor={[0.5, 0]}
							scale={[1, 1]}
						/>
						<Container
							y={96}
						>
							<Text
								text="Organizers:"
								style={{
									fontWeight: 'bold',
									fontSize: 20,
								} as TextStyle}
								x={350}
								y={0}
								anchor={[0.5, 0]}
								scale={[1, 1]}
							/>
							<Container
								y={32}
								x={350}
								anchor={[0.5, 0]}
								scale={[1, 1]}
							>
								<Container
									x={-224}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Empikuro"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
								<Container
									x={-64}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="helicobtor"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
								<Container
									x={96}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Zaめ"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
							</Container>
						</Container>

						<Container
							y={320}
						>
							<Text
								text="Programmers:"
								style={{
									fontWeight: 'bold',
									fontSize: 20,
								} as TextStyle}
								x={350}
								y={0}
								anchor={[0.5, 0]}
								scale={[1, 1]}
							/>
							<Container
								y={32}
								x={350}
								anchor={[0.5, 0]}
								scale={[1, 1]}
							>
								<Container
									x={-144}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="george"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
								<Container
									x={16}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="GoldElysium"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
							</Container>
						</Container>

						<Container
							y={544}
						>
							<Text
								text="Assistants:"
								style={{
									fontWeight: 'bold',
									fontSize: 20,
								} as TextStyle}
								x={350}
								y={0}
								anchor={[0.5, 0]}
								scale={[1, 1]}
							/>
							<Container
								y={32}
								x={350}
								anchor={[0.5, 0]}
								scale={[1, 1]}
							>
								<Container
									x={-304}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Agiri"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
								<Container
									x={-144}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Ant"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
								<Container
									x={16}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Freyja"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
								<Container
									x={176}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Hassan"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
							</Container>
							<Container
								y={224}
								x={350}
								anchor={[0.5, 0]}
								scale={[1, 1]}
							>
								<Container
									x={-224}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="kler.yy"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
								<Container
									x={-64}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Lucy"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
								<Container
									x={96}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="patatas"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
							</Container>
						</Container>

						<Container
							y={976}
						>
							<Text
								text="Artists:"
								style={{
									fontWeight: 'bold',
									fontSize: 20,
								} as TextStyle}
								x={350}
								y={0}
								anchor={[0.5, 0]}
								scale={[1, 1]}
							/>
							<Container
								y={32}
								x={350}
								anchor={[0.5, 0]}
								scale={[1, 1]}
							>
								<Container
									x={-304}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Adarin"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
								<Container
									x={-144}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Bacon Strips"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
								<Container
									x={16}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="メガネ Crow"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
								<Container
									x={176}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Empikuro"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
							</Container>
							<Container
								y={224}
								x={350}
								anchor={[0.5, 0]}
								scale={[1, 1]}
							>
								<Container
									x={-304}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Erasor"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
								<Container
									x={-144}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="eus_ing"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
								<Container
									x={16}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Fongban"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
								<Container
									x={176}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="GULS"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
							</Container>
							<Container
								y={420}
								x={350}
								anchor={[0.5, 0]}
								scale={[1, 1]}
							>
								<Container
									x={-304}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Mameng"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
								<Container
									x={-144}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Oddnumber"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
								<Container
									x={16}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="ONAiR"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
								<Container
									x={176}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Parkoach"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
							</Container>
							<Container
								y={616}
								x={350}
								anchor={[0.5, 0]}
								scale={[1, 1]}
							>
								<Container
									x={-304}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="TAKA"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
								<Container
									x={-144}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Underdatv"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
								<Container
									x={16}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Vyragami"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
								<Container
									x={176}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Zenya"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
							</Container>
						</Container>

						<Container
							y={1792}
						>
							<Text
								text="Audio:"
								style={{
									fontWeight: 'bold',
									fontSize: 20,
								} as TextStyle}
								x={350}
								y={0}
								anchor={[0.5, 0]}
								scale={[1, 1]}
							/>
							<Container
								y={32}
								x={350}
								anchor={[0.5, 0]}
								scale={[1, 1]}
							>
								<Container
									x={-64}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="J.Kim"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
							</Container>
						</Container>

						<Container
							y={2016}
						>
							<Text
								text="Animations:"
								style={{
									fontWeight: 'bold',
									fontSize: 20,
								} as TextStyle}
								x={350}
								y={0}
								anchor={[0.5, 0]}
								scale={[1, 1]}
							/>
							<Container
								y={32}
								x={350}
								anchor={[0.5, 0]}
								scale={[1, 1]}
							>
								<Container
									x={-64}
									y={0}
								>
									<Sprite
										image="https://cdn.holoen.fans/hefw/media/400.webp"
										width={128}
										height={128}
									/>
									<Text
										text="끌나(rjseka7758)"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={64}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
								</Container>
							</Container>
						</Container>

						<Graphics
							y={2300}
							draw={(g) => {
								g.beginFill(0);
								g.drawRect(0, 0, 0, 0);
								g.endFill();
							}}
						/>
					</Scrollbox>
				</Container>
			</Container>
			<Container
				x={width - 64}
				y={32}
				eventMode="static"
				onclick={() => setShowSettingsModal(false)}
				cursor="pointer"
			>
				<Graphics
					draw={(g) => {
						g.clear();
						g.beginFill(0xBDD1EC);
						g.drawCircle(16, 16, 20);
						g.endFill();
					}}
				/>
				<Sprite
					image="/assets/kroniipuzzle/x-mark.svg"
					tint={0x000000}
					width={32}
					height={32}
				/>
			</Container>
		</Container>
	);
}

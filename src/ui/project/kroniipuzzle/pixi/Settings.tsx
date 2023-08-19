'use client';

import React, { useState } from 'react';
import {
	Container, Graphics, Sprite, Text, useApp,
} from '@pixi/react';
import { Graphics as PixiGraphics, TextStyle } from 'pixi.js';
import TaggedText from './TaggedText';
import Button from './Button';
import Scrollbox from './Scrollbox';
import usePuzzleStore from '../puzzle/PuzzleStore';
import { COL_COUNT, ROW_COUNT } from '../puzzle/PuzzleConfig';

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
	const [message, setMessage] = useState<string | null>(null);

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
							const puzzleState = usePuzzleStore.getState();
							puzzleState.reset();
							setMessage('Puzzle has been reset!');
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
							const puzzleState = usePuzzleStore.getState();

							usePuzzleStore.setState(() => {
								const pieceGroups: typeof puzzleState.pieceGroups = {};

								// eslint-disable-next-line no-restricted-syntax
								for (const key of Object.keys(puzzleState.pieceGroups)) {
									pieceGroups[key] = {
										...puzzleState.pieceGroups[key],
										position: puzzleState.pieceGroups[key].targetPosition,
										correct: true,
									};
								}

								return {
									pieceGroups,
									correctCount: ROW_COUNT * COL_COUNT,
								};
							});

							setMessage('Auto finished the puzzle.');
						}}
					/>
					{message && (
						<Text
							text={message}
							style={{
								fontSize: 20,
							} as TextStyle}
							x={350}
							y={262}
							anchor={[0.5, 0]}
						/>
					)}
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
								fontSize: 40,
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
									fontSize: 22,
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
										image="/assets/kroniipuzzle/avatars/empikuro.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Empikuro"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={52}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={96}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/EmpiKuro', '_blank', 'noopener')}
									/>
								</Container>
								<Container
									x={-64}
									y={0}
								>
									<Sprite
										image="/assets/kroniipuzzle/avatars/helicobtor.webp"
										width={128}
										height={128}
									/>
									<Text
										text="helicobtor"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={52}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={98}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/helicobtor', '_blank', 'noopener')}
									/>
								</Container>
								<Container
									x={96}
									y={0}
								>
									<Sprite
										image="/assets/kroniipuzzle/avatars/zame.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Zaめ"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={58}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={80}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/Ztynz1', '_blank', 'noopener')}
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
									fontSize: 23,
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
										image="/assets/kroniipuzzle/avatars/george.webp"
										width={128}
										height={128}
									/>
									<Text
										text="george"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={56}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={90}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/j1george_', '_blank', 'noopener')}
									/>
								</Container>
								<Container
									x={16}
									y={0}
								>
									<Sprite
										image="/assets/kroniipuzzle/avatars/GoldElysium.webp"
										width={128}
										height={128}
									/>
									<Text
										text="GoldElysium"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={54}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/github.svg"
										width={18}
										height={18}
										y={140}
										x={108}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://github.com/GoldElysium', '_blank', 'noopener')}
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
									fontSize: 23,
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
										image="/assets/kroniipuzzle/avatars/Agiri.webp"
										width={128}
										height={128}
									/>
									<Text
										text="『あぎり』"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={52}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={92}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/Akahito_San', '_blank', 'noopener')}
									/>
								</Container>
								<Container
									x={-144}
									y={0}
								>
									<Sprite
										image="/assets/kroniipuzzle/avatars/Ant.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Ant"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={56}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={80}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/Antzk_3', '_blank', 'noopener')}
									/>
								</Container>
								<Container
									x={16}
									y={0}
								>
									<Sprite
										image="/assets/kroniipuzzle/avatars/freyja.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Freyja"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={56}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={86}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/FreyjaBK', '_blank', 'noopener')}
									/>
								</Container>
								<Container
									x={176}
									y={0}
								>
									<Sprite
										image="/assets/kroniipuzzle/avatars/hasaan.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Hasaan"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={52}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={86}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/HasaanMohammed', '_blank', 'noopener')}
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
										image="/assets/kroniipuzzle/avatars/kler.webp"
										width={128}
										height={128}
									/>
									<Text
										text="kler.yy"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={52}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={86}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/Kurea_yy', '_blank', 'noopener')}
									/>
								</Container>
								<Container
									x={-144}
									y={0}
								>
									<Sprite
										image="/assets/kroniipuzzle/avatars/Kyono.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Kyono"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={52}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={86}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/KyoKMonnoK', '_blank', 'noopener')}
									/>
								</Container>
								<Container
									x={16}
									y={0}
								>
									<Sprite
										image="/assets/kroniipuzzle/avatars/Lucy.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Lucy"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={56}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={82}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/SirLuciMx', '_blank', 'noopener')}
									/>
								</Container>
								<Container
									x={176}
									y={0}
								>
									<Sprite
										image="/assets/kroniipuzzle/avatars/patatas.webp"
										width={128}
										height={128}
									/>
									<Text
										text="patatas"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={54}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={88}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/adklelele', '_blank', 'noopener')}
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
									fontSize: 22,
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
										image="/assets/kroniipuzzle/avatars/Adarin.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Adarin"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={52}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={86}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/AdarinSinner', '_blank', 'noopener')}
									/>
								</Container>
								<Container
									x={-144}
									y={0}
								>
									<Sprite
										image="/assets/kroniipuzzle/avatars/bacon.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Bacon Strips MA"
										style={{
											fontWeight: 'bold',
											fontSize: 12,
										} as TextStyle}
										x={52}
										y={142}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={106}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/Bacon_Strips_MA', '_blank', 'noopener')}
									/>
								</Container>
								<Container
									x={16}
									y={0}
								>
									<Sprite
										image="/assets/kroniipuzzle/avatars/crow.webp"
										width={128}
										height={128}
									/>
									<Text
										text="メガネ Crow"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={52}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={106}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/foureyed_crow', '_blank', 'noopener')}
									/>
								</Container>
								<Container
									x={176}
									y={0}
								>
									<Sprite
										image="/assets/kroniipuzzle/avatars/empikuro.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Empikuro"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={52}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={96}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/EmpiKuro', '_blank', 'noopener')}
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
										image="/assets/kroniipuzzle/avatars/era.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Erasopepero"
										style={{
											fontWeight: 'bold',
											fontSize: 14,
										} as TextStyle}
										x={52}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={100}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/erasopepero232', '_blank', 'noopener')}
									/>
								</Container>
								<Container
									x={-144}
									y={0}
								>
									<Sprite
										image="/assets/kroniipuzzle/avatars/eus.webp"
										width={128}
										height={128}
									/>
									<Text
										text="eus_ing"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={52}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={90}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/eus_ing', '_blank', 'noopener')}
									/>
								</Container>
								<Container
									x={16}
									y={0}
								>
									<Sprite
										image="/assets/kroniipuzzle/avatars/Fongban.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Fongban"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={52}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={90}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/Fongban_illust', '_blank', 'noopener')}
									/>
								</Container>
								<Container
									x={176}
									y={0}
								>
									<Sprite
										image="/assets/kroniipuzzle/avatars/GULS.webp"
										width={128}
										height={128}
									/>
									<Text
										text="GULS"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={52}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={90}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/UM_mk_2', '_blank', 'noopener')}
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
										image="/assets/kroniipuzzle/avatars/mameng.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Mameng"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={52}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={90}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/brmameng', '_blank', 'noopener')}
									/>
								</Container>
								<Container
									x={-144}
									y={0}
								>
									<Sprite
										image="/assets/kroniipuzzle/avatars/oddnumber.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Oddnumber"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={52}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={104}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/oddnumberr_', '_blank', 'noopener')}
									/>
								</Container>
								<Container
									x={16}
									y={0}
								>
									<Sprite
										image="/assets/kroniipuzzle/avatars/onair.webp"
										width={128}
										height={128}
									/>
									<Text
										text="ONAiR"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={52}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={86}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/onairr27', '_blank', 'noopener')}
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
										x={52}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={96}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/qkrdydzl', '_blank', 'noopener')}
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
										image="/assets/kroniipuzzle/avatars/taka.webp"
										width={128}
										height={128}
									/>
									<Text
										text="TAKA"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={52}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={84}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/TokiameTaka', '_blank', 'noopener')}
									/>
								</Container>
								<Container
									x={-144}
									y={0}
								>
									<Sprite
										image="/assets/kroniipuzzle/avatars/underdatv.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Underdatv"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={52}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={96}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/underdatv', '_blank', 'noopener')}
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
										x={52}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={96}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/vyragami', '_blank', 'noopener')}
									/>
								</Container>
								<Container
									x={176}
									y={0}
								>
									<Sprite
										image="/assets/kroniipuzzle/avatars/zenya.webp"
										width={128}
										height={128}
									/>
									<Text
										text="Zenya"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={52}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={82}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/Zenya_3d', '_blank', 'noopener')}
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
									fontSize: 22,
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
										x={52}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={82}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/jkimsketches', '_blank', 'noopener')}
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
									fontSize: 22,
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
										image="/assets/kroniipuzzle/avatars/rjseka.webp"
										width={128}
										height={128}
									/>
									<Text
										text="끌나(rjseka7758)"
										style={{
											fontWeight: 'bold',
											fontSize: 16,
										} as TextStyle}
										x={50}
										y={140}
										anchor={[0.5, 0]}
										scale={[1, 1]}
									/>
									<Sprite
										image="/assets/kroniipuzzle/twitter.svg"
										width={18}
										height={18}
										y={140}
										x={120}
										eventMode="static"
										cursor="pointer"
										onpointertap={() => window.open('https://twitter.com/rjseka7758', '_blank', 'noopener')}
									/>
								</Container>
							</Container>
						</Container>

						<Text
							y={2250}
							x={350}
							anchor={[0.5, 0]}
							scale={[1, 1]}
							text="And special thanks to all the Kronies!"
							style={{
								fontWeight: 'bold',
								fontSize: 24,
							} as TextStyle}
						/>

						<Text
							y={2340}
							x={350}
							anchor={[0.5, 0]}
							scale={[1, 1]}
							text="Organized by:"
							style={{
								fontWeight: 'bold',
								fontSize: 22,
							} as TextStyle}
						/>
						<Graphics
							y={2395}
							x={350}
							anchor={[0.5, 0]}
							draw={(g) => {
								g.clear();
								g.lineStyle(2, 0x001E47, 0.8);
								g.moveTo(-88, 0);
								g.lineTo(88, 0);
							}}
						/>
						<Text
							y={2376}
							x={350}
							anchor={[0.5, 0]}
							scale={[1, 1]}
							text="Kronii's Clock Tower"
							style={{
								fontWeight: 'bold',
								fontSize: 18,
								fill: '#001E47',
							} as TextStyle}
							eventMode="static"
							cursor="pointer"
							onpointertap={() => window.open('https://twitter.com/Kronii_KCT', '_blank', 'noopener')}
						/>
						<Graphics
							y={2423}
							x={350}
							anchor={[0.5, 0]}
							draw={(g) => {
								g.clear();
								g.lineStyle(2, 0x001E47, 0.8);
								g.moveTo(-80, 0);
								g.lineTo(80, 0);
							}}
						/>
						<Text
							y={2404}
							x={350}
							anchor={[0.5, 0]}
							scale={[1, 1]}
							text="Kronii's Time Vault"
							style={{
								fontWeight: 'bold',
								fontSize: 18,
								fill: '#001E47',
							} as TextStyle}
							eventMode="static"
							cursor="pointer"
							onpointertap={() => window.open('https://twitter.com/KroniiTimeVault', '_blank', 'noopener')}
						/>

						<Graphics
							y={2600}
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

import { Sprite as PixiSprite } from 'pixi.js';
import Message from './Message';

type PieceInfo = {
	id: string;
	sprite: PixiSprite;
	message?: Message;
};

export default PieceInfo;

import { Sprite as PixiSprite } from 'pixi.js';
import Message from './Message';

type PieceInfo = {
	sprite: PixiSprite;
	message?: Message;
};

export default PieceInfo;

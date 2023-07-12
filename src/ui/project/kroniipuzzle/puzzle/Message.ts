import { Texture } from 'pixi.js';

type Message = {
	from: string;
	congratulations?: string;
	favoriteMoment?: string;
	isRead: boolean;
	kronie?: Texture;
};

export default Message;

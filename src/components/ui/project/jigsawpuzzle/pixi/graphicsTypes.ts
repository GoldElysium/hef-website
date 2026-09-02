import { Graphics } from '@pixi/react';
import type { ComponentProps } from 'react';

export type GraphicsDraw = NonNullable<ComponentProps<typeof Graphics>['draw']>;

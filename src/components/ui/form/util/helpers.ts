/* eslint-disable max-len */
/* Based on components provided by @tripetto/runner-fabric and @tripetto/runner-classic */
/*
Copyright 2019 Tripetto B.V.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/*
MIT License

Copyright (c) 2021 GoldElysium

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */
/* eslint-enable */

import { FocusEvent, MutableRefObject } from 'react';

export const setReturnValue = <T>(setValue: (value: T) => void, value: T | void) => {
	if (typeof value !== 'undefined') {
		setValue(value);
	}
};

// eslint-disable-next-line max-len
export const handleEvent =	<T>(setValue: (value: T) => void, event?: (e: FocusEvent) => T | void) => (e: FocusEvent) => {
	if (event) {
		setReturnValue(setValue, event(e));
	}
};

// eslint-disable-next-line max-len
export const handleFocus = <T>(setFocus: (focus: boolean) => void, setValue: (value: T) => void, event?: ((e: FocusEvent) => (string | void)) | undefined) => (e: FocusEvent) => {
	setFocus(true);

	if (event) {
		// @ts-ignore
		setReturnValue(setValue, event(e));
	}
};

// eslint-disable-next-line max-len
export const handleBlur = <T>(setFocus: (focus: boolean) => void, setValue: (value: T) => void, event?: ((e: FocusEvent) => (string | void)) | undefined) => (e: FocusEvent) => {
	setFocus(false);

	if (event) {
		// @ts-ignore
		setReturnValue(setValue, event(e));
	}
};

export const handleAutoSubmit = (
	autoSubmitRef: MutableRefObject<{
		id: number;
		cb?: () => void;
	}>,
) => {
	// eslint-disable-next-line max-len,no-param-reassign
	autoSubmitRef.current.id = setTimeout(() => autoSubmitRef.current.cb && autoSubmitRef.current.cb(), 200) as unknown as number;
};

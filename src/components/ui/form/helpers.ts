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

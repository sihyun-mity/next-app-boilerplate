import { KeyboardEvent } from 'react';

export const isEnter = (e: KeyboardEvent) => e.key === 'Enter' && !e.nativeEvent.isComposing && !e.shiftKey;

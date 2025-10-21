/* eslint-disable @typescript-eslint/ban-ts-comment */
import '@testing-library/jest-dom';
// @ts-ignore
import { fetch as fetchPolyfill } from 'whatwg-fetch';
import { TextDecoder, TextEncoder } from 'util';
import { TransformStream } from 'node:stream/web';
import { BroadcastChannel } from 'node:worker_threads';

if (!globalThis.fetch) {
  // @ts-ignore
  globalThis.fetch = fetchPolyfill;
}

if (!globalThis.TransformStream) {
  // @ts-ignore
  globalThis.TransformStream = TransformStream;
}

if (!globalThis.TextEncoder) {
  // @ts-ignore
  globalThis.TextEncoder = TextEncoder;
}

if (!globalThis.TextDecoder) {
  // @ts-ignore
  globalThis.TextDecoder = TextDecoder;
}

if (!globalThis.BroadcastChannel) {
  // @ts-ignore
  globalThis.BroadcastChannel = BroadcastChannel;
}

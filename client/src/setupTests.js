import { TextEncoder, TextDecoder } from "node:util";
import "@testing-library/jest-dom";

// jsdom omits these Web APIs; react-router expects them at import time.
globalThis.TextEncoder ??= TextEncoder;
globalThis.TextDecoder ??= TextDecoder;

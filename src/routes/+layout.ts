import { Buffer } from 'buffer'
if (!('Buffer' in globalThis)) {
	globalThis.Buffer = Buffer
}

export const prerender = true

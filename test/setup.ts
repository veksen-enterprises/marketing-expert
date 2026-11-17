// The page tools send requests with node:http (src/lib/netguard.ts httpTransport). Many tests drive them by stubbing
// the global fetch with vi.stubGlobal; while fetch is stubbed, send the requests to the stub instead. Otherwise the
// real transport runs, so tests against local servers exercise it.
import { httpTransport, setTransport } from "../src/lib/netguard.js";

const realFetch = globalThis.fetch;
setTransport((url, init, addrs) =>
  globalThis.fetch !== realFetch ? (globalThis.fetch(url, init as RequestInit) as ReturnType<typeof httpTransport>) : httpTransport(url, init, addrs)
);

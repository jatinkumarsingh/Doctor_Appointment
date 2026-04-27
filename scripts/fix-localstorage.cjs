// Some environments inject an incomplete global localStorage in Node.
// Next's server/runtime checks can crash if getItem is missing.
if (
  typeof globalThis.localStorage !== "undefined" &&
  typeof globalThis.localStorage?.getItem !== "function"
) {
  try {
    delete globalThis.localStorage;
  } catch {
    globalThis.localStorage = undefined;
  }
}
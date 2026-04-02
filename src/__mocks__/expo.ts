// Minimal mock for expo — satisfies jest-expo preset requirements in Node test environment

class EventEmitter {
  addListener = jest.fn();
  removeListener = jest.fn();
  removeAllListeners = jest.fn();
  emit = jest.fn();
}

const expo = {
  EventEmitter,
  modules: {},
  uuidv4: () => "test-uuid",
  uuidv5: () => "test-uuid",
};

// jest-expo setup reads globalThis.expo
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).expo = expo;

export default expo;
export { EventEmitter };

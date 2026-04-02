// Minimal mock for expo-modules-core — used in Jest Node environment
export const NativeModulesProxy = {};
export const EventEmitter = class {
  addListener = jest.fn();
  removeListener = jest.fn();
  emit = jest.fn();
};
export const NativeModule = class {};
export const SharedObject = class {};
export default {};

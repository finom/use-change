"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlistenChange = exports.listenChange = exports.useSet = exports.useValue = exports.Provider = exports.Context = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
const react_1 = require("react");
exports.Context = react_1.createContext({
    __ERROR__: new Error('The component is not wrapped by provider'),
});
exports.Provider = exports.Context.Provider;
const changeMap = new WeakMap();
function listenChange(givenObject, key, handler) {
    var _a, _b;
    const all = (_a = changeMap.get(givenObject)) !== null && _a !== void 0 ? _a : {};
    if (!((_b = Object.getOwnPropertyDescriptor(givenObject, key)) === null || _b === void 0 ? void 0 : _b.get)) {
        const sym = Symbol.for(key);
        const object = givenObject;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        object[sym] = object[key];
        Object.defineProperty(object, key, {
            configurable: false,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            get: () => object[sym],
            set: (v) => {
                var _a;
                if (object[sym] !== v) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    object[sym] = v;
                    (_a = all[key]) === null || _a === void 0 ? void 0 : _a.forEach((h) => { h(v); });
                }
            },
        });
    }
    changeMap.set(givenObject, all);
    const handlers = all[key] || [];
    all[key] = handlers;
    if (!handlers.includes(handler)) {
        handlers.push(handler);
    }
    return () => {
        all[key] = handlers.filter((h) => h !== handler);
    };
}
exports.listenChange = listenChange;
function unlistenChange(object, key, handler) {
    const all = changeMap.get(object);
    if (!all)
        return;
    const handlers = all[key];
    if (!handlers)
        return;
    all[key] = handlers.filter((h) => h !== handler);
}
exports.unlistenChange = unlistenChange;
const parseArgs = (storeSlice, givenKey) => {
    const store = react_1.useContext(exports.Context);
    let slice;
    let key;
    if (!givenKey) {
        slice = store;
        // eslint-disable-next-line no-param-reassign
        key = storeSlice;
    }
    else if (typeof storeSlice === 'object') {
        slice = storeSlice;
        key = givenKey;
    }
    else if (typeof storeSlice === 'function') {
        slice = storeSlice(store);
        key = givenKey;
    }
    else {
        throw new Error('Unknown store slice');
    }
    return { slice, key };
};
function useChange(storeSlice, givenKey) {
    const { slice, key } = parseArgs(storeSlice, givenKey);
    const [stateValue, setStateValue] = react_1.useState(slice[key]);
    const setValue = react_1.useCallback(
    // eslint-disable-next-line no-param-reassign
    (value) => {
        if (typeof value === 'function') {
            const valueFunction = value;
            slice[key] = valueFunction(slice[key]);
        }
        else {
            slice[key] = value;
        }
    }, [slice, key]);
    react_1.useEffect(() => {
        const handler = () => {
            setStateValue(slice[key]);
        };
        if (slice[key] !== stateValue) {
            handler();
        }
        const unlisten = listenChange(slice, key, handler);
        return () => { unlisten(); };
    }, [key, slice, stateValue]);
    return [stateValue, setValue];
}
function useValue(storeSlice, givenKey) {
    // "any" is a temporary solution because ovwerloads aren't compatible for some reason
    return useChange(storeSlice, givenKey)[0];
}
exports.useValue = useValue;
function useSet(storeSlice, givenKey) {
    const { slice, key } = parseArgs(storeSlice, givenKey);
    return react_1.useCallback(
    // eslint-disable-next-line no-param-reassign
    (value) => {
        if (typeof value === 'function') {
            const valueFunction = value;
            slice[key] = valueFunction(slice[key]);
        }
        else {
            slice[key] = value;
        }
    }, [slice, key]);
}
exports.useSet = useSet;
exports.default = useChange;

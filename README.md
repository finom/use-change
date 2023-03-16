## use-change

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
[![npm version](https://badge.fury.io/js/use-change.svg)](https://badge.fury.io/js/use-change) [![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/) [![Build status](https://github.com/finom/use-change/actions/workflows/main.yml/badge.svg)](https://github.com/finom/use-change/actions)

> The most minimalistic React state management library on the market with [zero dependencies](https://bundlephobia.com/package/use-change) and `React.useState`-like syntax

With this hook application state is defined as a nested object and the properties of the object are listened with [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). No reducers, actions, observers, middlewares. Just one hook and some secondary API that you can ignore if you don't need it.

Components that call `useChange` listen to only those properties that they actually need but never update if something else gets changed 🏎️.

See discussion and criticism [on Reddit](https://www.reddit.com/r/javascript/comments/qqsbo3/usechange_the_most_minimalistic_react_state/) 😅.

## Table of Contents 📋

<!--ts-->
* [Quick start <g-emoji class="g-emoji" alias="coffee" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/2615.png">☕</g-emoji>](#quick-start-)
* [Quick start using Provider and store as a class instance <g-emoji class="g-emoji" alias="bulb" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f4a1.png">💡</g-emoji>](#quick-start-using-provider-and-store-as-a-class-instance-)
* [Designing the store <g-emoji class="g-emoji" alias="construction_worker" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f477.png">👷</g-emoji>](#designing-the-store-)
* [Summary <g-emoji class="g-emoji" alias="student" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f9d1-1f393.png">🧑‍🎓</g-emoji>](#summary-)
* [API <g-emoji class="g-emoji" alias="rocket" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f680.png">🚀</g-emoji>](#api-)
    * [useChange](#usechange)
    * [Provider](#provider)
* [Secondary API <g-emoji class="g-emoji" alias="muscle" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f4aa.png">💪</g-emoji>](#secondary-api-)
    * [useValue](#usevalue)
    * [useSet](#useset)
    * [useGet](#useget)
    * [useSilent](#usesilent)
    * [listenChange](#listenchange)
    * [unlistenChange](#unlistenchange)
    * [Context](#context)
* [Persistent store <g-emoji class="g-emoji" alias="mountain_snow" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f3d4.png">🏔️</g-emoji>](#persistent-store-️)
* [Contributors <g-emoji class="g-emoji" alias="sparkles" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/2728.png">✨</g-emoji>](#contributors-)

<!-- Added by: finom, at: Sun Dec 12 21:08:36 EET 2021 -->

<!--te-->

## Quick start ☕

1. Install the library by `npm i use-change` or `yarn add use-change`.
2. Define an object of any shape. It's going to be your store.
3. Add `useChange` to your component.

```js
import React, { ReactElement } from 'react'
import useChange from 'use-change';

const store = { count: 0 };

const MyComponent = (): ReactElement => {
  const [count, setCount] = useChange(store, 'count');
  
  return (
    <>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </>
  )
}

export default MyComponent;
```

`store.count` is updated using `setCount` function from the tuple returned by `useChange` (just like using `React.useState`). It can also be updated just by direct modification of `count` property:

```js
// ...
// you can do it from anywhere
store.count = 69; // nice
```

The example shows how you can use the hook as a local data store for a component but `store` object can be exported and used by other components. This may be an anti-DRY pattern, that's why it's recommended to use `Provider` exported from `use-change`.

## Quick start using Provider and store as a class instance 💡

1. Install the library by `npm i use-change` or `yarn add use-change`.
2. Define an object of any shape. At this case this is a store class instance instead of an in-line object.
3. Wrap your components by `Provider` exported by `use-change`.
4. Add `useChange` to your components.

```js
// ./store.ts
// export the store class to use it for type references
export class RootStore {
  public count = 0;
}

export default new RootStore(); // init the store instance
```

```js
// ./App.tsx
import React, { ReactElement } from 'react';
import { Provider as UseChangeProvider } from 'use-change';
import MyComponent from './MyComponent';
import store from './store';

const App = (): ReactElement => (
  <UseChangeProvider value={store}>
    <MyComponent />
  </UseChangeProvider>
)

export default App;
```

```js
// ./MyComponent.tsx
import React, { ReactElement } from 'react'
import useChange from 'use-change';
import { RootStore } from './store';

const MyComponent = (): ReactElement => {
  // the first argument is a path to store object
  // if store is nested the path could look like 
  // (store: RootStore) => store.foo.bar where "bar" is an object containing "count"
  const [count, setCount] = useChange((store: RootStore) => store, 'count');
  
  return (
    <>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </>
  )
}

export default MyComponent;
```

## Designing the store 👷

Let's make it a little bit detailed and add a few classess that may be responsible for different aspects of data. Those classes may consist of user info, fetched data, persistent data or anything else that you want to keep at its own place. But for simplicity let's create a few classess that also consist of counts.

```js
// ./store.ts
class StoreBranchA {
  public aCount = 0;
}

class StoreBranchB {
  public bCount = 0;
}

// those classes can also be initialised at class constructor
export class RootStore {
  public readonly storeBranchA = new StoreBranchA();
  public readonly storeBranchB = new StoreBranchB();
}

// export store selectors or, in other words, paths to the objects
export const ROOT = (store: RootStore) => store;
export const PATH_A = ({ storeBranchA }: RootStore) => storeBranchA;
export const PATH_B = ({ storeBranchB }: RootStore) => storeBranchB;

export default new RootStore();
```

At this example we're also exporting so-called "store selectors". The selectors are one-line arrow functions that provide paths to desired store objects. This makes the code look clean without providing things like `({ users }: RootStore) => users` every time, but instead we define a simple reusable constant. In case of users the constant can be called `USERS` and applied as the first `useChange` argument: `useChange(USERS, 'something')` (get `store.users.something` property). It's not required but recommended in order to make code look much nicer.

Also take a look at the `ROOT` store selector. It's going to be used to get and modify properties from the store itself like that: `useChange(ROOT, 'count')` to avoid usage of duplicating `(store: RootStore) => store` function.

Don't worry, that's the only kind of constants that are going to be exported.

```js
// ./MyComponent.tsx
import React, { ReactElement } from 'react'
import useChange from 'use-change';
import { PATH_A, PATH_B } from './store';

const MyComponent = (): ReactElement => {
  const [countA, setCountA] = useChange(PATH_A, 'countA');
  const [countB, setCountB] = useChange(PATH_B, 'countB');
  
  return (
    <>
      <p>{countA}</p>
      <button onClick={() => setCountA(countA + 1)}>Increment count A</button>
      <p>{countB}</p>
      <button onClick={() => setCountB(countB + 1)}>Increment count B</button>
    </>
  )
}

export default MyComponent;
```

As you can see the component doesn't modify store object implicitly, therefore it's not possible to change it directly (via assignment operator) from components. You can try to do that though to see how component reacts on changes of a listened property.
 
```js
// ...
import store, { RootStore } from './store';

setInterval(() => {
  store.storeBranchA.countA++;
}, 1000);

const MyComponent = (): ReactElement => {
// ...
```


The component is going to be updated every second since it listens to the `store.storeBranchA.countA` property changes.

The property can also be manipulated manually inside class methods.

```js
class RootStore {
  public count = 0;

  constructor() {
    setInterval(() => {
      this.incrementCount();
    }, 1000);
  }

  public readonly incrementCount() {
    this.count++;
  }
}
```

## Summary 🧑‍🎓

Congrats! You basically passed the tutorial of how to use `use-change` hook! Let's just mention a few last notes:

**The hook supports two overloads**
1. Explicit store use. At this case you pass the store object to `useChange` hook: `useChange<T>(object: T, key: string)`
2. Implicit store use where the store object is passed as `Provider` value and the listenable property is located in a nested object from the store `useChange<T>(storeSelector: (store: T) => object, key: string)`, where `storeSelector` is a path to a store object as a tiny arrow function.

**Store is mutable, state is immutable.** Think of store as of tree with trunk and branches that never change and on the branches there are leaves that can fall and grow any number of times.

Components and store fields are connected to each other at many-to-many relaton:

![image](./assets/use-change.png)

Let's take a look at a more abstract example. Just to make it simpler to understand, let's define a small interface instead of classes definition.

```js
interface RootStore {
  readonly me: {
    isAuthenticated: boolean; 
    name: string;
  }
  
  readonly shop: {
    readonly cart: {
      items: ShoppingCartItem[];
    }
    
    deliveryAddress: string;
  }
}
```

If application store is implemented by the interface, then:

- `RootStore['me']`, `RootStore['shop']`, `RootStore['shop']['cart']` should not be changed since they're "branches of the tree". These properties are the **store** that can be returned by store selectors.
- But `RootStore['me']['isAuthenticated']`, `RootStore['me']['name']`, `RootStore['shop']['cart']['items']`, `RootStore['shop']['deliveryAddress']`  can, since they're "leaves of the tree" that can be listened by components. These properties are the **state**.

This means that any listenable property needs to be overridden by a new value, but never mutated.

```js
const [cartItems, setCartItems] = useChange(
  ({ shop }: RootStore) => shop.cart, // select the "tree branch"
  'items', // use shop.cart.items property
);

// ...

// create a new array to be used as shop.cart.items value
setCartItems([
  ...cartItems,
  newItem,
]);

// or
store.shop.cart.items = [
  ...cartItems,
  newItem,
];

// but never mutate the array
// cartItems.push(newItem); // wrong
// store.shop.cart.items.push(newItem); // also wrong
```


## API 🚀

### `useChange`

**Explicit store overload.** At this case you provide a store object directly as the first argument. It can be used for cases when you don't want to apply `Provider` and you need a local one-component store. Useful at forms to avoid usage of multiple `React.useState`.

In other cases it's recommended to use overload with store selector.

`useChange<T, K>(object: T, key: K & keyof T) => [value: inferred, setter: (value: inferred) => inferred]`

```js
interface RootStore {
  foo: { 
    bar: { 
      key: string;
    } 
  }
}

const store: RootStore = { foo: { bar: { key: 'value' } } };
// ...
const [value, setValue] = useChange(store.foo.bar, 'key'); // value is inferred as string
```

**Implicit store overload.** The recommended way to use `useChange` if it's used as a core data store library of an app you work on.

`useChange<T, K, S>(getStore: (store: T) => S, key: K & keyof S): [value: inferred, setter: (value: inferred) => inferred]`

```js
interface RootStore {
  foo: { 
    bar: { 
      key: string;
    } 
  }
}
const store: RootStore = { foo: { bar: { key: 'value' } } };
// ...
const [value, setValue] = useChange((store: RootStore) => store.foo.bar, 'key'); // value is inferred as string
```

### `Provider`

The use-change context provider.

```js
import React, { ReactElement } from 'react';
import { Provider as UseChangeProvider } from 'use-change';
import MyComponent from './MyComponent';

const store = { count: 0 };

const App = (): ReactElement => (
  <UseChangeProvider value={store}>
    <MyComponent />
  </UseChangeProvider>
)

export default App;
```

## Secondary API 💪

The library also provides a few helpful hooks and functions that mostly duplicate features of `useChange` but may be useful working on something big.


### `useValue`

Supports 100% the same overload as `useChange` does and works the same way but instead of a `[value, setter]` tuple it returns just a `value` (zero-indexed element of the tuple). 

```ts
const value = useValue((store: RootStore) => store.foo.bar, 'key');

// 100% equivalent of 
const [value] = useChange((store: RootStore) => store.foo.bar, 'key');

// or 
const value = useChange((store: RootStore) => store.foo.bar, 'key')[0];
```

### `useSet`

Supports 100% the same overload as `useChange` does but instead of a `[value, setter]` tuple it returns just a `setter` (element of index 1 of the tuple). The hook **doesn't trigger component re-render** when property value is changed.

```ts
const setBarKey = useSet((store: RootStore) => store.foo.bar, 'key');

// almost the same as the following, but doesn't trigger component re-render
const setBarKey = useChange((store: RootStore) => store.foo.bar, 'key')[1];
```

### `useGet`

Supports 100% the same overload as `useChange` does but returns a function that returns store property value. The hook is useful when you need to get an actual property value (at `useEffect` or `useCallback`) but you don't want to make component to re-render. The hook **doesn't trigger component re-render** when property value is changed.

```ts
// a change of the 'key' property never re-renders the component even if field value is changed
const getFooBarValue = useGet((store: RootStore) => store.foo.bar, 'key'); 

useEffect(() => {
  const fooBarValue = getFooBarValue(); // returns store.foo.bar['key']
  console.log(fooBarValue);
});
```


### `useSilent`

Supports 100% the same overload as `useChange` does but returns `value` and **doesn't trigger component re-render** when property value is changed. This is the "silent twin" of `useValue`.

```ts
const value = useSilent((store: RootStore) => store.foo.bar, 'key');
```

It's used for cases if you want to get something unchangeable. A good example is store methods: they don't need to get their property descriptor to be modified.

```js
// ./store.ts
class StoreBranch {
  public count = 0;
  
  public readonly incrementCount = () => {
    this.count++;
  }
}

export class RootStore {
  public readonly storeBranch = new StoreBranch();
}

export default new RootStore();
```

```ts
const incrementCount = useSilent((store: RootStore) => store.storeBranch, 'incrementCount');
// ...
incrementCount();
```

### `listenChange`

Allows to listen to object property changes outside of components. The store object argument should be given explicitly since `Provider` doesn't work here anymore. The method returns a function that unsubscribes from a given event.

`listenChange<T, K>(store: T, key: K & keyof T, listener: (value: inferred, previousValue: inferred) => void): () => void`

```ts
const store = { count: 0; };

const unlisten = listenChange(store, 'count', (count) => console.log('the count is: ', count));

setInterval(() => {
  store.count++;
}, 1000);
```



### `unlistenChange`

Removes previously attached listener.

`unlistenChange<T, K>(store: T, key: K & keyof T, listener: (value: inferred) => void): void`

```ts
const store = { count: 0; };

const handler = (count) => console.log('the count is: ', count);

listenChange(store, 'count', handler);

// ... 

unlistenChange(store, 'count', handler);
```


### `Context`

React context used for the store provider. You can use `Context` with `React.useContext` to receive store object without importing it. `Context.Provider` equals to the `Provider` documented above.

```ts
import React, { useContext } from 'react';
import { Context as UseChangeContext } from 'use-change';
import { RootStore } from './store';

const MyComponent = () => {
  const store = useContext<RootStore>(UseChangeContext);
  // ...
}
```

## Persistent store 🏔️

There is no built-in feature to store data persistently but the elegancy of use-change design makes possible to create such things easily.

```js
// ./PersistentStore.ts
import { listenChange } from 'use-change';

// the function returns localStorage value or default value if localStorage value doesn't exist
function persistentValue<T>(key: keyof PersistentStore, defaultValue: T) {
  const storageValue = localStorage.getItem(key);
  return storageValue ? JSON.parse(storageValue) as T : defaultValue;
}

// define the part of root store that responsible for persistent store
export default class PersistentStore {
  public age = persistentValue<number>('age', 18);

  public firstName = persistentValue<string>('firstName', 'John');

  public lastName = persistentValue<string>('lastName', 'Doe');

  constructor() {
    // enumerate over own property names (age, firstName, lastName)
    // and define property change listener to update localStorage
    Object.getOwnPropertyNames(this).forEach((key) => {
      listenChange(this, key, (value) => {
        localStorage.setItem(key, JSON.stringify(value));
      });
    });
  }
}
```

Use the class instance as part of your root store.

```js
// ./store.ts
import PersistentStore from './PersistentStore';

export class RootStore {
  public readonly persistent = new PersistentStore();
}

export default new RootStore();
```

Then use it as any other custom object.

```js
// the value will be written into localStorage
store.persistent.age = 20;
```

```js
// or with a use-change hook
import useChange from 'use-change';

// ...
const [age, setAge] = useChange(({ persistent }: RootStore) => persistent, 'age');
// ...
// the value will be written into localStorage
setAge(20);
```

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/ivteplo"><img src="https://avatars.githubusercontent.com/u/37793399?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ivan Teplov</b></sub></a><br /><a href="https://github.com/finom/use-change/commits?author=ivteplo" title="Documentation">📖</a> <a href="https://github.com/finom/use-change/commits?author=ivteplo" title="Tests">⚠️</a> <a href="https://github.com/finom/use-change/commits?author=ivteplo" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

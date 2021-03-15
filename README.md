# use-change

> The one React hook for app-wide data

The idea of this library is that you define a skeleton of your data store as a flat or a nested object, and with the help of [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) listen to changes at properties of the object. No reducers, actions, observers, middlewares, exported constants. Just one hook and some secondary API you may not ever need.

Components that include `useChange` listen to only those properties that they actually need but never updates if something else is changed. 

![image](./use-change.png)


## Quick start

1. Install by `npm i use-change` or `yarn add use-change`.
2. Define an object of any shape. This is going to be your store.
3. Add `useChange` to your component

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

`store.count` is updated using `setCount` function from the touple returned by `useChange`. It can also be updated just by direct modification of `count` property:

```js
// ...
// you can do it from anywhere
store.count = 69; // nice
```

The example shows how you can use the hook as a local data store for a component but `store` object can be exported and used by other components. This may be an anti-DRY pattern, that's why it's recommended to use `Provider` exported from `use-change`.

## Quick start using Provider

1. Install by `npm i use-change` or `yarn add use-change`.
2. Define an object of any shape. This is going to be your store.
3. Wrap your components by `Provider` exported by `use-change`
4. Add `useChange` to your components

```js
import React, { ReactElement } from 'react';
import useChange, { Provider as UseChangeProvider } from 'use-change';
import MyComponent from './MyComponent';

const store = { count: 0 };

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

const MyComponent = (): ReactElement => {
  const [count, setCount] = useChange('count');
  
  return (
    <>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </>
  )
}

export default MyComponent;
```

## Designing store

You can use an object literal to define store for simple use, but real world data usually consists more than just a `count`. It's recommended to build your store as a class instance. Shape of the class is 100% custom and it doesn't require to use decorators or wrappers.

```js
// ./store.ts
export class RootStore {
  public count = 0;
  // ...
}

export default new RootStore();
```

Then just import the store and use it at `Provider` as usually.

```js
import React, { ReactElement } from 'react';
import useChange, { Provider as UseChangeProvider } from 'use-change';
import MyComponent from './MyComponent'; // ./MyComponent.tsx remains the same
import store from './store';

const App = (): ReactElement => (
  <UseChangeProvider value={store}>
    <MyComponent />
  </UseChangeProvider>
)

export default App;
```

Let's make it more complex and add a few classess that may be responsible for different aspects of data. Those classes may consist user info, fetched data, persistent data or anything else that you want to keep at its own place. But for siplicity let's add a few classess that also consist counts.

```js
// ./store.ts
class StoreBranchA {
  public aCount = 0;
}

class StoreBranchB {
  public bCount = 0;
}

export class RootStore {
  public readonly storeBranchA = new StoreBranchA();
  public readonly storeBranchB = new StoreBranchB();
}

export default new RootStore();
```

Meet the third and the last overload of `useChange` hook, where the first argument of the function is **store selector** and the second, as usually, a property name.

```js
// ./MyComponent.tsx
import React, { ReactElement } from 'react'
import useChange from 'use-change';
import { RootStore } from './store';

const MyComponent = (): ReactElement => {
  const [countA, setCountA] = useChange(({ storeBranchA }: RootStore) => storeBranchA, 'countA');
  const [countB, setCountB] = useChange(({ storeBranchB }: RootStore) => storeBranchB, 'countB');
  
  return (
    <>
      <p>{countA}</p>
      <button onClick={() => setCountA(countA + 1)}>Increment count A</button>
      <p>{countB}</p>
      <button onClick={() => setCountB(countB + 1)}>Increment count B</button>
    </>
  )
}
```

As you can see here we import `RootStore` class itself to be used just as a type, but we don't import store itself there thanks to `Provider`. But you can import it though to see how cool it is:

```js
// ...
import store, { RootStore } from './store';

setInterval(() => {
  store.storeBranchA.countA++;
}, 1000);

const MyComponent = (): ReactElement => {
// ...
```


The component is going to be updated every second sincne it listens the `store.storeBranchA.countA` peoperty.

## Summary

Congrats! You basically passed the tutorial of how to use `use-change` hook! Let's just mention a few last notes:

**The hook supports 3 overloads**
1. Explicit store use. At this case you pass the store object to `useChange` hook: `useChange<T>(object: T, key: string)`
2. Implicit store use where the store object is passed as `Provider` value and the listenable property is located in the root of store `useChange<T>(key: string)` 
3. Implicit store use where the store object is passed as `Provider` value and the listenable property is located in a nested object from the store `useChange<T>(storeSelector: (store: T) => object, key: string)` 

**Store is mutable, state is immutable.** Think of store as of tree with trunk and branches that never change and on the branches there are leaves that can fall and grow infinite times. Let's take a look at a custom store interface.

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

If the store is implemented by the interface, then:

- `RootStore['me']`, `RootStore['shop']['cart']`, `RootStore['shop']['cart']` should not be changed since they're "branches" (the store skeleton) 
- But `RootStore['me']['isAuthenticated']`, `RootStore['me']['name']`, `RootStore['shop']['cart']['items']`, `RootStore['shop']['deliveryAddress']` can, since they're "leaves" that can be listened by components.

This means that any listenable property need to be overriden bu a new value, but never mutated.

```js
const [cartItems, setCartItems] = useChange(
  ({ shop }: RootStore) => shop.cart, // select a data tree "branch"
  'items', // 
);

// ...

setCartItems([
  ...cartItems,
  newItem,
]);

// or
store.shop.cart.items = [
  ...cartItems,
  newItem,
];
```






## API

### `useChange`

**Explicit store overload.** At this case you provide store object directly. Use cases: 

1. You don't want to use `Provider`.
2. You have existing application and you want to add some extra logic without affecting entire application.

In other cases it's recommended to use overload with store selector.

`useChange<T, K>(object: T, key: K & keyof T & string) => [value: inferred, setter: (value: inferred) => inferred]`

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

**Implicit store overload** with store selector. 

`useChange<T, K, S>(getStore: (store: T) => S, key: K & keyof T & string): [value: inferred, setter: (value: inferred) => inferred]`

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


**Implicit root store overload.** This overload doesn't require to provide neither store object nor store selector. Key provided as the only argument 


`useChange<T, K>(key: K & keyof T & string): [value: inferred, setter: (value: inferred) => inferred]`

```js
const store = { key: 'value' };
// ...
const [value, setValue] = useChange<RootStore>('key')
```

There are noteworthy restrictions of this overload described below.


## Secondary API 

The library also provides a few helpful hooks and functions that cover additional needs using `useChange` hook.


### `useValue`

Supports 100% the same overload as `useChange` does and works the same but instead of a `[value, setter]` touple it returns just a `value` (zero-indexed element of the touple). 

```ts
const value = useValue((store: RootStore) => store.foo.bar, 'key');

// 100% equivalent of 
const [value] = useChange((store: RootStore) => store.foo.bar, 'key');

// or 
const value = useChange((store: RootStore) => store.foo.bar, 'key')[0];
```

It's (as well as `useSetter`) created for syntax sugar purposes.

```ts
doSomething(useValue(...));
```



### `useSetter`

Supports 100% the same overload as `useChange` does and works the same but instead of a `[value, setter]` touple it returns just a `value` (element of index 1 of the touple). 

```ts
const setBarKey = useValue((store: RootStore) => store.foo.bar, 'key');

// 100% equivalent of 
const [, setBarKey] = useChange((store: RootStore) => store.foo.bar, 'key');

// or 
const setBarKey = useChange((store: RootStore) => store.foo.bar, 'key')[1];
```



`useSilently()`

`listenChange()`

`unlistenChange()`

## Examples

### Persistent store

```js
import { Layout } from 'react-grid-layout';
import { listenChange } from '../hooks/useChange';

function persistentValue<T>(key: keyof PersistentStore, defaultValue: T) {
  const storageValue = localStorage.getItem(key);
  return storageValue ? JSON.parse(storageValue) as T : defaultValue;
}

export class PersistentStore {
  public layout = persistentValue<Layout[]>('layout', []);

  public binanceApiKey = persistentValue<string | null>('binanceApiKey', null);

  public binanceApiSecret = persistentValue<string | null>('binanceApiSecret', null);

  constructor() {
    Object.getOwnPropertyNames(this).forEach((key) => {
      listenChange(this, key, (value) => {
        localStorage.setItem(key, JSON.stringify(value));
      });
    });
  }
}

export default new PersistentStore();

```

### Persistent store

## Known issues

1. Implicit root store requires key generic.
2. Overload errors.


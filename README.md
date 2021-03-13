# use-change

> The TypeScript-first react store library you were looking for


The concept of this library is that you define a skeleton of your data store as a flat or a nested object, and with the help of [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) listen to peoperty changes.

**Store is mutable, state is immutable.** Think of store as of tree with trunk and branches that never change and on the branches there are leaves that can fall and grow infinite times. Let's 

```js
interface RootStore {
  readonly me: {
    isAuthenticated: boolean; 
    name: 'Joe Doeson';
  }
  
  readonly shop: {
    readonly cart: {
      items: ShoppingCartItem[];
    }
    
    deliveryAddress: string;
  }
}
```

`RootStore['me']`, `RootStore['shop']['cart']`, `RootStore['shop']['cart']` should not be changed since they're "branches" (the store skeleton) but `RootStore['me']['isAuthenticated']`, `RootStore['me']['name']`, `RootStore['shop']['cart']['items']`, `RootStore['shop']['deliveryAddress']` can, since they're "leaves" that can be listened by components. 

```js
const [cartItems, setCartItems] = useChange(
  ({ shop }: RootStore) => shop.cart, // select "branch"
  'items', // 
);

// ...

setCartItems([
  ...cartItems,
  newItem,
])
```




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
```

```js
class StoreBranchA {
  aCount = 0;
}

class StoreBranchB {
  bCount = 0;
}

export class RootStore {
  rootCount = 0;
  storeBranchA = new StoreBranchA();
  storeBranchB = new StoreBranchB();
}

export default new RootStore();
```

```js
import React, { ReactElement } from 'react'
import useChange from 'use-change';
import store, { RootStore } from './store';

setInterval(() => {
  store.storeBranchA.countA++;
}, 1000);

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


## API

Explicit store

`useChange(object: any, key: string): [value, setter]`

```js
const store = { key: value };
// ...
const [value, setValue] = useChange(store, 'key')
```

Implicit store

`useChange(getObject, key: string): [value, setter]`

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
const [value, setValue] = useChange((store: RootStore) => store.foo.bar, 'key')
```


Implicit root store


`useChange(key: string): [value, setter]`

```js
const store = { key: 'value' };
// ...
const [value, setValue] = useChange<RootStore>('key')
```


## Secondary API 

`useValue()`

`useSetter()`

`useSilently()`

`listenChange()`

`unlistenChange()`


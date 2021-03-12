# use-change

> The TypeScript-first react store library you were looking for

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





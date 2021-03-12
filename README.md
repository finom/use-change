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

class RootStore {
  rootCount = 0;
  storeBranchA = new StoreBranchA();
  storeBranchB = new StoreBranchB();
}
```

```js
import React, { ReactElement } from 'react'
import useChange from 'use-change';

const store = { count: 0 };

const MyComponent = (): ReactElement => {
  const [countA, setCountA] = useChange(({ storeBranchA }) => storeBranchA, 'countA');
  const [countB, setCountB] = useChange(({ storeBranchB }) => storeBranchB, 'countB');
  
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





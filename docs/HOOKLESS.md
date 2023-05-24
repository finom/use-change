# Hook-less React application state powered by accessors

> This is an alternative README for [use-change](https://github.com/finom/use-change) that utilises the explicit overload. use-change includes a bunch of usefil hooks that allow to access application store safely. When I say "safely" I mean that you're never going to use application state object at your components directly. Instead I recommended to use Provider to make all components to have acces to one object and modify data with the `useState`-like hook. At this doc we're not going to use Provider at all, therefore we don't need the most of the hooks anymore. 

Before we start let's define a simple application state. It has `count` and `increment` at the root and `users` as sub-storage for data that specified for users (for now it's just an array of `ids`). 

```ts
// store.ts
class Users {
  public ids: [1, 2, 3];
}

class RootStore {
  public users = new Users();
  public count = 0;
  public increment = () => this.count++;
}

const store = new RootStore();

export default store;
```

**use-change** introduces a hook called `useValue` that allows to listen to data using property accessor. To access the app state data in your component you'd call `useValue` with 2 arguments: the object, and its key that's going to be listened.

```ts
import { useValue } from 'use-change';
import store from './store'

export default () => {
  const count = useValue(store, 'count');
  const userIds = usealue(store.users, 'ids');

  // ...
}
```

The syntax is fine, but there is one cool idea: why not to define the hook as `use` method and never import hooks form **use-change** to your components?

Let's define `use` method for all our sub-stores:

```ts
// store.ts
class Users {
  public ids: [1, 2, 3];
  public use = <KEY extends keyof this>(key: KEY) => useValue<typeof this, KEY>(this, key);
}

class RootStore {
  public users = new Users();
  public count = 0;
  public increment = () => this.count++;
  public use = <KEY extends keyof this>(key: KEY) => useValue<typeof this, KEY>(this, key);
}

const store = new RootStore();

export default store;
```
    
> Tip: If you don't want to repeat `use` method at every class, you can create another class that is going to extend other classes. For this example let's keep it simple.

From now, when we want to have reactive access to the property at React component we use this method and we also don't import hooks to our component anymore.
    
```ts
import store from './store'

export default () => {
  const count = store.use('count'); // same as store['count'] but reactive
  const userIds = store.users.use('ids'); // same as store.users['ids'] but reactive

  // ...
}
```
    
    
What if we want to set the value? Just use assignment and all components are going to trigger re-render.
    
```ts
store.count++;
store.users.ids = [...store.users.ids, 4]
```
    
What if we want to call some custom code (i.e. action)? Just call the method. **use-change** doesn't introduce anything for side-effects, we use plain old JavaScript
    
```ts
store.increment();
```
    
Full example:
    
```ts
import store from './store'

export default () => {
  const count = store.use('count'); // same as store['count'] but reactive
  const userIds = store.users.use('ids'); // same as store.users['ids'] but reactive

  return (
    <div onClick={() => {
        store.count++;
        // or store.increment()
    }}>Clicks: {count}</div>
  )
}
```

That's what I call **hook-less**. Of course we still use hooks to implement that but:
    
- We don't import library-specific hooks to our components.
- We've got a "natural" way to get values in your components: `foo.bar.baz.field` is replaced by `foo.bar.baz.use('field')`
    
 > Tip: if you still want to `useState`-like syntax with value and setter function you can replace `useValue` by `useChange` at your `use` method and use the folloiwing syntax:
 
 ```ts
const [count, setCount] = store.use('count');
```

If you have any questions, open an issue or a discussion.

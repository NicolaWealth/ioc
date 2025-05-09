import {deferUntilFactory} from "@nicolawealth/defer_until";

export const iocFactory = () => {
  const _defaults: Record<string, unknown> = {};

  // _current will match the _defaults except for when you are running tests and
  // have swapped out for a stub/mock
  let _current: Record<string, unknown> = {};
  let _productionMode = false;

  // get(name) -> T
  // lookup by name and return _current.
  // validates a default exists, as we'd only use this to lookup things that should exist
  const get = <T>(name: string): T => {
    if (_current[name] === undefined && _defaults[name] === undefined) {
      throw new Error(`ioc.get("${name}") current and default undefined.`);
    }
    return _current[name] as T;
  };

  // setDefault(name: T)
  // register a name for T
  // names must be unique, and once set are permanent
  // state in T is allowed and preserved across set/reset
  // returns a iocGet wrapper for the name.
  const setDefault = <T>(dependency: { [name: string]: T }) => {
    const entries = Object.entries(dependency);
    if (entries.length !== 1) {
      throw new Error(`ioc.setDefault({name}) takes only one thing at a time.`);
    }
    const [name, t] = entries[0];
    if (_defaults[name] !== undefined) {
      throw new Error(`ioc.setDefault({${name}:...}) -> already set.}`);
    }
    _defaults[name] = t;
    _current[name] = t;

    return () => get<T>(name);
  };

  // setDeps(dependenciesObject)
  // override given dependencies with same names until reset
  // this is _only_ used by tests, and not in "normal" code paths
  // allows for stubbing out dependencies without using ctor injection
  // mainly added to make dealing with transitive dependencies in UI components easier
  // use ioc.setDeps in `before` blocks or at the start of each `it`
  // do *not* use inside the `describe` block to wrap an `it`, as tests are only registered during the `it` call to be run after the describe returns
  // note, this is not a push, so doing multiple sets will not preserve any but the last set
  const setDeps = (dependencies: Record<string, unknown>, expectDefault = false) => {
    Object.entries(dependencies).forEach(([k, v]) => {
      if (_productionMode) {
        throw new Error(`ioc.setDeps("${k}") is not valid in production mode.`);
      }
      if (expectDefault && _defaults[k] === undefined) {
        throw new Error(`ioc.setDeps("${k}") no default defined.`);
      }
      _current[k] = v;
    });
    return _current;
  };

  // used to track ioc.dep based overrides so the ioc.reset will also reset them.
  const deferrals = deferUntilFactory();

  // reset(...names)
  // if given no names will restore _current to _defaults
  // if given names will reset those named to their _defaults
  // test using ioc.set should add an `after(ioc.reset)` to ensure reset happens and doesn't leave stubs in place that could affect other tests
  const reset = (...names: string[]) => {
    if (names.length > 0) {
      names.forEach(n => _current[n] = _defaults[n]);
    } else {
      _current = {..._defaults};
    }
    deferrals.later();
  };

  // productionMode()
  // disable set and force use of _defaults
  // prevents using set outside of tests.
  const productionMode = () => {
    reset();
    return _productionMode = true;
  };

  // dep({...stubs...})
  // override component level dependencies
  // note: be aware the original dependencies are still imported when using this in tests and any side effects of those imports are run during tests
  // use the split form of get/set if you want complete abstraction of the dependency implementation from its usage.
  const dep = (dependencies: Record<string, unknown>) => {
    const originalDependencies = Object.assign({}, dependencies);
    const reset = () => Object.assign(dependencies, originalDependencies);
    const set = (deps: Record<string, unknown>) => {
      if (_productionMode) {
        throw new Error(`dep.set(...) is not valid in production mode.`);
      }
      for (const [name, value] of Object.entries(deps)) {
        if (!Object.hasOwnProperty.call(dependencies, name)) {
          throw new Error(`${name} not in ioc deps`);
        }
        dependencies[name] = value;
      }
      deferrals.defer(reset);
    };
    return {set, reset};
  };
  return {setDefault, setDeps, get, reset, productionMode, dep};
};

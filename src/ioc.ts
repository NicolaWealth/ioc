import {deferUntilFactory} from "@nicolawealth/defer_until";

export const iocFactory = () => {
  let _productionMode = false;
  // used to track ioc.dep based overrides so productionMode will reset them
  const deferrals = deferUntilFactory();

// productionMode()
// disable dep.set and force use of original dependencies
// prevents using dep.set outside of tests
  const productionMode = () => {
    // Utilizes defer_until package (enables deferring a stack of function calls until a later point) to call dep.reset()
    deferrals.later();
    return _productionMode = true;
  };

// dep({...stubs...})
// override component level dependencies
// note: be aware the original dependencies are still imported when using this in tests and any side effects of those imports are run during tests
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
  return {productionMode, dep};
};

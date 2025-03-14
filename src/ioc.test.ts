// @ts-ignore
import {iocFactory} from "./ioc_factory.ts";
import sinon from "sinon";
import assert from "assert";

describe("ioc tests", () => {
  it("deps overwriting", async () => {
    // Setup Dependencies
    const defaultDependency = sinon.stub().throws("Using wrong dep");
    const defaultDependencyObject = {mainDep: defaultDependency};
    const overrideDependency = sinon.stub();
    const overrideDependencyObject = {mainDep: overrideDependency};

    // Setup IOC
    const caller = (): void  => {
      defaultDependencyObject.mainDep();
    };
    const iocT1 = iocFactory();
    caller.deps = iocT1.dep(defaultDependencyObject);
    caller.deps.set(overrideDependencyObject);

    // Caller should not throw an error
    caller();
  });
  it("production mode throws errors", async () => {
    // Setup Dependencies
    const defaultDependency = sinon.stub();
    const defaultDependencyObject = {mainDep: defaultDependency};
    const overrideDependency = sinon.stub();
    const overrideDependencyObject = {mainDep: overrideDependency};

    // Setup IOC
    const caller = (): void  => {
      defaultDependencyObject.mainDep();
    };
    const iocT2 = iocFactory();
    caller.deps = iocT2.dep(defaultDependencyObject);

    iocT2.productionMode();
    assert.throws(() => {caller.deps.set(overrideDependencyObject);}, {name: 'Error', message: 'dep.set(...) is not valid in production mode.'});
  });
  it("deps naming error", async () => {
    // Setup Dependencies
    const defaultDependency = sinon.stub();
    const defaultDependencyObject = {mainDep: defaultDependency};
    const overrideDependency = sinon.stub();
    const overrideDependencyObject = {otherDep: overrideDependency};

    // Setup IOC
    const caller = (): void  => {
      defaultDependencyObject.mainDep();
    };
    const iocT3 = iocFactory();
    caller.deps = iocT3.dep(defaultDependencyObject);

    assert.throws(() => {caller.deps.set(overrideDependencyObject);}, {name: 'Error', message: `otherDep not in ioc deps`});
  });
  it("deps reset", async () => {
    // Setup Dependencies
    const defaultDependency = sinon.stub();
    const defaultDependencyObject = {mainDep: defaultDependency};
    const overrideDependency = sinon.stub();
    const overrideDependencyObject = {mainDep: overrideDependency};

    // Setup IOC
    const caller = (): void  => {
      defaultDependencyObject.mainDep("in caller");
    };
    const iocT4 = iocFactory();
    caller.deps = iocT4.dep(defaultDependencyObject);
    caller.deps.set(overrideDependencyObject);

    // Override dependencies gets called once
    caller();
    sinon.assert.calledOnceWithExactly(overrideDependency, "in caller");
    sinon.assert.notCalled(defaultDependency);

    // Override dependencies are no longer called after reset
    caller.deps.reset();
    caller();
    sinon.assert.calledOnceWithExactly(overrideDependency, "in caller");
    sinon.assert.calledOnceWithExactly(defaultDependency, "in caller");
  });
  it("setDefault full functionality", async () => {
    // Setup Dependencies
    const defaultDependency = sinon.stub();
    const defaultDependencyObject = {mainDep: defaultDependency};
    const tooManyEntryDependencyObject = {mainDep: defaultDependency, secondDep: defaultDependency};
    const additionalDependency = sinon.stub();
    const additionalDependencyObject = {mainDep: additionalDependency};

    // Setup IOC
    const iocT5 = iocFactory();

    // setDefault() requires only one default to be set at a time
    assert.throws(() => {iocT5.setDefault(tooManyEntryDependencyObject);}, {name: 'Error', message: `ioc.setDefault({name}) takes only one thing at a time.`});

    // Successful setDefault() returns iocGet wrapper for the given name & get() basic functionality behaves as expected
    assert.strictEqual(iocT5.setDefault(defaultDependencyObject)(), defaultDependency);

    // Dependency names must be unique
    assert.throws(() => {iocT5.setDefault(additionalDependencyObject);}, {name: 'Error', message: `ioc.setDefault({mainDep:...}) -> already set.}`});
  });
  it("get function error", async () => {
    // Setup IOC
    const iocT6 = iocFactory();

    // get() throws error if a default has not yet been set
    assert.throws(() => {iocT6.get("mainDep");}, {name: 'Error', message: `ioc.get("mainDep") current and default undefined.`});
  });
  it("setDeps single dependency functionality", async () => {
    // Setup Dependencies
    const defaultDependency = sinon.stub();
    const defaultDependencyObject = {mainDep: defaultDependency};
    const overrideDependency = sinon.stub();
    const overrideDependencyObject = {mainDep: overrideDependency};

    // Setup IOC
    const iocT7 = iocFactory();

    // set() throws error if a default has not yet been set
    assert.throws(() => {iocT7.setDeps(overrideDependencyObject, true);}, {name: 'Error', message: `ioc.setDeps("mainDep") no default defined.`});

    // set() overwrites a dependency successfully
    iocT7.setDefault(defaultDependencyObject);
    assert.strictEqual(iocT7.get("mainDep"), defaultDependency);
    iocT7.setDeps(overrideDependencyObject, true);
    assert.strictEqual(iocT7.get("mainDep"), overrideDependency);

    // set() cannot be used in production mode
    iocT7.productionMode();
    assert.throws(() => {iocT7.setDeps(defaultDependencyObject);}, {name: 'Error', message: `ioc.setDeps("mainDep") is not valid in production mode.`});
  });
  it("setDeps multiple dependency functionality", async () => {
    // Setup Dependencies
    const defaultDependencyOne = sinon.stub();
    const defaultDependencyTwo = sinon.stub();
    const defaultDependencyOneObject = {firstDep: defaultDependencyOne};
    const defaultDependencyTwoObject = {secondDep: defaultDependencyTwo};
    const defaultDependencyObject = {firstDep: defaultDependencyOne, secondDep: defaultDependencyTwo};
    const overrideDependencyOne = sinon.stub();
    const overrideDependencyTwo = sinon.stub();
    const overrideDependencyObject = {firstDep: overrideDependencyOne, secondDep: overrideDependencyTwo};

    // Setup IOC
    const iocT8 = iocFactory();

    // setMany() sets dependencies without defaults set
    iocT8.setDeps(defaultDependencyObject);
    assert.strictEqual(iocT8.get("firstDep"), defaultDependencyOne);
    assert.strictEqual(iocT8.get("secondDep"), defaultDependencyTwo);

    // setMany() overrides dependencies with defaults set
    iocT8.setDefault(defaultDependencyOneObject);
    iocT8.setDefault(defaultDependencyTwoObject);
    assert.strictEqual(iocT8.get("firstDep"), defaultDependencyOne);
    assert.strictEqual(iocT8.get("secondDep"), defaultDependencyTwo);
    iocT8.setDeps(overrideDependencyObject, true);
    assert.strictEqual(iocT8.get("firstDep"), overrideDependencyOne);
    assert.strictEqual(iocT8.get("secondDep"), overrideDependencyTwo);
  });
  it("reset & productionMode functionality", async () => {
    // Setup Dependencies
    const defaultDependencyOne = sinon.stub();
    const defaultDependencyTwo = sinon.stub();
    const defaultDependencyOneObject = {firstDep: defaultDependencyOne};
    const defaultDependencyTwoObject = {secondDep: defaultDependencyTwo};
    const overrideDependencyOne = sinon.stub();
    const overrideDependencyTwo = sinon.stub();
    const overrideDependencyOneObject = {firstDep: overrideDependencyOne};
    const overrideDependencyTwoObject = {secondDep: overrideDependencyTwo};
    const overrideDependencyObject = {firstDep: overrideDependencyOne, secondDep: overrideDependencyTwo};

    // Setup IOC
    const iocT9 = iocFactory();

    // Set defaults and override them
    iocT9.setDefault(defaultDependencyOneObject);
    iocT9.setDefault(defaultDependencyTwoObject);
    assert.strictEqual(iocT9.get("firstDep"), defaultDependencyOne);
    assert.strictEqual(iocT9.get("secondDep"), defaultDependencyTwo);
    iocT9.setDeps(overrideDependencyObject, true);
    assert.strictEqual(iocT9.get("firstDep"), overrideDependencyOne);
    assert.strictEqual(iocT9.get("secondDep"), overrideDependencyTwo);

    // Reset one dependency
    iocT9.reset("firstDep");
    assert.strictEqual(iocT9.get("firstDep"), defaultDependencyOne);
    assert.strictEqual(iocT9.get("secondDep"), overrideDependencyTwo);

    // Reset all dependencies
    iocT9.setDeps(overrideDependencyOneObject, true);
    assert.strictEqual(iocT9.get("firstDep"), overrideDependencyOne);
    assert.strictEqual(iocT9.get("secondDep"), overrideDependencyTwo);
    iocT9.reset();
    assert.strictEqual(iocT9.get("firstDep"), defaultDependencyOne);
    assert.strictEqual(iocT9.get("secondDep"), defaultDependencyTwo);

    // SetDeps does not touch any dependency whose name was not passed in the call
    // Override one default
    assert.strictEqual((iocT9.setDeps(overrideDependencyOneObject, true))["firstDep"], iocT9.get("firstDep"));
    assert.strictEqual(iocT9.get("secondDep"), defaultDependencyTwo);
    iocT9.reset();
    assert.strictEqual(iocT9.get("firstDep"), defaultDependencyOne);
    assert.strictEqual(iocT9.get("secondDep"), defaultDependencyTwo);

    // Override all defaults
    assert.strictEqual((iocT9.setDeps(overrideDependencyOneObject, true))["firstDep"], iocT9.get("firstDep"));
    assert.strictEqual(iocT9.get("secondDep"), defaultDependencyTwo);
    assert.strictEqual((iocT9.setDeps(overrideDependencyTwoObject, true))["secondDep"], iocT9.get("secondDep"));
    assert.strictEqual(iocT9.get("firstDep"), overrideDependencyOne);


    // Production mode resets all dependencies
    iocT9.setDeps(overrideDependencyObject, true);
    assert.strictEqual(iocT9.get("firstDep"), overrideDependencyOne);
    assert.strictEqual(iocT9.get("secondDep"), overrideDependencyTwo);
    iocT9.productionMode();
    assert.strictEqual(iocT9.get("firstDep"), defaultDependencyOne);
    assert.strictEqual(iocT9.get("secondDep"), defaultDependencyTwo);
  });
});


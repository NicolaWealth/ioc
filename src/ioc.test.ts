// @ts-ignore
import {iocFactory} from "./ioc.ts";
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
});


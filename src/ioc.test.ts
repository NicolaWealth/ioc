// @ts-ignore
import {iocFactory} from "./ioc.ts";
import sinon from "sinon";
import assert from "assert";

describe("ioc tests", () => {
  it("deps overwriting", async () => {
    const iocT1 = iocFactory();
    const orig = sinon.stub().throws("Using wrong dep");
    const origDep = {mainDep: orig};
    const overwrite = sinon.stub();
    const overwriteDep = {mainDep: overwrite};
    const caller = (): void  => {
      origDep.mainDep();
    };
    caller.deps = iocT1.dep(origDep);
    caller.deps.set(overwriteDep);
    caller();
  });
  it("production mode throws errors", async () => {
    const iocT2 = iocFactory();
    const orig = sinon.stub();
    const origDep = {mainDep: orig};
    const overwrite = sinon.stub();
    const overwriteDep = {mainDep: overwrite};
    const caller = (): void  => {
      origDep.mainDep();
    };
    caller.deps = iocT2.dep(origDep);
    iocT2.productionMode();
    assert.throws(() => {caller.deps.set(overwriteDep);}, {name: 'Error', message: 'dep.set(...) is not valid in production mode.'});
  });
  it("deps naming error", async () => {
    const iocT3 = iocFactory();
    const orig = sinon.stub();
    const origDep = {mainDep: orig};
    const overwrite = sinon.stub();
    const overwriteDep = {otherDep: overwrite};
    const caller = (): void  => {
      origDep.mainDep();
    };
    caller.deps = iocT3.dep(origDep);
    assert.throws(() => {caller.deps.set(overwriteDep);}, {name: 'Error', message: `otherDep not in ioc deps`});
  });
  it("deps reset", async () => {
    const iocT4 = iocFactory();
    const orig = sinon.stub();
    const origDep = {mainDep: orig};
    const overwrite = sinon.stub();
    const overwriteDep = {mainDep: overwrite};
    const caller = (): void  => {
      origDep.mainDep("in caller");
    };
    caller.deps = iocT4.dep(origDep);
    caller.deps.set(overwriteDep);
    caller();
    sinon.assert.calledOnceWithExactly(overwrite, "in caller");
    sinon.assert.notCalled(orig);
    caller.deps.reset();
    caller();
    sinon.assert.calledOnceWithExactly(overwrite, "in caller");
    sinon.assert.calledOnceWithExactly(orig, "in caller");
  });
});


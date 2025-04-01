![Tests Passing](https://github.com/NicolaWealth/ioc/actions/workflows/auto_test_main_badge.yml/badge.svg)
![Code Cov](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2Fnicolawealth%2Fioc%2Fraw%2Fmain%2Fcodecov/badge.json&query=%24.message&label=Code%20Coverage&color=%24.color)

# Introduction
The `ioc` (Inversion of Control) package simplifies developer testing by allowing for decoupling of code from its dependencies. With `ioc`, dependencies can be overridden with stubs in test cases such that the original dependencies are not invoked during testing.

# Installation
This package should be installed via npm. You must have npm installed first. The following can be run on the commandline to install the `ioc` package with npm:

`npm install @nicolawealth/ioc`

# Usage
This package provides functionality to easily manage dependencies during testing. In order to use `ioc` in testing, the real dependencies in your code must be implemented with `ioc` so they can later be overridden and restored. 

Some common use cases may include testing code without invoking:
- database calls
- network calls
- file system access
- cloud services
- etc.

# Interface
The package provides two ways of implementing `ioc` in your code, the dep implementation and the default implementation. The dep pattern is implemented with the `ioc.dep()` function. 
The default pattern is implemented with the `ioc.setDefault()`, `ioc.setDeps()`, and `ioc.get()` methods. The `ioc.productionMode()` and `ioc.reset()` functions are shared amongst the two patterns.
The default ioc style allows for a "universal" setting of application-wide dependencies such that they can be registered just once. Whereas the dep ioc style is preferable more for component-level dependencies, providing more granular control.
The `ioc` package provides the instance of the `ioc` object in `ioc.ts`. For proper functionality ensure this shared instance is used amongst all your files and do not use the function `iocFactory()` provided in `ioc_factory.ts`.

### Dep Pattern
- `dep({dependencies});` provides the primary functionality of overriding dependencies through the following function:
  * `dep.set({dependencies});` overrides the component level dependencies with the provided stubs.
  * `dep.reset();` resets all component level dependencies to their original values.
- `productionMode();` disables the use of ioc and forces the use of the original dependencies regardless of if they have been overridden or not.

### Default Pattern
- `setDefault(dependencyObject: {'name': dependency});` registers a unique name and sets it as a real dependency under the given name. Returns a get() wrapper to the given dependency.
- `setDeps({dependenciesObject});` overrides the current value of a list of dependencies with the given names until reset is called.
  * Note: expectDefault is an optional parameter which defaults to false thus not requiring all setMany dependencies to have been previously registered with setDefault
- `get('name');` validates the existence of a registered dependency and returns the current dependency under the given name.
- `reset();` resets all registered dependencies to their set defaults regardless of current values as well as resetting all component level dependencies (dep pattern dependencies).
- `productionMode();` disables the use of set and forces the use of the default dependency values regardless (cannot be undone).

Note: be aware the original dependencies are still imported when using `ioc` in tests and any side effects of those imports are run during tests

# Testing
Tests can be found in `ioc.test.ts` located in `ioc/src` and should be run with sinon, mocha and nyc.

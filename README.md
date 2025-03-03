![Tests Passing](https://github.com/NicolaWealth/ioc/actions/workflows/autoTestMainBadge.yml/badge.svg)
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
The `ioc` package provides the function `iocFactory` which returns an instance of the `ioc` object with the following properties:
- `productionMode();` disables the use of ioc and forces the use of the original dependencies regardless of if they have been overridden or not
- `dep();` provides the primary functionality of overriding and resetting dependencies through the following functions:
  * `dep.set(deps: Record<string, unknown>);` overrides the component level dependencies with the provided stubs
  * `dep.reset();` restores dependencies to their original state

Note: be aware the original dependencies are still imported when using `ioc` in tests and any side effects of those imports are run during tests

# Testing
Tests can be found in `ioc.test.ts` located in `ioc/src` and should be run with sinon, mocha and nyc.



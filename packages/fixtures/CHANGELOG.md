# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.9.0](https://github.com/CyriacBr/mikro-resources/compare/v1.8.1...v1.9.0) (2021-04-03)


### Features

* factory method chaining to allow .with and .ignore into .persist methods ([#12](https://github.com/CyriacBr/mikro-resources/issues/12)) ([3ce4660](https://github.com/CyriacBr/mikro-resources/commit/3ce46602d286494746ed0ac2839837ea6c844dbf)), closes [#11](https://github.com/CyriacBr/mikro-resources/issues/11)

### [1.8.1](https://github.com/CyriacBr/mikro-resources/compare/v1.8.0...v1.8.1) (2021-02-21)

## [1.8.0](https://github.com/CyriacBr/mikro-resources/compare/v1.7.1...v1.8.0) (2021-02-21)


### Features

* add custom type support with @Fixture ([0f79c7e](https://github.com/CyriacBr/mikro-resources/commit/0f79c7ebf9ae73a37c35be9ca1ddb31809342013))

### [1.7.1](https://github.com/CyriacBr/mikro-resources/compare/v1.7.0...v1.7.1) (2021-02-20)

## [1.7.0](https://github.com/CyriacBr/mikro-resources/compare/v1.6.1...v1.7.0) (2021-02-20)


### Features

* add MikroORM v4 support ([bf11f71](https://github.com/CyriacBr/mikro-resources/commit/bf11f715247f80fe572694b0b29a5c545a177da6))

## [1.6.1](https://github.com/CyriacBr/mikro-resources/compare/v1.6.0...v1.6.1) (2020-03-24)


### Bug Fixes

* **fixtures:** can generate non-entity classes ([b284b72](https://github.com/CyriacBr/mikro-resources/commit/b284b72eceaa6e76039d733aa3ec6ce57e7d77df))





# [1.6.0](https://github.com/CyriacBr/mikro-resources/compare/v1.5.0...v1.6.0) (2020-03-24)


### Features

* **fixtures:** exposed register method ([35293d5](https://github.com/CyriacBr/mikro-resources/commit/35293d5cae20ee4ccfc948eec697eb032445f1ea))





# [1.5.0](https://github.com/CyriacBr/mikro-resources/compare/v1.4.1...v1.5.0) (2020-03-20)


### Features

* **fixture:** use class-fixtures-factory ([f35ee25](https://github.com/CyriacBr/mikro-resources/commit/f35ee25c65a9cd85cae051c4b5e71a048f9998bc))





# [1.4.0](https://github.com/CyriacBr/mikro-resources/compare/v1.3.1...v1.4.0) (2020-03-14)


### Bug Fixes

* **fixtures:** fixed make() typing ([fed0f13](https://github.com/CyriacBr/mikro-resources/commit/fed0f132931eadf4267ce60b4dbbfdd32ebfe1af))


### Features

* **cli:** added typesGenerator ([c5a9c73](https://github.com/CyriacBr/mikro-resources/commit/c5a9c730c543ef2805c595e9cf3058f1bc4a95bd))





## [1.3.1](https://github.com/CyriacBr/mikro-resources/compare/v1.3.0...v1.3.1) (2020-03-05)


### Bug Fixes

* **fixtures:** fixed oneAndPersist() typo ([5987cc3](https://github.com/CyriacBr/mikro-resources/commit/5987cc38e85421e203a5f42df3331fe2a0973ded))





# [1.3.0](https://github.com/CyriacBr/mikro-resources/compare/v1.2.0...v1.3.0) (2020-03-04)


### Bug Fixes

* **fixtures-factory:**  typo methpd -> method ([c5794e5](https://github.com/CyriacBr/mikro-resources/commit/c5794e50002988848b9b10565f08b13be126b6b0))


### Features

* **fixtures-factory:** added ignore() and with() ([ab9bc8f](https://github.com/CyriacBr/mikro-resources/commit/ab9bc8f7ea386667b268ec17eee9af9b346a9680))





# 1.2.0 (2020-03-04)


### Bug Fixes

* **fixtures:** added missing @Entity decorators ([2b3203f](https://github.com/CyriacBr/mikro-resources/commit/2b3203f43aaa4c4e106a63096c38102cda46ba10))
* **fixtures-factory:**  handle number enums ([e5b537b](https://github.com/CyriacBr/mikro-resources/commit/e5b537bcd9872578c9fc2dc93e91046a72cd197e))


### Features

* **fixture-factory:** added 1:1 support ([9f68d96](https://github.com/CyriacBr/mikro-resources/commit/9f68d962f69449495b8c1ca9a17e04c7cd420689))
* **fixtures:** added fixtures package ([2ad291a](https://github.com/CyriacBr/mikro-resources/commit/2ad291adaa5c6b522106c1f918af77f2070d4eca))
* **fixtures:** added logger ([2eb7db2](https://github.com/CyriacBr/mikro-resources/commit/2eb7db2d4abb8c14498ee72e8351ef7a1be6e060))
* **fixtures-factory:** added 1:m support ([695ae3f](https://github.com/CyriacBr/mikro-resources/commit/695ae3f0afdb6c794f9c6fe8f527d48990540fbc))
* **fixtures-factory:** added m:1 support ([742fe99](https://github.com/CyriacBr/mikro-resources/commit/742fe992de971ce3aa1f24c05846af19e97808de))
* **fixtures-factory:** added oneAndPersist() and makeAndPersist() ([b9505e8](https://github.com/CyriacBr/mikro-resources/commit/b9505e8e017155d31b9a892eddf69f2c532b4c9e))
* **fixtures-factory:** added scalar props support ([3077c4d](https://github.com/CyriacBr/mikro-resources/commit/3077c4d497c513575405b17fbf0a2a4639802eac))
* **fixtures-factory:** support m:n relationships ([bdf6ced](https://github.com/CyriacBr/mikro-resources/commit/bdf6ced1d42eff8dcab82944e8a6c3e7d2ce5934))





# 1.0.0 (2020-03-04)


### Bug Fixes

* **fixtures:** added missing @Entity decorators ([2b3203f](https://github.com/CyriacBr/mikro-resources/commit/2b3203f43aaa4c4e106a63096c38102cda46ba10))


### Features

* **fixture-factory:** added 1:1 support ([9f68d96](https://github.com/CyriacBr/mikro-resources/commit/9f68d962f69449495b8c1ca9a17e04c7cd420689))
* **fixtures:** added fixtures package ([2ad291a](https://github.com/CyriacBr/mikro-resources/commit/2ad291adaa5c6b522106c1f918af77f2070d4eca))
* **fixtures:** added logger ([2eb7db2](https://github.com/CyriacBr/mikro-resources/commit/2eb7db2d4abb8c14498ee72e8351ef7a1be6e060))
* **fixtures-factory:** added 1:m support ([695ae3f](https://github.com/CyriacBr/mikro-resources/commit/695ae3f0afdb6c794f9c6fe8f527d48990540fbc))
* **fixtures-factory:** added m:1 support ([742fe99](https://github.com/CyriacBr/mikro-resources/commit/742fe992de971ce3aa1f24c05846af19e97808de))
* **fixtures-factory:** added scalar props support ([3077c4d](https://github.com/CyriacBr/mikro-resources/commit/3077c4d497c513575405b17fbf0a2a4639802eac))
* **fixtures-factory:** support m:n relationships ([bdf6ced](https://github.com/CyriacBr/mikro-resources/commit/bdf6ced1d42eff8dcab82944e8a6c3e7d2ce5934))

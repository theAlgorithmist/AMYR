# AMYR

_AMYR_ is a crowdfunded Typescript library intended for developers interested in applications requiring capabily ranging from traditional computer science (data structures and semi-numerical algorithms) to applied mathematics, science, engineering, and business decision analytics.  The library is authored by [Jim Armstrong](https://www.linkedin.com/in/jimarmstrong/).  Mr Armstrong recently retired after nearly 37 years of bridging the gap between applied mathematics and software engineering.  His career began writing assembly-language math libraries for supercomputers.  During this time, he published original research in refereed journals and worked on solution capability for industries including signal processing, finite-element modeling, crash simulation, geophysics, financial modeling, and transportation, just to name a few.

After a 12-year career in the high-performance computing industry, Mr. Armstrong ran a consulting business until 2021 at which time he retired from day-to-day software development.  His development experience spans (RISC) assembler, Basic, Fortran, C, C++, some Java, JavaScript, DHTML, ActionScript, Flash, Flex, Typescript and modern Angular.  In 2004, he began to collect frequently re-used ActionScript code into a formal library for use in client projects.  That library grew until for over ten years until he fully transitioned to modern JavaScript and TypeScript.  The library was ported and enhanced to become the JavaScript Math Toolkit, which was open-sourced in late 2016.  The JavaScript Math Toolkit was enhanced with a great deal of new code and ported to become the TypeScript Math Toolkit (TSMT).  Some of the TSMT code was open-sourced from 2016 to 2021.  During that time, Mr. Armstrong enhanced his private, client-only library to become the Angular Dev Toolkit (ADT).  The ADT contains over 120,000 lines of code of which the TSMT is a subset.

Mr. Armstrong's current goal is to release a complete TypeScript library containing not only the ADT, but over 200,000 lines of code developed in other languages that has not yet been ported to any modern web language.  The use of TypeScript allows Angular, React, Vue, Svelt, Node JS, and Nest JS developers to exploit the library's contents.

But yes, there is a catch.  Writing code, assembling a library, writing test cases, and maintaining minimal documentation is an extraordinarily time-consuming task.  The level of effort is such that it can not be done on an occasional or part-time basis.  This work is best performed at a constant pace, even if it is just a handful of hours each week.  Unfortunately, the work can not be done for free as Mr. Armstrong engages in side-gigs to pay the bills.  While he is willing to devote the overwhelming majority of the effort free of charge, some continual funding is required to support the development effort.

# BUY SOME COFFEE

Supporting the development of _AMYR_ does not have to break the bank.  Mr. Armstrong [currently accepts donations via Ko-Fi](https://ko-fi.com/thealgorithmist). 

One cup of coffee is a measly three bucks :)  How much value could you obtain from a single data structure, or some code to solve an important math problem that has halted progress on an important task?  It only takes a modest number of developers buying one cup a month to facilitate a massive influx of code to this library.  And, if you are a bit hesitant, make an argument to your boss to buy some for the benefit of the entire team.

The way this works is really simple: coffee -> code.  If you want more code, it takes more coffee.  Nearly 300,000 lines of code are waiting to be ported, then documented and released.  All code released in _AMYR_ is open source and **free** for commercial use!

So, please [buy a cup (or two ... or three) today](https://ko-fi.com/thealgorithmist)!

# CORPORATE SPONSORS

Want to showcase your company (with a link back) as a supported of _AMYR_?  All it takes is 50 cups to get your name in lights and show your support in a major way.  Your input in terms of library direction also carries the most weight in terms of subsequent releases. 

# INDIVIDUAL SPONSORS

What to show your support (with a link to your website or LinkedIn/social media)?  All it takes is 15 cups and you will be right here!

# WHAT'S IN A NAME?

"Why _AMYR_?  The name goes back to my college experience and a conversation about band names one evening in the dorm lounge.  One of my friends told a story about how he would name a band.  The story is too long to repeat here, but it was an interesting experience by a group of teenagers and a Chevy Camaro.  The 'Camaro' marking on the side had been previously damaged in a side-swipe.  The 'C' and 'o' were missing and the last 'a' was streaked to look like a 'y'.  So, the marking on the side of the car looked like the Chevy 'amyr'.  This lead to a unique adventure; think of 'Vger' from 'Star Trek The Motion Picture'.  My friend said if he ever formed a band, he would name it _AMYR_.  The _AMYR_ is an order featured in the KingKiller Chronicles.  Their creed is 'for the greater good.'  While I have no interest in KingKiller, I thought the motto was fitting.  That's what this library is all about - all of us together, working for the greater good. I hope you see fit to support the effort."

- Jim Armstrong

# ORGANIZATION

The _AMYR_ library is organized into folders underneath _/libs/anyr-ts-lib/src/lib_.  The current folder organization mirrors the _Angular Dev Toolkit_, although it will be expanded in the future.  Most of the folders are empty and it will take coffee to fill them :)

Each folder has its own Readme file that describes currently available content.  (C) means that code in that folder is complete, meaning on par with the ADT.  (N) means that new content beyond that existing in the ADT has been added to the folder. (P) means partial content (relative to the ADT).  (E) means the folder is currently empty, i.e. ADT code has yet to be moved into _AMYR_.  That requires some more coffee!!

The current layout of _AMYR_ is as follows:

Version: 0.0.7

* **[core](/libs/amyr-ts-lib/src/lib/core#readme) (core capability for the entire library) - P**
* dataviz (data visualization support libraries) - E
* libs
    * **[ai](/libs/amyr-ts-lib/src/lib/libs/ai/Readme.md) (low-level libs to support various AI applications) - P**
    * barcode (dynamic barcode creators) - E
    * composable (for FP devotees - single-line, composable functions) - E
    * **expression-engine (evaluate general expressions in infix notation - return number/string/boolean) - C**
    * function-graph (function graphing engine) - E
    * **function-parser (parse and evaluate functions of multiple variables in infix notation) - C**
    * **[functional-programming](/libs/amyr-ts-lib/src/lib/libs/functional-programming#readme) (compact, pure functions for use in FP applications) - P**
    * kinematics (2D forward/inverse kinematics library) - E
    * lazy-load (lazy-load JS and CSS files) - E
    * **misc (because it doesn't fit anywhere else) - P**
    * paging (libraries to support dynamic paging of content) - E
    * profiles (libraries supporting operation on multi-valued time-series) - E
    * search (search functions)
    * **sorting (sort functions) - P**
    * **[TypeScript Math Toolkit](/libs/amyr-ts-lib/src/lib/libs/tsmt/Readme.md) - P**
    * validation (validator functions) - E
    * utils (general utilities) - E
- **models (interfaces and data models used by _AMYR_) - P**

More folders may be added in the future, depending on how the community wishes to direct the course of development.

# TESTS

Unit test are written in jests and can be run from the command line (from the top-level project folder.) For example,

_npm run test:tsmt:avltree_ runs unit tests for the TSMT AVL Tree (binary tree) data structure and its supporting classes and libraries.

Available tests can currently be referenced from the _package.json_ file.  They will be more fully documented in a future release.

Unit tests serve as a rich source of examples for using code in the _AMYR_ library.

# IMPORTS

_AMYR_ is organized in a monorepo using the _Nx_ library, which is organized under the _algorithmist_ name space.  See _/src/app/app.component.ts_ for example imports.  For example, to import the TSMT Avl Tree,

```angular
import { TSMT$AVLTree } from '@algorithmist/amyr-ts-lib';
```

# NX
This project was generated using [Nx](https://nx.dev).

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

🔎 **Smart, Fast and Extensible Build System**

## Quick Start & Documentation

[Nx Documentation](https://nx.dev/angular)

[10-minute video showing all Nx features](https://nx.dev/getting-started/intro)

[Interactive Tutorial](https://nx.dev/tutorial/01-create-application)

## Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are our core plugins:

- [Angular](https://angular.io)
  - `ng add @nrwl/angular`
- [React](https://reactjs.org)
  - `ng add @nrwl/react`
- Web (no framework frontends)
  - `ng add @nrwl/web`
- [Nest](https://nestjs.com)
  - `ng add @nrwl/nest`
- [Express](https://expressjs.com)
  - `ng add @nrwl/express`
- [Node](https://nodejs.org)
  - `ng add @nrwl/node`

There are also many [community plugins](https://nx.dev/community) you could add.

## Generate an application

Run `ng g @nrwl/angular:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `ng g @nrwl/angular:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are shareable across libraries and applications. They can be imported from `@algorithmist/mylib`.

## Development server

Run `ng serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng g component my-component --project=my-app` to generate a new component.

## Build

Run `ng build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev/angular) to learn more.

## ☁ Nx Cloud

### Distributed Computation Caching & Distributed Task Execution

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-cloud-card.png"></p>

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.

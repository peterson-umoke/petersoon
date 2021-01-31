# Marketplace

The user facing front-end app for advertisers using Blip.

# Developing

This project was generated with [Angular CLI](https://github.com/angular/angular-cli).
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# Getting Started

To get started locally, follow these instructions:

1. Install the Angular CLI `$ npm install -g @angular/cli`.
1. Clone to your local computer using `git`.
1. Make sure that you have Node 8 or later installed. See instructions [here](https://nodejs.org/en/download/). The Angular CLI requires Node 8.
1. Make sure that you have `yarn` installed; see instructions [here](https://yarnpkg.com/lang/en/docs/install/).
1. Make sure yarn is set to be the default package manager for the Angular CLI by running `ng config -g cli.packageManager yarn`
1. Run `yarn` (no arguments) from the root of your clone of this project.
1. Run `yarn start:dev` or `yarn start` as explained in the following section.

# Environments

The Angular CLI is flexible in running against multiple different environments. For developing purposes, we have a development environment already set up to accept incoming API calls from your local environment. This will help in faster development as the environment is already set up and will not have to be maintained locally by you.

To run your code locally against our devlopment environment run:

`$ yarn start:dev`

Otherwise, to run your code against your local environment run:

`yarn start`

# Conventional Commits

Please adhear to the conventional commit system when contributing to this project. Below is a list of example types for this project.

## Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

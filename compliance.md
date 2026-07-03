# Open Source Software Licence Compliance Note

The BIS has independently authored the software program: `sdmx-rest4js`. It relies on multiple third-party software modules listed in `package-lock.json`.

`sdmx-rest4js` is licensed under the Apache License Version 2.0 and is therefore provided with no warranty. To comply with the terms of the licences covering the third-party components, `sdmx-rest4js` must be installed with the considerations below, any other installation method may not be compliant with the relevant third-party licences.

## Installation considerations

For a licence compliant installation, `sdmx-rest4js` must be installed using the package installer for Node (npm). An example installation command is:

`npm install sdmx-rest`

## Further information

1. Use `npm ci` with a committed `package-lock.json`.
2. Use `overrides` in `package.json` for any transitive dependency that must be fixed to a specific version.

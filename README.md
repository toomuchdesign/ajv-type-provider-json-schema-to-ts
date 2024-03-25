# Project name

[![Build Status][ci-badge]][ci]
[![Npm version][npm-version-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

## Setup after fork

- Fill `package.json` file with relevant fields
- Enable [Changesets bot](https://github.com/changesets/bot)

### GitHub access tokens

Add `READ_AND_WRITE_TOKEN` token:

- Add the new repo to the `Read and write content` access token in: `User settigns` > `Developer Settings`
- Create a `READ_AND_WRITE_TOKEN` secret for both `actions` and `dependabot` in `Repo settings` > `Secrets and variables` with the value of `Read and write content` access token

Give `GITHUB_TOKEN` write permissions (for Coveralls to comment PRs):

- `Repo settigns` > `Actions` > `General` > `Workflow permissions` > `Read and write permissions`

## Contributing

Any contribution should be provided with a `changesets` update:

```
npx changeset
```

[ci-badge]: https://github.com/toomuchdesign/npm-package-template/actions/workflows/ci.yml/badge.svg
[ci]: https://github.com/toomuchdesign/npm-package-template/actions/workflows/ci.yml
[coveralls-badge]: https://coveralls.io/repos/github/toomuchdesign/npm-package-template/badge.svg?branch=master
[coveralls]: https://coveralls.io/github/toomuchdesign/npm-package-template?branch=master
[npm]: https://www.npmjs.com/package/npm-package-template
[npm-version-badge]: https://img.shields.io/npm/v/npm-package-template.svg

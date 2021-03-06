# MDB Content Identification Tool

## Overview

An embeddable js library for identifying content based on data from [MDB](https://github.com/Bnei-Baruch/mdb).

This is a simple react js widget to be consumed, easily, from any web page.


## Example

See an [example](http://app.mdb.bbdomain.org/_tools/cit/example.html) on how to use this widget


## Semantic UI

We use the build taks provided by the framework tobuild our own slim, rtl,
version of the [Semantic UI](https://semantic-ui.com/) css framework.

To produce a new build see [Semantic-UI Build Tools](https://semantic-ui.com/introduction/build-tools.html).


## Notes:

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

We've ejected to add a new webpack entry for the wrapper.

After ejecting we've created a new webpack config for the wrapper and use it in `scripts/build.js`.



## Contributing

Develop your feature locally and submit a pull request.

Make sure you have [Node.js](https://nodejs.org) and [Yarn](https://yarnpkg.com/) installed. Then:

1. Clone this repo
```shell
$ git clone https://github.com/Bnei-Baruch/mdb-cit.git
```

2. Install all dependencies
```shell
$ cd kmedia-mdb
$ yarn install
```

3. Configure environment
```shell
$ cp .env.sample .env
```
Open `.env` in your favorite editor and set all variables to their appropriate values.


4. Run dev server
```shell
$ yarn start
```


## License

MIT
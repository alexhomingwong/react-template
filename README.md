# How to set up React with Babel, Webpack

## Content

- [Setting up](#setting-up-the-project)
  - [Webpack](#basic-webpack-configuration)
    - [Purpose](#webpack-purpose)
    - [Installation](#adding-webpack)
  - [Babel](#basic-babel-configuration)
    - [Purpose](#purpose-of-babel)
    - [Installation](#adding-babel-7)
  - [Webpack & babel](#webpack-and-babel)
  - [React](#react)
  - [Source map](#source-map)
  - [Hot reloading](#hot-reloading)
- [Typescript](#typescript)
  - [Installation](#installing-typescript)
  - [Linting](#linting)
  - [Absolute imports](#absolute-imports)

## Setting up the project

First create a package.json file, either manually or using the command `npm init`.

We are going to use this folder structure for this setup:

```
Root
├─> dist  # Where the compiled files will live
├─> src  # Where the app files will live
│  └─> components/  # For the react components - use atomic structure
│  └─> index.js
├ package.json
```

### Basic webpack configuration

#### Webpack purpose

Webpack is used to help bundle all our application code into a few files so that it will be easily read for web browsers. It will also help minify our code to help make it load faster, such as stripping out unnecessary spaces, and renaming variable names with shorter words.

Additional reading on webpack:

- https://levelup.gitconnected.com/what-is-webpack-4fdb624597ae

#### Adding webpack

Add webpack and webpack-cli to our project. These are the core two packages needed to get webpack to run.

```bash
yarn add --dev webpack webpack-cli
```

#### Understanding webpack.config

Webpack is can be overwhelming at first, so I will only explain the config file a bit at a time. Initially, to get it started you only need the `entry` and `output` option.

- `entry` is where you specify the file for webpack to bundle. It will also bundle
- `output` is where webpack will place the new bundled file

Both these option can be passed additional options which you can find in the webpack documentation.

#### Configuring webpack

All webpack configuration is in the `webpack.config.js` file. Initialise the config file like below:

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
};
```

To test that it is working, add a build command in the `package.json` file.

```json
{
    ...,
    "scripts": {
        ...,
        "build": "webpack"
    }
}
```

This should now create the `dist/index.js` file as specified in the webpack config.

### Basic babel configuration

#### Purpose of babel

Babel is a compliler. This means that it will convert the code you write to another specified format. In this project use case, it will covert the typescript/react syntax to vanilla JS syntax. This will mean that if we choose to use ES6 syntax from the later JS versions, older browsers will still be able to read it as it will have been compiled to vanilla JS.

Additional reading on babel:

- https://medium.com/@onlykiosk/complete-babel-7-guide-for-beginners-in-2019-7dd78214c464

#### Adding babel 7

Babel 7 is the latest babel version when writing this tutorial, and it has many scoped packages which makes it easier to get the correct packages.

Lets first get the core packages for babel 7 that we will need for this react project.

```bash
yarn add --dev @babel/core @babel/cli @babel/preset-env @babel/preset-react
```

##### Breakdown of packages

- @babel/core and @babel/cli are the main packages for babel to run.
- @babel/preset-env is to compile the latest javascript syntax
- @babel/preset-react is to compile the react syntax

##### Understanding .babelrc

Babel configuration is usually placed in the `.babelrc` file and the config is split into 2 sections, **plugins** and **presets**.

**Plugins** help babel with the compilation. It will tell babel how to convert certain syntax to another format. Each plugin handles a specific compilation. For example, _@babel/plugin-transform-arrow-functions_ help turns arrow syntax ,`() => {}`, to the normal function syntax, `function(){}`.

**Presets** are basically many plugins bundled together. This is to help save time and also to reduce the file complexity.

##### Configuring Babel

We will place the babel configuration in the `.babelrc` file of root directory. The initial configuration will look like below:

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

### Webpack and babel

With both webpack and babel setup, we need the two of them to work together. Babel will compile the react syntax and then webpack will bundle that into a minified js file for the browsers to read.

Webpack by default knows how to bundle `.js` and `.json` files right out the box but will require loaders for handling other files, such as `.html` or `.css`. To add a loader you add a `module` field to the `webpack.config.js`, and specify a rule which states what loader to use for which file extensions. The below example would use the `html-loader` for `.html` files.

```js
module.exports = {
    ...,
    module: {
        rules: [
            { test: /\.html$/, loader: 'html-loader }
        ]
    }
}
```

Webpack understands `.js` files but due to the react syntax, we will need to use the babel loader to compile the react syntax before webpack touches it. First install babel loader:

```bash
yarn add --dev babel-loader
```

In the webpack config add `babel-loader` for `.js` and `.jsx` files; we will also add an option to exclude all `node_modules` files as the packages will be added separately.

```js
module.exports = {
    ...,
    module: {
        rules: [
            { test: /\.js|x$/, loader: "babel-loader", exclude: /node_modules/ },
        ]
    }
}
```

### React

With the basics of webpack and babel now sorted, we can look to add React to our project and render ourselves a webpage. Add `react` and `react-dom` to our dependencies.

```bash
yarn add react react-dom
```

Now lets add a simple react file, to see if our project is wired up correctly. In the `/src` directory, add an `index.js`.

```js
import React from "react";
import ReactDOM from "react-dom";

const App = () => {
  return <div>Luffy will be pirate king!</div>;
};

ReactDOM.render(<App />, document.getElementById("root"));
```

Webpack will generate a new minified `.js` file of our code but react also requires a `.html` file to render the components too. Above, we are looking for a `div` with an id `root`, so we can create a `.html` file and then place it into the `/dist/` folder, but there is a much more automatic approach. Webpack has plugins which we can take advantage of.

Add the `html-webpack-plugin`.

```bash
yarn add --dev html-webpack-plugin
```

This plugin will automatically create a html page in our bundle and also link our js file to it. We will create a html file for this plugin to use as a template. The plugin accepts quite a few different options, but to start the project we only need to specify the template file.

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    ...,
    plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
    }),
  ]
}
```

Now run `yarn build` and you should see it output a `/dist` folder with the html and js file. Open the html file in your preferred browser and you should see the text on the page.

### Source map

When we bundle our code, it makes it difficult to debug as the file will no longer be human readable with no spaces, and variables being renamed. To ease debugging, we will add a source map provided by webpack. In the webpack config file, add:

```js
module.exports = {
    ...,
    devtool: "cheap-eval-source-map",
}

```

There are different values you can pass to devtool which you can find in the webpack documentation: https://webpack.js.org/configuration/devtool/

### Hot reloading

It will be a pain, when developing, if you had to manually run `yarn build` and open the file in the browser every time you make a change. So to make the development process easier, we will add hot reloading. Lucky for us, webpack once again has a great plugin to aid us in this called, `webpack-dev-server`.

```bash
yarn add --dev webpack-dev-server
```

There are many options you can pass to webpack dev server but we will add the basic three, `port`, `hot` and `overlay`. You can find the other options here: https://webpack.js.org/configuration/dev-server/.

- `port` is the localhost port number
- `hot` is to toggle the hot reloading
- `overlay` will place an overlay when there are compilation errors

```js
module.exports = {
    ...,
    devServer: {
        port: 3000,
        hot: true,
        overlay: true,
    }
}
```

With this package, we can now run a dev server and anytime there are changes it will automatically recompile the new code and display it. Add the new command to the `package.json` and then run it.

```json
{
    ...,
    "scripts": {
        ...,
        "start": "webpack-dev-server",
    },
}
```

## Typescript

With the above setup, you will have the basics of a React project. You can start adding testing and styling libraries; however, for larger projects you may want to add typescript.

Typescript itself is a compiler which means we can replace babel; however, babel has a typescript preset which we can use. There are benefits of using babel with typescript, but the main one is that babel is already set up in this project, so we might as well stick with it.

### Installing typescript

First lets add the babel plugins needed for compiling typescript.

`yarn add --dev @babel/preset-typescript @babel/plugin-proposal-class-properties @babel/plugin-proposal-object-rest-spread`

Then update the config in the `.babelrc`.

```json
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript"
  ],
  "plugins": [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread"
  ]
}
```

Now add typescript and a `tsconfig.json` in the root directory. the `tsconfig.json` can be quite difficult to understand, but below are some of the basic settings which will get typescript to work. You can look to customise it more for your own project. The typescript documentation can be found here: https://www.typescriptlang.org/tsconfig.

```bash
yarn add --dev typescript
```

```json
{
  "compilerOptions": {
    "target": "esnext",
    "moduleResolution": "node",
    "allowJs": true,
    "noEmit": true,
    "strict": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "jsx": "react",
    "noImplicitAny": true
  },
  "include": ["src"]
}
```

Before we can refactor our js files to typescript, we will need to get the types for the react modules. Then refactor the `src/index.js` into a separate `src/App.tsx` and a `src/index.ts`.

```bash
yarn add --dev @types/react @types/react-dom
```

```ts
// src/App.tsx
import React from "react";

const App: React.FC = () => <div>Luffy will be pirate king!</div>;

export default App;
```

```ts
// src/index.tsx
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));
```

Now we will need to edit our webpack to look for `.ts` and `.tsx` files. Furthermore, we need webpack to automatically resolve to `.ts` and `.tsx` files when importing.

```js
module.exports = {
  ...,
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: {
      { test: /\.ts|x$/, loader: "babel-loader", exclude: /node_modules/ },
    }
  }
}
```

One last thing, we need make the hot reloading work with typescript. To get it to work, we will need to download a separate plugin for webpack, `fork-ts-checker-webpack-plugin`.

```js
const ForkTSCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  ...,
  plugins: {
    ...,
    new ForkTSCheckerWebpackPlugin({
      tsconfig: path.resolve(__dirname, "tsconfig.json"),
      async: false,
      checkSyntacticErrors: true,
    }),
  },
}
```

### Linting

ESLint now has support for typescript which makes things a lot easier. We will need to add the following dependencies to the project:

```bash
yarn add --dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react
```

The linting rules are then placed in the `.eslintrc` file. ESLint will require a parser to read the code which we will be using `@typescript-eslint/parser`, and then instead of specifying each rule we want to use, we can have ESLint extend a set of given rules. We will be basing our project off of the `@typescript-eslint/eslint-plugin` and the `eslint-plugin-react`.

```json
{
  "parser": "@typescript-eslint/parser", // Specify the parser
  "extends": [
    "plugin:react/recommended", // Use React recommended rules
    "plugin:@typescript-eslint/recommended" // Use Typescript recommended rules
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true // Allow JSX
    }
  },
  "rules": {
    // Overwrite rules here
  },
  "settings": {
    "react": {
      "version": "detect" // Auto detect React version
    }
  }
}
```

Now lets add prettier to help better format the code.

```bash
yarn add --dev prettier eslint-config-prettier eslint-plugin-prettier
```

Add a `.prettierc` file for the prettier config. Below is a simple example of some prettier settings.

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 120,
  "tabWidth": 2
}
```

With prettier we will need to update the eslint config.

```json
{
  "parser": "@typescript-eslint/parser", // Specify the parser
  "extends": [
    "plugin:react/recommended", // Use React recommended rules
    "plugin:@typescript-eslint/recommended", // Use Typescript recommended rules
    "prettier/@typescript-eslint", // This will disable conflicting rules between typescript and prettier
    "plugin:prettier/recommended" // Shows prettier errors as eslint error. Make sure this is always the last configuration in the extends array.
  ],
  "parserOptions": {
    "ecmaVersion": 2018, // Allows for the parsing of modern ECMAScript features
    "sourceType": "module", // Allows for the use of imports
    "ecmaFeatures": {
      "jsx": true // Allow JSX
    }
  },
  "rules": {
    // Overwrite rules here
  },
  "settings": {
    "react": {
      "version": "detect" // Auto detect React version
    }
  }
}
```

This article has a great explanation on setting up eslint, prettier for a Typescript React project in VSCode, https://www.robertcooper.me/using-eslint-and-prettier-in-a-typescript-project.

### Absolute imports

Relative imports can get very messy in a large project. To combat this, we can create some custom absolute imports. When we create the custom absolute imports, we will need to let babel and typescript know what these custom imports really map too.

First configure typescript config by adding a `paths` field with the custom imports. You will need to `*` to match all files in that directory. Note, be careful that your custom imports do not conflict with any modules that may come from `node_modules`.

```json
{
  ...,
  "compilerOptions":{
    "baseUrl": ".",
    "paths": {
      // custom paths go here
      "@/components/*": ["src/components/*"]
    }
  }
}
```

Then we will need to add a plugin for babel.

```bash
yarn add --dev babel-plugin-module-resolver
```

In the `.babelrc`, add the same custom imports but note that the `*` is not needed.

```json
{
  "plugins": [
    [
      "module-resolver",
      {
        "alias": {
          // Add custom imports here
          "@/components": "./src/components"
        }
      }
    ]
  ]
}
```

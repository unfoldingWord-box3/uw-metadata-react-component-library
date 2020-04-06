const path = require('path');
const upperFirst = require('lodash/upperFirst');
const camelCase = require('lodash/camelCase');
const {
  name, version, repository,
} = require('./package.json');
const { styles, theme } = require('./styleguide.styles');

const sections = [
  {
    name: 'README',
    content: 'README.md',
  },
  {
    name: 'Hello DCS',
    components: "src/components/hello-dcs/HelloDcs.js",
  },
  {
    name: 'Repo Search',
    content: 'src/components/repo-search/RepoSearch.md',
  },
];

module.exports = {
  title: `${upperFirst(camelCase(name))} v${version}`,
  // ribbon: {
  //   url: repository.url,
  //   text: 'View on GitHub',
  // },
  styles,
  theme,
  getComponentPathLine: (componentPath) => {
    const file = componentPath.split('/').pop();
    const component = file.split('.').shift();
    const componentName = upperFirst(camelCase(component));
    return `import { ${componentName} } from "${name}";`;
  },
  usageMode: 'expand',
  exampleMode: 'expand',
  pagePerSection: true,
  sections,
  components: 'src/components/**/[A-Z]*.js',
  moduleAliases: { 'hello-dcs-react-component-library': path.resolve(__dirname, 'src') },
  version,
  // webpackConfig: require( 'react-scripts/config/webpack.config' ),
  webpackConfig: {
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader',
        },
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: { transpileOnly: true },
            },
          ],
        },
      ],
    },
  },
};

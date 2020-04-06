## Hello DCS - Readme

The below gets the README.md file from [https://bg.door43.org/hello-dcs/hello-world](https://bg.door43.org/hello-dcs/hello-world)

```js
import { useContext } from 'react';
import { Paper } from '@material-ui/core';
import {
  AuthenticationContextProvider,
  RepositoryContextProvider,
  RepositoryContext,
  FileContextProvider,
  FileContext,
} from 'gitea-react-toolkit';

const [repository, setRepository] = React.useState();
const [file, setFile] = React.useState();

<AuthenticationContextProvider>
  <RepositoryContextProvider
    full_name='hello-dcs/hello-world'
    repository={repository}
    onRepository={setRepository}
    config={ {
      server: "https://bg.door43.org",
      tokenid: "PlaygroundTesting",
    }}
    branch='master'
  >
    <FileContextProvider
      filepath= 'README.md'
      file={file}
      onFile={setFile}
    >

      <HelloDcs />

    </FileContextProvider>
  </RepositoryContextProvider>
</AuthenticationContextProvider>
```

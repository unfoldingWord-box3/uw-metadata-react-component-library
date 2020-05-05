## Metadata Editor - Repo and File selector (no login)

```js
import { useContext } from 'react';
import { Paper } from '@material-ui/core';
import {
  AuthenticationContext,
  AuthenticationContextProvider,
  RepositoryContext,
  RepositoryContextProvider,
  FileContextProvider,
} from 'gitea-react-toolkit';

const [authentication, setAuthentication] = React.useState();
const [repository, setRepository] = React.useState();
const [filepath, setFilepath] = React.useState();
const [file, setFile] = React.useState();

<AuthenticationContextProvider>
  <RepositoryContextProvider
    defaultQuery='scripture-burrito-examples'
    defaultOwner='richmahn'
    repository={repository}
    onRepository={setRepository}
        config={{
      server: "https://git.door43.org",
      tokenid:"PlaygroundTesting",
    }}
  >
    <FileContextProvider
      filepath={filepath}
      onFilepath={setFilepath}
      file={file}
      onFile={setFile}
      create={false}
    >
      <MetadataEditor />
    </FileContextProvider>
  </RepositoryContextProvider>
</AuthenticationContextProvider>
```

### Metadata Editor - Repo and File selector (login)

```js
import { useContext } from 'react';
import { Paper } from '@material-ui/core';
import {
  AuthenticationContext,
  AuthenticationContextProvider,
  RepositoryContext,
  RepositoryContextProvider,
  FileContextProvider,
} from 'gitea-react-toolkit';

const [authentication, setAuthentication] = React.useState();
const [repository, setRepository] = React.useState();
const [filepath, setFilepath] = React.useState();
const [file, setFile] = React.useState();

<AuthenticationContextProvider
    authentication={authentication}
    onAuthentication={setAuthentication}
    config={{
      server: "https://git.door43.org",
      tokenid:"PlaygroundTesting",
    }}
>
  <RepositoryContextProvider
    defaultQuery='scripture-burrito-examples'
    defaultOwner='richmahn'
    repository={repository}
    onRepository={setRepository}
  >
    <FileContextProvider
      filepath={filepath}
      onFilepath={setFilepath}
      file={file}
      onFile={setFile}
      create={false}
    >
      <MetadataEditor />
    </FileContextProvider>
  </RepositoryContextProvider>
</AuthenticationContextProvider>
```

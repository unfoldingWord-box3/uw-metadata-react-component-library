### Metadata Editor

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
    full_name='richmahn/scripture-burrito-examples'
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

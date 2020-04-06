### Metadata Editor

```js
import { useContext } from 'react';
import { Paper } from '@material-ui/core';
import {
  AuthenticationContext,
  AuthenticationContextProvider,
  RepositoryContext,
  RepositoryContextProvider
} from 'gitea-react-toolkit';

const [authentication, setAuthentication] = React.useState();
const [repository, setRepository] = React.useState();

<AuthenticationContextProvider
  authentication={authentication}
  onAuthentication={setAuthentication}
  config={ {
    server: "https://bg.door43.org",
    tokenid:"PlaygroundTesting",
  }}
  >
  <RepositoryContextProvider
    full_name='unfoldingword/en_ta'
    repository={repository}
    onRepository={setRepository}
    branch='master'
  >
    <MetadataEditor />
  </RepositoryContextProvider>
</AuthenticationContextProvider>
```

import React, { useContext } from 'react';
import {
  AuthenticationContext,
  RepositoryContext,
} from 'gitea-react-toolkit';

function MetadataEditor() {
  const { state: auth, component: authComponent } = useContext(AuthenticationContext);
  const { state: repo, component: repoComponent } = useContext(RepositoryContext);

  return (!auth && authComponent) || (!repo && repoComponent) || <pre>{JSON.stringify(repo, null, 2)}</pre>;
};

export default MetadataEditor;

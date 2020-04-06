import React, {useContext} from 'react';
import {
  RepositoryContext,
  FileContext,
} from 'gitea-react-toolkit';

function HelloDcs() {
  const { state: repo, component: repoComponent } = useContext(RepositoryContext);
  const { state: file, component: fileComponent } = useContext(FileContext);

  return (!repo && repoComponent) || fileComponent;
};

export default HelloDcs;

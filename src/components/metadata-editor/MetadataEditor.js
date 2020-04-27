import React, { useContext, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, Avatar } from '@material-ui/core';
import { getMetadataFormData, getScriptureBurritoSchema, getScriptureBurritoUISchema } from './helpers';
import {
  AuthenticationContext,
  RepositoryContext,
  FileContext,
} from 'gitea-react-toolkit';
import Form from 'react-jsonschema-form';

function MetadataEditor() {
  const { state: auth, component: authComponent, config } = useContext(AuthenticationContext);
  const { state: repo, component: repoComponent } = useContext(RepositoryContext);
  const { state: file, component: fileComponent } = useContext(FileContext);

  const [res, setVal] = useState(<div class="loading">Loading...</div>);

  useEffect(() => {
    const populateForm = async () => {
      let formData = {};
      if (repo && file) {
        let formData;
        try {
          formData = await getMetadataFormData({ config, repository: repo, file });
          console.log('formData:', formData);
        } catch (error) {
          setVal(
            <div>
              {error.message}
            </div>
          )
        }

        const sbSchema = await getScriptureBurritoSchema();
        const uiSchema = await getScriptureBurritoUISchema();

        setVal(
          <Card>
            <CardHeader
              avatar={<Avatar src={repo.owner.avatar_url} />}
              title={repo.full_name}
            />
            <CardContent>
              <Form
                schema={sbSchema}
                formData={formData}
                uiSchema={uiSchema}
                onChange={log('changed')}
                onSubmit={log('submitted')}
                onError={log('errors')} />
            </CardContent>
          </Card>
        );
      }
    };
    populateForm();
  }, [config, repo, file]);

  // (!auth && authComponent) ||
  return (!repo && repoComponent) ||
    (!file && <div><div>Select a metadata file</div>{fileComponent}</div>) ||
    res;
};

const log = (type) => console.log.bind(console, type);

export default MetadataEditor;


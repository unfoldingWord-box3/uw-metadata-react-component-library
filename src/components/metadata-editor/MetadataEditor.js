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
  const { state: auth, component: authComponent } = useContext(AuthenticationContext);
  const { state: repo, component: repoComponent, config } = useContext(RepositoryContext);
  const { state: file, component: fileComponent } = useContext(FileContext);

  const [res, setVal] = useState(<div class="loading">Loading Metadata Form and Populating Data...</div>);

  useEffect(() => {
    const populateForm = async () => {
      if (repo && file) {
        console.log("FILE:", file);
        console.log("CONFIG:", config);
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
                liveValidate={true}
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

  // if (!auth)
  //   return authComponent;
  // else
  if (!repo)
    return (
      <div>
        <div>Select repo with scripture burrito metadata</div>
        {repoComponent}
      </div>
    );
  else if (!file)
    return (
      <div>
        <div>Select a metadata file</div>
        {fileComponent}
      </div>
    );
  else
    return res;
};

const log = (type) => console.log.bind(console, type);

export default MetadataEditor;


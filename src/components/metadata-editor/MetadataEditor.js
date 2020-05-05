import React, { useContext, useEffect, useState } from 'react';
import { withTheme } from 'react-jsonschema-form';
import { Theme as MuiTheme } from 'rjsf-material-ui';
import {
    getMetadataFormData,
    getScriptureBurritoSchema,
    getScriptureBurritoUISchema,
} from './helpers';
import {
    AuthenticationContext,
    RepositoryContext,
    FileContext,
} from 'gitea-react-toolkit';

const Form = withTheme(MuiTheme);

function MetadataEditor() {
    const { state: auth, component: authComponent, config: authConfig } = useContext(AuthenticationContext);
    const { state: repo, component: repoComponent, config: repoConfig } = useContext(RepositoryContext);
    const { state: file, component: fileComponent } = useContext(FileContext);
    const [res, setVal] = useState(
        <div class="loading">Loading Metadata Form and Populating Data...</div>
    );

    let config = authConfig;
    if (!authConfig && repoConfig)
        config = repoConfig

    useEffect(() => {
        const populateForm = async () => {
            if (repo && file) {
                console.log('FILE:', file);
                console.log('CONFIG:', config);
                let formData;
                try {
                    formData = await getMetadataFormData({
                        config,
                        repository: repo,
                        file,
                    });
                    console.log('formData:', formData);
                } catch (error) {
                    setVal(<div> {error.message} </div>);
                }

                const sbSchema = await getScriptureBurritoSchema();
                const uiSchema = await getScriptureBurritoUISchema();

                console.log("SCHEMA:", sbSchema);

                console.log(JSON.stringify(sbSchema, null, 2));
                console.log(JSON.stringify(formData, null, 2));
                setVal(
                    <Form
                        schema={sbSchema}
                        formData={formData}
                        uiSchema={uiSchema}
                        liveValidate={true}
                        onChange={log('changed')}
                        onSubmit={log('submitted')}
                        onError={log('errors')}
                    />
                );
            }
        };
        populateForm();
    }, [config, repo, file]);

    if (authConfig && ! auth)
      return authComponent;
    if (! repo)
        return (
            <div>
                <div> Select repo with scripture burrito metadata </div> {repoComponent}{' '}
            </div>
        );
    else if (!file)
        return (
            <div>
                <div> Select a metadata file </div> {fileComponent}{' '}
            </div>
        );
    return res;
}

const log = (type) => console.log.bind(console, type);

const styles = theme => ({
    field: {},
    formButtons: {},
    root: {},
});

export default MetadataEditor;

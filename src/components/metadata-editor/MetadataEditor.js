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
    const [liveValidate, setLiveValidate] = useState(true);

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
                
                console.log("GENERATING FORM WITH LIVEVALIDATE:", liveValidate);
                setVal(
                    <div>
                        <div style={{marginBottom: '10px'}}>
                            <input type="checkbox" name="live-validate" checked={liveValidate} onChange={(event) => { console.log('CLICKED!', event.target.checked);setLiveValidate(event.target.checked) }}></input>
                            <label for="live-validate">Live Validate</label>
                        </div>
                        <Form
                            schema={sbSchema}
                            formData={formData}
                            uiSchema={uiSchema}
                            liveValidate={liveValidate}
                            onChange={log('changed')}
                            onSubmit={log('submitted')}
                            onError={log('errors')}
                        />
                    </div>
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

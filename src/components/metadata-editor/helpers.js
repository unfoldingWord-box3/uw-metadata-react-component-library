import { Api } from '../../core/getApi';
import yaml from 'js-yaml';
import Ajv from 'ajv';
import schemaIndex from '../../core/sb/schema/sbs_index.js';
import $RefParser from '@apidevtools/json-schema-ref-parser';


let myResolver = {
    order: 1,

    canRead: true,

    read(file, callback, $refs) {
        console.log("HERE: ", file.url);
        const schemaId = file.url.replace(/^.*\/\/[^\/]+/, 'https://burrito.bible/schema');
        console.log("HERE: ", file, $refs, schemaId);
        let schema = null;
        for (let i = 0; i < schemaIndex.schemas.length; i++) {
            // console.log(i, schemaIndex.schemas[i], schemaIndex.schemas[i].$id);
            if (schemaIndex.schemas[i].$id == schemaId) {
                console.log("FOUND!");
                schema = schemaIndex.schemas[i];
                break;
            }
        }
        if (schema)
            callback(null, schema);
        else
            callback(jsonKey + ' does not exist in available schemas.');
    }
};

export async function getScriptureBurritoSchema() {
    return await $RefParser.dereference("source_metadata.schema.json", { resolve: { json: myResolver } });
}

export async function getScriptureBurritoUISchema() {
    return {
        meta_url: { "ui:widget": "hidden" },
        meta_schema: { "ui:widget": "hidden" },
        scope_or_role: { "ui:widget": "hidden" },
    };
}

export async function getMetadataFormData({ config, repository, file }) {
    const api = new Api({ config, repository });
    console.log('API:', api);
    console.log('FILE:', file);
    console.log(repository);
    let metadataPath = './metadata.json';
    if (file) {
        metadataPath = file.path;
    }
    console.log('metadataPath:', metadataPath);
    try {
        let response = await api.getFile({ file: metadataPath });
        console.log('RESPONSE1', response);
        return response;
    }
    catch (error) {
        console.log(error);
        console.log('metadata.json does not exist? What if network problem? How to detect?');
        // TODO: Handle network issue rather than file not found
    }
    try {
        let response = await api.getFile({ file: 'manifest.json' });
        console.log('RESPONSE2:', response);
        const manifest = JSON.parse(response);
        return {
            lang_code: 'en',
            flavorType: {
                flavor: 'scriptureText',
                flavor_meta: {
                    books: [GEN, EXO, MAT, MRK]
                }
            },
            title: 'ult',
            meta_url: api.getFileUrl({ file: 'manifest.json' }),
            meta_schema: 'sb0.2.0',
            scope_or_role: 'GEN | EXO'
        };
    }
    catch (error) {
        console.log(error);
        console.log('manifest.json does not exist');
        // TODO: Handle network issue rather than file not found
    }
    try {
        let response = await api.getFile({ file: 'manifest.yaml' });
        console.log('RESPONSE3:', response);
        const manifest = yaml.safeLoad(response, 'utf8');
        return {
            lang_code: 'en',
            flavorType: {
                flavor: 'scriptureText',
                flavor_meta: {
                    books: ['GEN', 'EXO', 'MAT', 'MRK']
                }
            },
            title: 'ult',
            meta_url: api.getFileUrl({ file: 'manifest.yaml' }),
            meta_schema: 'sb0.2.0',
            scope_or_role: 'GEN | EXO'
        };
    } catch (error) {
        console.log(error);
        console.log('manifest.yaml does not exist');
        // TODO: Handle network issue rather than file not found
    }
    return null;
}

export async function validateFormData({ formData }) {
    const ajv = new Ajv({ schemas: schemaIndex.schemas });
    const schemaId = 'metadata';
    const validator = ajv.getSchema(schemaIndex.schemaIds[schemaId]);

    results = validator(formData);
    if (results) {
        console.log({
            schemaId,
            result: 'accepted',
        });
        return 'accepted';
    }
    console.log(JSON.stringify(validator.errors));
    console.log({
        schemaId,
        result: 'rejected',
        reason: 'SchemaInvalid',
        message: JSON.stringify(validator.errors),
        schemaErrors: validator.errors,
    });
    return validator.errors;
}

export async function validateFormDataRJF({ formData }) {
    const ajv = new Ajv({ schemas: schemaIndex.schemas });
    const schemaId = 'metadata';
    const validator = ajv.getSchema(schemaIndex.schemaIds[schemaId]);

    results = validator(formData);
    if (results) {
        console.log({
            schemaId,
            result: 'accepted',
        });
        return 'accepted';
    }
    console.log(JSON.stringify(validator.errors));
    console.log({
        schemaId,
        result: 'rejected',
        reason: 'SchemaInvalid',
        message: JSON.stringify(validator.errors),
        schemaErrors: validator.errors,
    });
    return validator.errors;
}

import Path from 'path';
import YAML from 'js-yaml-parser';
import localforage from 'localforage';
import { setup } from 'axios-cache-adapter';
import JSZip from 'jszip';

//import * as langnames from './langnames';

const DEFAULT_BRANCH = 'master';

export class Api {
  constructor({ config, repository }) {
    this.config = config;
    this.repository = repository;

    console.log("CONFIG2:", config);

    this.cacheStore = localforage.createInstance({
      driver: [localforage.INDEXEDDB],
      name: 'web-cache',
    });

    this._api = setup({
      baseURL: this.config.server,
      cache: {
        store: this.cacheStore,
        maxAge: 1 * 24 * 60 * 60 * 1000,
        exclude: { query: false },
        key: req => {
          // if (req.params) debugger
          let serialized = req.params instanceof URLSearchParams ?
          req.params.toString() : JSON.stringify(req.params) || '';
          return req.url + serialized;
        },
      },
    });    
  }

  async getFile({file, params}) {
    const uri = this.getFileUri({ file });
    return await this.get({uri, params});
  }

  getFileUri({ file }) {
    let branch = this.repository.branch;
    if (!branch) {
      branch = DEFAULT_BRANCH;
    }
    return Path.join(this.repository.owner.username, this.repository.name, 'raw/branch', branch, file);
  }

  getFileUrl({file}) {
    return Path.join(this.config.server,
      this.getFileUri({file}));
  }

  async get({uri, params}) {
    console.log("get() uri,params:",uri,params);
    const {data} = await this._api.get(uri, { params });
    return data;
  }
}
  
const baseURL = 'https://git.door43.org/';
const apiPath = 'api/v1';

const cacheStore = localforage.createInstance({
  driver: [localforage.INDEXEDDB],
  name: 'web-cache',
});

const zipStore = localforage.createInstance({
  driver: [localforage.INDEXEDDB],
  name: 'zip-store',
});

const api = setup({
  baseURL: baseURL,
  cache: {
    store: cacheStore,
    maxAge: 1 * 24 * 60 * 60 * 1000,
    exclude: { query: false },
    key: req => {
      // if (req.params) debugger
      let serialized = req.params instanceof URLSearchParams ?
      req.params.toString() : JSON.stringify(req.params) || '';
      return req.url + serialized;
    },
  },
});

export const resourceRepositories = ({languageId}) => {
  return {
    obs: languageId + '_obs',
    'obs-tn': languageId + '_obs-tn',
    'obs-tq': languageId + '_obs-tq',
    'obs-sn': languageId + '_obs-sn',
    'obs-sq': languageId + '_obs-sq',
    ult: languageId + '_ult',
    ust: languageId + '_ust',
    irv: languageId + '_irv',
    ulb: languageId + '_ulb',
    udb: languageId + '_udb',
    tn: languageId + '_tn',
    ta: languageId + '_ta',
    tw: languageId + '_tw',
    ugnt: 'el-x-koine_ugnt',
    uhb: 'hbo_uhb',
    ugl: languageId + '_ugl',
    uhal: languageId + '_uhal',
  };
};

export async function fetchResourceManifests({username, languageId}) {
  let manifests = {};
  const _resourceRepositories = resourceRepositories({languageId});
  const resourceIds = Object.keys(_resourceRepositories);
  const promises = resourceIds.map(resourceId => {
    const repository = _resourceRepositories[resourceId];
    const _username = ['ugnt','uhb'].includes(resourceId) ? 'unfoldingword' : username;
    return fetchManifest({username: _username, repository})
  });
  const manifestArray = await Promise.all(promises);
  resourceIds.forEach((resourceId, index) => {
    manifests[resourceId] = manifestArray[index];
  });
  return manifests;
};
/*
export async function getLanguages({username, resourceIds}) {
  const languageIds = await getLanguageIds({username, resourceIds});
  const languages = languageIds.map(languageId =>
    langnames.getLanguage({languageId})
  ).filter(language => !!language);
  languages.sort((a,b) =>
    (a.languageId > b.languageId) ? 1 : ((b.languageId > a.languageId) ? -1 : 0)
  );
  return languages;
};

export async function getLanguageIds({username, resourceIds}) {
  let languageIds = [];
  const promises = resourceIds.map(resourceId => {
    return getLanguageIdsByResource({username, resourceId});
  });
  const languageIdsArray = await Promise.all(promises);
  const _languageIds = languageIdsArray.flat();
  _languageIds.forEach(languageId => {
    const languageAdded = languageIds.includes(languageId);
    if (!languageAdded) languageIds.push(languageId);
  });
  return languageIds;
}

// /repos/search?q=ulb&uid=4598&limit=50&exclusive=true
export async function getLanguageIdsByResource({username, resourceId}) {
  let languageIds = [];
  const uid = await getUID({username});
  const params = {q: resourceId, uid, limit: 50, exclusive: true};
  const uri = Path.join(apiPath, `repos/search`);
  const repos = await get({uri, params});
  if (repos && repos.data) {
    languageIds = repos.data.map(repo => repo.name.split('_')[0]);
  }
  return languageIds;
};
*/
export async function fetchManifest({username, repository}) {
  console.log("fetchManafest: ", "uname=",username," repo=",repository)
  const yaml = await getFile({username, repository, path: 'manifest.yaml', branch: 'master'});
  const json = (yaml) ? YAML.safeLoad(yaml) : null;
  return json;
};

export async function fetchMetadata({username, repository}) {
  console.log("fetchMetadata: ", "uname=",username," repo=",repository)
  let json = await getFile({username, repository, path: 'metadata.json', branch: 'master'});
  json = (json) ? JSON.parse(json) : null;
  return json;
};

export async function gatherMetadata({username, repository}) {
  console.log("gatherMetadata: ", "uname=",username," repo=",repository)
  const manifest = await fetchManifest({username, repository});
  return manifest;
};

// https://git.door43.org/unfoldingword/en_ult/raw/branch/master/manifest.yaml
export async function fetchFileFromServer({username, repository, path, branch='master'}) {
  console.log("repo=",repository, " path=",path);
  const repoExists = await repositoryExists({username, repository});
  if (repoExists) {
    const uri = Path.join(username, repository, 'raw/branch', branch, path);
    try {
      console.log("URI=",uri);
      const data = await get({uri});
      return data;
    }
    catch(error) {
      return null;
    }
  } else {
    console.log("REPO does not exist!", repository)
    return null;
  }
};

export async function getFile({username, repository, path, branch}) {
  console.log("getFile(): path=",path," branch=",branch);
  const file = await fetchFileFromServer({username, repository, path, branch});
  return file;
}

export async function getUID({username}) {
  const uri = Path.join(apiPath, 'users', username);
  const user = await get({uri});
  const {id: uid} = user;
  return uid;
}
export async function repositoryExists({username, repository}) {
  const uri = Path.join(apiPath, 'repos', username, repository);
  const {data: repo} = await get({uri, params});
  console.log('repo:', repo);
  return !!repo;
};

export async function get({uri, params}) {
  console.log("get() uri,params:",uri,params);
  const {data} = await api.get(baseURL+uri, { params });
  return data;
};

export async function getURL({uri, params}) {
  //console.log("getURL() uri,params:",uri,params);
  const {data} = await api.get(uri, { params });
  return data;
};

export async function fetchRepositoriesZipFiles({username, languageId, branch}) {
  const repositories = resourceRepositories({languageId});
  const promises = Object.values(repositories).map(repository => {
    return fetchRepositoryZipFile({username, repository, branch});
  });
  const zipArray = await Promise.all(promises);
  return zipArray;
};

// https://git.door43.org/unfoldingWord/en_ult/archive/master.zip
async function fetchRepositoryZipFile({username, repository, branch}) {
  const repoExists = await repositoryExists({username, repository});
  if (!repoExists) {
    return null;
  }
  const uri = zipUri({username, repository, branch});
  const response = await fetch(uri);
  if (response.status === 200 || response.status === 0) {
    const zipArrayBuffer = await response.arrayBuffer(); // blob storage not supported on mobile
    await zipStore.setItem(uri, zipArrayBuffer);
    return true;
  } else {
    return false;
  }
};

async function getFileFromZip({username, repository, path, branch}) {
  console.log('getFileFromZip: username=', username, 'repository=', repository, 'path=', path, 'branch=', branch);
  let file;
  const uri = zipUri({username, repository, branch});
  console.log('zipUri: ', uri);
  const zipBlob = await zipStore.getItem(uri);
  console.log(zipBlob);
  try {
    if (zipBlob) {
      const zip = await JSZip.loadAsync(zipBlob);
      const zipPath = Path.join(repository.toLowerCase(), path);
      console.log('zipPath: ', zipPath);
      file = await zip.file(zipPath).async("string");
    }
  } catch(error) {
    console.log('ERROR in getting zip!!! ', error);
    file = null;
  }
  return file;
};

function zipUri({username, repository, branch='master'}) {
  const zipPath = Path.join(username, repository, 'archive', `${branch}.zip`);
  const zipUri = baseURL + zipPath;
  return zipUri;
};

// http://bg.door43.org/api/v1/repos/unfoldingword/en_ugl/git/trees/master
export async function fetchTree({username, repository, sha='master'}) {
  try {
    const uri = Path.join('api/v1/repos', username, repository, 'git/trees', sha);
    const data = await get({uri});
    const tree = JSON.parse(data);
    return tree;
  } catch(error) {
    return null;
  }
};

export async function recursiveTree({username, repository, path, sha}) {
  console.log("recurse tree args:",username,repository,path,sha)
  let tree = {};
  const pathArray = path.split();
  const results = fetchTree({username, repository, sha});
  const result = results.tree.filter(item => item.path === pathArray[0])[0];
  if (result) {
    if (result.type === 'tree') {
      const childPath = pathArray.slice(1).join('/');
      const children = recursiveTree({username, repository, path: childPath, sha: result.sha});
      tree[result.path] = children;
    } else if (result.type === 'blob') {
      tree[result.path] = true;
    }
  }
};

export async function fileExists({username, repository, path, branch}) {
  // get root listing
  recursiveTree({ username, repository, path, branch })
  // get recursive path listing
}

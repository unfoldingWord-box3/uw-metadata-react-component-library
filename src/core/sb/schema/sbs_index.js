const sb_index = require('./index.js');

schemaIds = sb_index.schemaIds;
schemaIds.config = 'https://burrito.bible/schema/store/config.schema.json';
schemas = sb_index.schemas;
schemas['config.schema.json'] = require('./config.schema.json');

module.exports = {
  schemaIds,
  schemas,
};

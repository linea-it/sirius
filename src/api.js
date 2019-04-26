import Lokka from 'lokka';
import Transport from 'lokka-transport-http';

const apiUrl =
  process.env.NODE_ENV === 'production'
    ? window._env_.REACT_APP_API_URL
    : process.env.REACT_APP_API_URL;

const client = new Lokka({
  transport: new Transport(apiUrl),
});

export default class Centaurus {
  static async getAllPipelinesTotalCount() {
    try {
      const pipelines = await client.query(`
        {
          pipelinesList {
            pageInfo {
              startCursor
              endCursor
            }
          }
        }
      `);
      return pipelines;
    } catch (e) {
      return null;
    }
  }

  static async getAllComponentsTotalCount() {
    try {
      const components = await client.query(`
        {
          pipelinesModulesList {
            pageInfo {
              startCursor
              endCursor
            }
          }
        }
      `);
      return components;
    } catch (e) {
      return null;
    }
  }

  static async getAllClassesTotalCount() {
    try {
      const classes = await client.query(`
        {
          productClassList {
            pageInfo {
              startCursor
              endCursor
            }
          }
        }
      `);
      return classes;
    } catch (e) {
      return null;
    }
  }

  static async getAllReleasesTotalCount() {
    try {
      const releases = await client.query(`
        {
          releaseTagList {
            pageInfo {
              startCursor
              endCursor
            }
          }
        }
      `);
      return releases;
    } catch (e) {
      return null;
    }
  }

  static async getAllPipelines(pageSize, after) {
    var strAfter = '';

    if (after !== null) {
      strAfter = `, after: "${after}"`;
    }

    try {
      const pipelines = await client.query(`
      {
        pipelinesList(first: ${pageSize} ${strAfter}) {
          edges {
            node {
              name
              displayName
              versionDate
              user {
                displayName
              }
              group {
                displayName
              }
              pipelineStage {
                displayName
              }
              readme
            }
          }
        }
      }
    `);

      return pipelines;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      return null;
    }
  }

  static async getAllComponents(pageSize, after) {
    var strAfter = '';

    if (after !== null) {
      strAfter = `, after: "${after}"`;
    }

    try {
      const components = await client.query(`
        {
          pipelinesModulesList(first: ${pageSize} ${strAfter}) {
            edges {
              node {
                pipeline {
                  displayName
                }
                module {
                  name
                  version
                  user {
                    displayName
                  }
                  moduleId
                  displayName
                }
              }
            }
          }
        }
      `);

      return components;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      return null;
    }
  }

  static async getAllClasses(pageSize, after) {
    var strAfter = '';

    if (after !== null) {
      strAfter = `, after: "${after}"`;
    }

    try {
      const classes = await client.query(`
        {
          productClassList(first: ${pageSize} ${strAfter}) {
            edges {
              node {
                className
                displayName
                productType {
                  displayName
                  typeName
                }
              }
            }
          }
        }
      `);

      return classes;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      return null;
    }
  }

  static async getAllReleases(pageSize, after) {
    var strAfter = '';

    if (after !== null) {
      strAfter = `, after: "${after}"`;
    }

    try {
      const releases = await client.query(`
        {
          releaseTagList(first: ${pageSize} ${strAfter}) {
            edges {
              node {
                releaseDisplayName
                name
                version
                releaseDate
                description
                docUrl                
              }
            }
          }
        }
      `);

      return releases;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      return null;
    }
  }
}

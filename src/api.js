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

  static async getAllClasses(pageSize, after) {
    var strAfter = '';
    // var search = [];

    if (after !== null) {
      strAfter = `, after: "${after}"`;
    }

    // if (searchValue.length > 1) {
    //   search = `, search: "${searchValue}"`;
    // }

    try {
      const classes = await client.query(`
        {
          productClassList (first: ${pageSize} ${strAfter}) {
            pageInfo {
              startCursor
              endCursor
            }
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
      console.log(e);
      return null;
    }
  }

  static async getAllComponents() {
    try {
      const components = await client.query(`
        {
          pipelinesModulesList {
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
      return null;
    }
  }

  static async getAllPipelines() {
    try {
      const pipelines = await client.query(`
      {
        pipelinesList {
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
      return null;
    }
  }
}

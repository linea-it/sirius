import Lokka from 'lokka';
import Transport from 'lokka-transport-http';

const apiUrl = process.env.REACT_APP_API_URL;
const client = new Lokka({
  transport: new Transport(apiUrl),
});

export default class Centaurus {
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

  static async getAllClasses() {
    try {
      const classes = await client.query(`
        {
          productClassList {
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

import Lokka from 'lokka';
import Transport from 'lokka-transport-http';

const apiUrl = process.env.REACT_APP_API_URL;

const client = new Lokka({
  transport: new Transport(apiUrl),
});

export default class Centaurus {
  static async getAllPipelines(sorting, pageSize, after, searchValue) {
    const sort = `${sorting[0].columnName}_${sorting[0].direction}`;
    var strAfter = '';

    if (after !== null) {
      strAfter = `, after: "${after}"`;
    }

    try {
      const pipelines = await client.query(`
      {
        pipelinesList(sort: [${sort}], search: {text: "${searchValue}", columns: [pipelines_name, pipelines_display_name, pipelines_version_date, pipeline_stage_display_name, group_pypelines_display_name, tg_user_display_name]}, first: ${pageSize} ${strAfter}) {
          pageInfo {
            startCursor
            endCursor
          }
          totalCount
          edges {
            node {
              pipelineId
              name
              displayName
              versionDate
              group {
                displayName
              }
              pipelineStage {
                displayName
              }
              user {
                displayName
              }
              readme
              userManual
              pipelineHistory
            }
          }
        }
      }
    `);

      const pipelinesWithProductsFunc = () => {
        const promises = pipelines.pipelinesList.edges.map(async pipeline => {
          const pipelineId = await pipeline.node.pipelineId;
          const products = await this.getProductsByPipeline(pipelineId);

          return {
            node: {
              ...pipeline.node,
              products: { ...products.inputProductsByPipeline.edges },
            },
          };
        });
        return Promise.all(promises);
      };

      const pipelinesWithProducts = await pipelinesWithProductsFunc();
      return {
        pipelinesList: {
          edges: pipelinesWithProducts,
          pageInfo: pipelines.pipelinesList.pageInfo,
          totalCount: pipelines.pipelinesList.totalCount,
        },
      };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      return null;
    }
  }

  static async getAllComponents(sorting, pageSize, after, searchValue) {
    const sort = `${sorting[0].columnName}_${sorting[0].direction}`;
    var strAfter = '';

    if (after !== null) {
      strAfter = `, after: "${after}"`;
    }

    try {
      const components = await client.query(`
        {
          modulesList(sort: [${sort}], search: {text: "${searchValue}", columns: [modules_display_name, modules_name, modules_version, modules_version_date, tg_user_display_name, pipelines_display_name]}, first: ${pageSize} ${strAfter}){
            pageInfo {
              startCursor
              endCursor
            }
            totalCount
            edges {
              node {
                displayName
                name
                version
                versionDate
                user {
                  displayName
                }
                pipelinesModules {
                  edges {
                    node {
                      pipeline {
                        displayName
                      }
                    }
                  }
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

  static async getAllClasses(sorting, pageSize, after, searchValue) {
    const sort = sorting
      ? `${sorting[0].columnName}_${sorting[0].direction}`
      : '';
    var strAfter = '';

    if (after !== null) {
      strAfter = `, after: "${after}"`;
    }

    try {
      const classes = await client.query(`
        {
          productClassList(sort: [${sort}], search: {text: "${searchValue}", columns: [product_class_class_name, product_class_display_name, product_type_display_name, product_type_type_name]}, first: ${pageSize} ${strAfter}) {
            pageInfo {
              startCursor
              endCursor
            }
            totalCount
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

  static async getProductsByPipeline(pipelineId) {
    try {
      const products = await client.query(`
        {
          inputProductsByPipeline(pipelineId: ${pipelineId}) {
            edges {
              node {
                displayName
                moduleName
                version
                versionDate
                products
              }
            }
          }
        }
      `);

      return products;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      return null;
    }
  }

  static async getAllFields(sorting, pageSize, after, searchValue) {
    const sort = `${sorting[0].columnName}_${sorting[0].direction}`;
    var strAfter = '';

    if (after !== null) {
      strAfter = `, after: "${after}"`;
    }

    try {
      const fields = await client.query(`
        {
          fieldsList(onlyAvailable: false, sort: [${sort}], search: {text: "${searchValue}", columns: [fields_field_name, fields_display_name, fields_install_date, fields_release_date, fields_start_date, fields_discovery_date, fields_status, release_tag_release_display_name, release_tag_version, release_tag_name]}, first: ${pageSize} ${strAfter}) {
            pageInfo {
              startCursor
              endCursor
            }
            totalCount
            edges {
              node {
                fieldName
                displayName
                installDate
                releaseDate
                startDate
                discoveryDate
                releaseTag{
                  name
                  version
                  releaseDisplayName
                }
                status
              }
            }
          }
        }
      `);

      return fields;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      return null;
    }
  }
}

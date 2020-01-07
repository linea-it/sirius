import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PagingState, IntegratedPaging } from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  PagingPanel,
  TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';

export default class SubtablePipelines extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'component', title: 'Component' },
        { name: 'pipeline', title: 'Pipeline' },
      ],
      rows: this.props.pipelinesRows,
      pageSize: 10,
      pageSizes: [5, 10, 15],
    };
  }

  static propTypes = {
    pipelinesRows: PropTypes.array.isRequired,
  };

  render() {
    const { rows, columns, pageSize, pageSizes } = this.state;

    return (
      <Grid rows={rows} columns={columns}>
        <PagingState defaultCurrentPage={0} defaultPageSize={pageSize} />
        <IntegratedPaging />
        <Table />
        <TableHeaderRow />
        <PagingPanel pageSizes={pageSizes} />
      </Grid>
    );
  }
}

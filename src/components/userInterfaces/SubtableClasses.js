import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  PagingState,
  IntegratedPaging,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  PagingPanel,
  TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';
import moment from 'moment';

export default class SubtableClasses extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { name: 'class', title: 'Class' },
        { name: 'name', title: 'Name' },
        { name: 'version', title: 'Version' },
        {
          name: 'versionDate',
          title: 'Version Date',
          getCellValue: row => (
            <span title={moment(row.versionDate).format('HH:mm:ss')}>
              {moment(row.versionDate).format('YYYY-MM-DD')}
            </span>
          ),
        },
        { name: 'products', title: 'Products' },
      ],
      rows: this.props.classesRows,
      pageSize: 10,
      pageSizes: [5, 10, 15],
    };
  }

  static propTypes = {
    classesRows: PropTypes.array.isRequired,
  };

  // componentDidMount() {
  //   console.log(this.props)
  // }

  render() {
    const { rows, columns, pageSize, pageSizes } = this.state;

    console.log(rows);

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

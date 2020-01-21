import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  PagingState,
  IntegratedPaging,
  GroupingState,
  IntegratedGrouping,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  PagingPanel,
  TableHeaderRow,
  TableGroupRow,
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
        { name: 'product', title: 'Product' },
      ],
      rows: [],
      pageSize: 10,
      pageSizes: [5, 10, 15],
      defaultExpandedGroups: this.props.classesRows.map(row => row.class),
    };
  }

  static propTypes = {
    classesRows: PropTypes.array.isRequired,
  };

  componentDidMount() {
    const rows = [];

    this.props.classesRows.forEach(row =>
      row.products.forEach(product => {
        rows.push({
          class: row.class,
          name: row.name,
          version: row.version,
          versionDate: row.versionDate,
          product: product,
        });
      })
    );

    this.setState({ rows });
  }

  render() {
    const {
      rows,
      columns,
      pageSize,
      pageSizes,
      defaultExpandedGroups,
    } = this.state;

    return (
      <Grid rows={rows} columns={columns}>
        <PagingState defaultCurrentPage={0} defaultPageSize={pageSize} />
        <IntegratedPaging />
        <GroupingState
          grouping={[{ columnName: 'class', showWhenGrouped: true }]}
          defaultExpandedGroups={defaultExpandedGroups}
        />
        <IntegratedGrouping />
        <Table />
        <TableHeaderRow />
        <PagingPanel pageSizes={pageSizes} />
        <TableGroupRow />
      </Grid>
    );
  }
}

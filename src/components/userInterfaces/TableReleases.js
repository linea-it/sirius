import * as React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import {
  PagingState,
  CustomPaging,
  SelectionState,
  SortingState,
  SearchState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  Table,
  TableHeaderRow,
  TableColumnVisibility,
  PagingPanel,
  TableColumnResizing,
  ColumnChooser,
  Toolbar,
  TableSelection,
  SearchPanel,
} from '@devexpress/dx-react-grid-material-ui';

import CircularProgress from '@material-ui/core/CircularProgress';

import Centaurus from '../../api';

const styles = {
  wrapPaper: {
    position: 'relative',
    paddingTop: '10px',
  },
  itemLink: {
    cursor: 'pointer',
    lineHeight: '1.3',
  },
  btn: {
    textTransform: 'none',
    padding: '1px 5px',
    width: '6em',
    minHeight: '1em',
    display: 'block',
    textAlign: 'center',
    lineHeight: '2',
    boxShadow:
      '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  btnSuccess: {
    backgroundColor: 'green',
    color: '#fff',
  },
  btnDeprecated: {
    backgroundColor: 'red',
    color: '#fff',
  },
};

const tableHeaderRowCell = ({ ...restProps }) => (
  <TableHeaderRow.Cell
    {...restProps}
    style={{
      color: '#555555',
      fontSize: '1em',
    }}
  />
);

class TablePipelines extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      columns: [
        { name: 'release_name', title: 'Release' },
        { name: 'fields_display_name', title: 'Display Name' },
        { name: 'fields_field_name', title: 'Field Name' },
        { name: 'fields_install_date', title: 'Install Date' },
        { name: 'fields_release_date', title: 'Release Date' },
        { name: 'fields_start_date', title: 'Start Date' },
        { name: 'fields_discovery_date', title: 'Discovery Date' },
        { name: 'name', title: 'Name' },
        { name: 'version', title: 'Version' },
        { name: 'fields_status', title: 'Status' },
      ],
      defaultColumnWidths: [
        { columnName: 'release_name', width: 150 },
        { columnName: 'fields_display_name', width: 150 },
        { columnName: 'fields_field_name', width: 200 },
        { columnName: 'fields_install_date', width: 130 },
        { columnName: 'fields_release_date', width: 130 },
        { columnName: 'fields_start_date', width: 130 },
        { columnName: 'fields_discovery_date', width: 100 },
        { columnName: 'name', width: 100 },
        { columnName: 'version', width: 100 },
        { columnName: 'fields_status', width: 100 },
      ],
      data: [],
      sorting: [{ columnName: 'fields_display_name', direction: 'desc' }],
      totalCount: 0,
      pageSize: 10,
      pageSizes: [5, 10, 15],
      currentPage: 0,
      loading: true,
      after: '',
      selection: [],
      searchValue: '',
      hiddenColumnNames: ['name'],
    };
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.loadData();
  }

  hiddenColumnNamesChange = hiddenColumnNames => {
    this.setState({ hiddenColumnNames });
  };

  changeSorting = sorting => {
    this.setState(
      {
        loading: true,
        sorting,
      },
      () => this.loadData()
    );
  };

  changeCurrentPage = currentPage => {
    var offset = currentPage * this.state.pageSize;

    const after = window.btoa('arrayconnection:' + (offset - 1));
    this.setState(
      {
        loading: true,
        currentPage,
        after: after,
      },
      () => this.loadData()
    );
  };

  changePageSize = pageSize => {
    const { totalCount, currentPage: stateCurrentPage } = this.state;
    const totalPages = Math.ceil(totalCount / pageSize);
    const currentPage = Math.min(stateCurrentPage, totalPages - 1);

    this.setState(
      {
        loading: true,
        pageSize,
        currentPage,
      },
      () => this.loadData()
    );
  };

  changeSearchValue = searchValue => {
    this.setState(
      {
        loading: true,
        searchValue,
      },
      () => this.loadData()
    );
  };

  handleSelection = selected => {
    this.setState({ selected: selected });
  };

  changeSelection = selection => {
    // Neste caso a selecao e para uma linha apenas,
    var selected_id, selectedRow;
    if (selection.length > 0) {
      // comparar a selecao atual com a anterior para descobrir qual
      // linha foi selecionado por ultimo
      const diff = selection.filter(x => !this.state.selection.includes(x));

      selection = diff;
      selected_id = diff[0];
      selectedRow = this.state.data[selected_id];
    } else {
      selection = [];
      selectedRow = null;
    }

    this.setState(
      {
        selection,
        selectedRow,
      },
      this.handleSelection(selectedRow)
    );
  };

  clearData = () => {
    this.setState({
      data: [],
    });
  };

  decodeTotalCount = fields => {
    if (fields !== null) {
      const fieldsLocal = fields.fieldsList.pageInfo.endCursor;

      const decodeString = window.atob(fieldsLocal);

      const totalCount = decodeString.split(':')[1];

      return totalCount;
    }
  };

  loadData = async () => {
    const { sorting, pageSize, after, searchValue } = this.state;
    let { totalCount } = this.state;

    this.clearData();
    const fieldsTotal = await Centaurus.getAllFieldsTotalCount();
    totalCount = this.decodeTotalCount(fieldsTotal);

    const fields = await Centaurus.getAllFields(
      sorting,
      pageSize,
      after,
      searchValue
    );
    if (fields && fields.fieldsList && fields.fieldsList.edges) {
      const fieldsLocal = fields.fieldsList.edges.map(row => {
        return {
          fields_display_name: row.node.displayName,
          fields_field_name: row.node.fieldName,
          fields_install_date: row.node.installDate,
          fields_release_date: row.node.releaseDate,
          fields_start_date: row.node.startDate,
          fields_discovery_date: row.node.discoveryDate,
          release_name: row.node.releaseTag.releaseDisplayName,
          name: row.node.releaseTag.name,
          version: row.node.releaseTag.version,
          fields_status: row.node.status,
        };
      });
      this.setState({
        data: fieldsLocal,
        totalCount: parseInt(totalCount),
        cursor: fields.fieldsList.pageInfo,
        loading: false,
      });
    } else {
      this.clearData();
    }
  };

  renderFieldName = rowData => {
    if (rowData.fields_field_name) {
      return (
        <span title={rowData.fields_field_name}>
          {rowData.fields_field_name}
        </span>
      );
    } else {
      return '-';
    }
  };

  renderDisplayName = rowData => {
    if (rowData.fields_display_name) {
      return (
        <span title={rowData.fields_display_name}>
          {rowData.fields_display_name}
        </span>
      );
    } else {
      return '-';
    }
  };

  renderInstallDate = rowData => {
    if (rowData.fields_install_date) {
      return (
        <span title={rowData.fields_install_date}>
          {rowData.fields_install_date}
        </span>
      );
    } else {
      return '-';
    }
  };

  renderReleaseDate = rowData => {
    if (rowData.fields_release_date) {
      return (
        <span title={rowData.fields_release_date}>
          {rowData.fields_release_date}
        </span>
      );
    } else {
      return '-';
    }
  };

  renderStartDate = rowData => {
    if (rowData.fields_start_date) {
      return (
        <span title={rowData.fields_start_date}>
          {rowData.fields_start_date}
        </span>
      );
    } else {
      return '-';
    }
  };

  renderDiscoveryDate = rowData => {
    if (rowData.fields_discovery_date) {
      return (
        <span title={rowData.fields_discovery_date}>
          {rowData.fields_discovery_date}
        </span>
      );
    } else {
      return '-';
    }
  };

  renderName = rowData => {
    if (rowData.name) {
      return <span title={rowData.name}>{rowData.name}</span>;
    } else {
      return '-';
    }
  };

  renderVersion = rowData => {
    if (rowData.version) {
      return <span title={rowData.version}>{rowData.version}</span>;
    } else {
      return '-';
    }
  };

  renderReleaseDisplayName = rowData => {
    if (rowData.release_name) {
      return <span title={rowData.release_name}>{rowData.release_name}</span>;
    } else {
      return '-';
    }
  };

  renderStatus = rowData => {
    const { classes } = this.props;
    if (rowData.fields_status) {
      return (
        <span className={classes.btn} style={styles.btnSuccess}>
          Available
        </span>
      );
    } else {
      return (
        <span className={classes.btn} style={styles.btnDeprecated}>
          Deprecated
        </span>
      );
    }
  };

  renderTable = () => {
    const {
      data,
      columns,
      sorting,
      pageSize,
      pageSizes,
      currentPage,
      totalCount,
      defaultColumnWidths,
      selection,
      hiddenColumnNames,
    } = this.state;

    return (
      <Grid rows={data} columns={columns}>
        <SearchState onValueChange={this.changeSearchValue} />
        <SortingState
          sorting={sorting}
          onSortingChange={this.changeSorting}
          columnExtensions={[
            { columnName: 'name', sortingEnabled: false },
            { columnName: 'version', sortingEnabled: false },
            { columnName: 'release_name', sortingEnabled: false },
          ]}
        />
        <PagingState
          currentPage={currentPage}
          onCurrentPageChange={this.changeCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={this.changePageSize}
        />
        <CustomPaging totalCount={totalCount} />
        <SelectionState
          selection={selection}
          onSelectionChange={this.changeSelection}
        />
        <Table />
        <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
        <TableHeaderRow
          cellComponent={tableHeaderRowCell}
          showSortingControls
        />
        <TableColumnVisibility
          hiddenColumnNames={hiddenColumnNames}
          onHiddenColumnNamesChange={this.hiddenColumnNamesChange}
        />
        <TableSelection
          selectByRowClick
          highlightRow
          showSelectionColumn={false}
        />
        <PagingPanel pageSizes={pageSizes} />
        <Toolbar />
        <SearchPanel />
        <ColumnChooser />
      </Grid>
    );
  };

  renderLoading = () => {
    return (
      <CircularProgress
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          margin: '-30px 0 0 -20px',
          zIndex: '99',
        }}
      />
    );
  };

  render() {
    const { loading, data } = this.state;
    const { classes } = this.props;

    data.map(row => {
      row.fields_display_name = this.renderDisplayName(row);
      row.fields_field_name = this.renderFieldName(row);
      row.fields_install_date = this.renderInstallDate(row);
      row.fields_release_date = this.renderReleaseDate(row);
      row.fields_start_date = this.renderStartDate(row);
      row.fields_discovery_date = this.renderDiscoveryDate(row);
      row.release_name = this.renderReleaseDisplayName(row);
      row.name = this.renderName(row);
      row.version = this.renderVersion(row);
      row.fields_status = this.renderStatus(row);
      return row;
    });

    return (
      <Paper className={classes.wrapPaper}>
        {this.renderTable()}
        {loading && this.renderLoading()}
      </Paper>
    );
  }
}

export default withStyles(styles)(TablePipelines);

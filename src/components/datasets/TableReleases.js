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
  Toolbar,
  TableSelection,
  SearchPanel,
} from '@devexpress/dx-react-grid-material-ui';
import CircularProgress from '@material-ui/core/CircularProgress';
import Centaurus from '../../api';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import CustomColumnChooser from '../userInterfaces/CustomColumnChooser';

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
  invisibleButton: {
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: 'rgba(0, 0, 0, 0.87)',
    padding: 0,
    fontSize: '1rem',
    lineHeight: 1.75,
    fontHeight: 500,
    letterSpacing: '0.02857em',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '100%',
  },
};

const SortingIcon = ({ direction }) =>
  direction === 'asc' ? (
    <ArrowUpward style={{ fontSize: '18px' }} />
  ) : (
    <ArrowDownward style={{ fontSize: '18px' }} />
  );

const SortLabel = ({ onSort, children, direction }) => {
  return (
    <Tooltip title={children.props.children}>
      <span onClick={onSort} style={styles.invisibleButton}>
        {children}
        {direction && <SortingIcon direction={direction} />}
      </span>
    </Tooltip>
  );
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

SortingIcon.propTypes = {
  direction: PropTypes.string.isRequired,
};

SortLabel.propTypes = {
  onSort: PropTypes.func.isRequired,
  children: PropTypes.object.isRequired,
  direction: PropTypes.string,
};

class TablePipelines extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      columns: [
        { name: 'fields_display_name', title: 'Dataset' },
        { name: 'fields_field_name', title: 'Internal Name' },
        { name: 'releasetag_release_display_name', title: 'Release' },
        { name: 'fields_install_date', title: 'Install Date' },
        { name: 'fields_release_date', title: 'Release Date' },
        { name: 'fields_start_date', title: 'Start Date' },
        { name: 'fields_discovery_date', title: 'Discovery Date' },
        { name: 'releasetag_name', title: 'Name' },
        { name: 'releasetag_version', title: 'Version' },
        { name: 'fields_status', title: 'Status' },
      ],
      defaultColumnWidths: [
        { columnName: 'release_name', width: 150 },
        { columnName: 'fields_display_name', width: 150 },
        { columnName: 'fields_field_name', width: 200 },
        { columnName: 'releasetag_release_display_name', width: 150 },
        { columnName: 'fields_install_date', width: 130 },
        { columnName: 'fields_release_date', width: 130 },
        { columnName: 'fields_start_date', width: 130 },
        { columnName: 'fields_discovery_date', width: 100 },
        { columnName: 'releasetag_name', width: 100 },
        { columnName: 'releasetag_version', width: 100 },
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
      hiddenColumnNames: ['releasetag_name'],
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
    this.clearData();
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
      after: '',
      currentPage: 0,
    });
  };

  loadData = async () => {
    const { sorting, pageSize, after, searchValue } = this.state;

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
          releasetag_release_display_name:
            row.node.releaseTag.releaseDisplayName,
          releasetag_name: row.node.releaseTag.name,
          releasetag_version: row.node.releaseTag.version,
          fields_status: row.node.status,
        };
      });
      this.setState({
        data: fieldsLocal,
        totalCount: parseInt(fields.fieldsList.totalCount),
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
    if (rowData.releasetag_name) {
      return (
        <span title={rowData.releasetag_name}>{rowData.releasetag_name}</span>
      );
    } else {
      return '-';
    }
  };

  renderVersion = rowData => {
    if (rowData.releasetag_version) {
      return (
        <span title={rowData.releasetag_version}>
          {rowData.releasetag_version}
        </span>
      );
    } else {
      return '-';
    }
  };

  renderReleaseDisplayName = rowData => {
    if (rowData.releasetag_release_display_name) {
      return (
        <span title={rowData.releasetag_release_display_name}>
          {rowData.releasetag_release_display_name}
        </span>
      );
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
          sortLabelComponent={SortLabel}
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
        <CustomColumnChooser />
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
      row.releasetag_release_display_name = this.renderReleaseDisplayName(row);
      row.releasetag_name = this.renderName(row);
      row.releasetag_version = this.renderVersion(row);
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

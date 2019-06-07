import * as React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import {
  PagingState,
  SortingState,
  CustomPaging,
  SelectionState,
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

class TableClasses extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      columns: [
        { name: 'modules_display_name', title: 'Components' },
        { name: 'modules_name', title: 'Internal Name' },
        { name: 'modules_version', title: 'Version' },
        { name: 'modules_version_date', title: 'Version Date' },
        { name: 'pipelines_display_name', title: 'Pipeline' },
        { name: 'tguser_display_name', title: 'Owner' },
      ],
      defaultColumnWidths: [
        { columnName: 'modules_display_name', width: 200 },
        { columnName: 'modules_name', width: 200 },
        { columnName: 'modules_version', width: 120 },
        { columnName: 'modules_version_date', width: 170 },
        { columnName: 'pipelines_display_name', width: 200 },
        { columnName: 'tguser_display_name', width: 200 },
      ],
      data: [],
      sorting: [{ columnName: 'modules_display_name', direction: 'desc' }],
      totalCount: 0,
      pageSize: 10,
      pageSizes: [5, 10, 15],
      currentPage: 0,
      loading: true,
      after: '',
      selection: [],
      searchValue: '',
    };
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.loadData();
  }

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

  loadData = async () => {
    const { sorting, pageSize, after, searchValue } = this.state;

    const components = await Centaurus.getAllComponents(
      sorting,
      pageSize,
      after,
      searchValue
    );

    if (components && components.modulesList && components.modulesList.edges) {
      const componentsLocal = components.modulesList.edges.map(row => {
        return {
          modules_display_name: row.node.displayName,
          modules_name: row.node.name,
          modules_version: row.node.version,
          modules_version_date: row.node.versionDate
            ? row.node.versionDate.split('T')[0]
            : null,
          versionHour: row.node.versionDate
            ? row.node.versionDate.split('T')[1]
            : null,
          pipelines_display_name: row.node.pipelinesModules.edges.map(edge => {
            return edge.node.pipeline.displayName;
          }),
          tguser_display_name: row.node.user ? row.node.user.displayName : null,
        };
      });
      this.setState({
        data: componentsLocal,
        totalCount: parseInt(components.modulesList.totalCount),
        cursor: components.modulesList.pageInfo,
        loading: false,
      });
    } else {
      this.clearData();
    }
  };

  renderModule = rowData => {
    if (rowData.modules_display_name) {
      return (
        <span title={rowData.modules_display_name}>
          {rowData.modules_display_name}
        </span>
      );
    } else {
      return '-';
    }
  };

  renderName = rowData => {
    if (rowData.modules_name) {
      return <span title={rowData.modules_name}>{rowData.modules_name}</span>;
    } else {
      return '-';
    }
  };

  renderVersion = rowData => {
    if (rowData.modules_version) {
      return (
        <span title={rowData.modules_version}>{rowData.modules_version}</span>
      );
    } else {
      return '-';
    }
  };

  renderVersionDate = rowData => {
    if (rowData.modules_version_date) {
      return (
        <span title={rowData.versionHour}>{rowData.modules_version_date}</span>
      );
    } else {
      return '-';
    }
  };

  renderPipeline = rowData => {
    if (rowData.pipelines_display_name.length > 0) {
      return (
        <span title={rowData.pipelines_display_name}>
          {rowData.pipelines_display_name}
        </span>
      );
    } else {
      return '-';
    }
  };

  renderOwner = rowData => {
    if (rowData.tguser_display_name) {
      return (
        <span title={rowData.tguser_display_name}>
          {rowData.tguser_display_name}
        </span>
      );
    } else {
      return '-';
    }
  };

  renderTable = () => {
    const {
      data,
      columns,
      pageSize,
      pageSizes,
      currentPage,
      totalCount,
      defaultColumnWidths,
      selection,
      sorting,
    } = this.state;

    return (
      <Grid rows={data} columns={columns}>
        <SearchState onValueChange={this.changeSearchValue} />
        <SortingState sorting={sorting} onSortingChange={this.changeSorting} />
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
        <TableColumnVisibility />
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
      row.modules_display_name = this.renderModule(row);
      row.modules_name = this.renderName(row);
      row.modules_version = this.renderVersion(row);
      row.modules_version_date = this.renderVersionDate(row);
      row.pipelines_display_name = this.renderPipeline(row);
      row.tguser_display_name = this.renderOwner(row);
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

export default withStyles(styles)(TableClasses);

import * as React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
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
  itemLink: {
    cursor: 'pointer',
    lineHeight: '1.3',
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
        { name: 'pipelines_display_name', title: 'Pipeline' },
        { name: 'pipelines_name', title: 'Name' },
        { name: 'pipelines_version_date', title: 'Version Date' },
        { name: 'grouppypelines_display_name', title: 'Group' },
        { name: 'pipelinestage_display_name', title: 'Stage' },
        { name: 'tguser_display_name', title: 'Owner' },
        { name: 'pipelines_readme', title: 'Description' },
        { name: 'user', title: 'User Manual' },
        { name: 'history', title: 'History' },
      ],
      defaultColumnWidths: [
        { columnName: 'pipelines_display_name', width: 200 },
        { columnName: 'pipelines_name', width: 200 },
        { columnName: 'pipelines_version_date', width: 200 },
        { columnName: 'grouppypelines_display_name', width: 200 },
        { columnName: 'pipelinestage_display_name', width: 200 },
        { columnName: 'tguser_display_name', width: 200 },
        { columnName: 'pipelines_readme', width: 100 },
        { columnName: 'user', width: 100 },
        { columnName: 'history', width: 100 },
      ],
      data: [],
      sorting: [{ columnName: 'pipelines_display_name', direction: 'desc' }],
      totalCount: 0,
      pageSize: 10,
      pageSizes: [5, 10, 15],
      currentPage: 0,
      loading: true,
      after: '',
      selection: [],
      searchValue: '',
      hiddenColumnNames: ['grouppypelines_display_name'],
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

  loadData = async () => {
    const { sorting, pageSize, after, searchValue } = this.state;

    const pipelines = await Centaurus.getAllPipelines(
      sorting,
      pageSize,
      after,
      searchValue
    );

    if (pipelines && pipelines.pipelinesList && pipelines.pipelinesList.edges) {
      const pipelinesLocal = pipelines.pipelinesList.edges.map(row => {
        return {
          pipelines_display_name: row.node.displayName,
          pipelines_name: row.node.name,
          pipelines_version_date: row.node.versionDate.split('T')[0],
          pipelines_version_hour: row.node.versionDate.split('T')[1],
          grouppypelines_display_name: row.node.group
            ? row.node.group.displayName
            : null,
          pipelinestage_display_name: row.node.pipelineStage
            ? row.node.pipelineStage.displayName
            : null,
          tguser_display_name: row.node.user ? row.node.user.displayName : null,
          pipelines_readme: row.node.readme,
        };
      });
      this.setState({
        data: pipelinesLocal,
        totalCount: parseInt(pipelines.pipelinesList.totalCount),
        cursor: pipelines.pipelinesList.pageInfo,
        loading: false,
      });
    } else {
      this.clearData();
    }
  };

  renderPipeline = rowData => {
    if (rowData.pipelines_display_name) {
      return (
        <span title={rowData.pipelines_display_name}>
          {rowData.pipelines_display_name}
        </span>
      );
    } else {
      return '-';
    }
  };

  renderName = rowData => {
    if (rowData.pipelines_name) {
      return (
        <span title={rowData.pipelines_name}>{rowData.pipelines_name}</span>
      );
    } else {
      return '-';
    }
  };

  renderVersion = rowData => {
    if (rowData.pipelines_version_date) {
      return (
        <span title={rowData.pipelines_version_hour}>
          {rowData.pipelines_version_date}
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

  renderGroup = rowData => {
    if (rowData.grouppypelines_display_name) {
      return (
        <span title={rowData.grouppypelines_display_name}>
          {rowData.grouppypelines_display_name}
        </span>
      );
    } else {
      return '-';
    }
  };

  renderStage = rowData => {
    if (rowData.pipelinestage_display_name) {
      return (
        <span title={rowData.pipelinestage_display_name}>
          {rowData.pipelinestage_display_name}
        </span>
      );
    } else {
      return '-';
    }
  };

  renderUserManual = rowData => {
    if (rowData.user) {
      return <span title={rowData.user}>{rowData.user}</span>;
    } else {
      return '-';
    }
  };

  renderHistory = rowData => {
    if (rowData.history) {
      return <span title={rowData.history}>{rowData.history}</span>;
    } else {
      return '-';
    }
  };

  handleClickReadme = URL => {
    window.open(URL);
  };

  renderReadme = rowData => {
    const { classes } = this.props;
    if (rowData.pipelines_readme !== null) {
      return (
        <span
          className={classes.itemLink}
          title={rowData.pipelines_readme}
          onClick={() => this.handleClickReadme(rowData.pipelines_readme)}
        >
          <Icon>link</Icon>
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
      hiddenColumnNames,
    } = this.state;

    return (
      <Grid rows={data} columns={columns}>
        <SearchState onValueChange={this.changeSearchValue} />
        <SortingState
          sorting={sorting}
          onSortingChange={this.changeSorting}
          columnExtensions={[
            { columnName: 'user', sortingEnabled: false },
            { columnName: 'history', sortingEnabled: false },
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
      row.pipelines_display_name = this.renderPipeline(row);
      row.pipelines_name = this.renderName(row);
      row.pipelines_version_date = this.renderVersion(row);
      row.tguser_display_name = this.renderOwner(row);
      row.grouppypelines_display_name = this.renderGroup(row);
      row.pipelinestage_display_name = this.renderStage(row);
      row.pipelines_readme = this.renderReadme(row);
      row.user = this.renderUserManual(row);
      row.history = this.renderHistory(row);
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

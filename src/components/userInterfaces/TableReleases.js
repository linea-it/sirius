import * as React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
// import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core/styles';
import {
  PagingState,
  CustomPaging,
  SelectionState,
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
} from '@devexpress/dx-react-grid-material-ui';

import CircularProgress from '@material-ui/core/CircularProgress';

import Centaurus from '../../api';

const styles = {
  wrapPaper: {
    position: 'relative',
    paddingTop: '10px',
  },
  itemLink: {
    color: 'blue',
    cursor: 'pointer',
    textDecoration: 'underline',
    lineHeight: '1.3',
  },
};

class TablePipelines extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      columns: [
        { name: 'displayName', title: 'Pipeline Name' },
        { name: 'name', title: 'Name' },
        { name: 'versionDate', title: 'Version Date' },
        { name: 'owner', title: 'Owner' },
        { name: 'group', title: 'Group' },
        { name: 'stage', title: 'Stage' },
        { name: 'readme', title: 'Readme' },
      ],
      defaultColumnWidths: [
        { columnName: 'displayName', width: 200 },
        { columnName: 'name', width: 200 },
        { columnName: 'versionDate', width: 200 },
        { columnName: 'owner', width: 200 },
        { columnName: 'group', width: 200 },
        { columnName: 'stage', width: 200 },
        { columnName: 'readme', width: 100 },
      ],
      data: [],
      totalCount: 0,
      pageSize: 10,
      pageSizes: [5, 10, 15],
      currentPage: 0,
      loading: true,
      after: '',
      selection: [],
    };
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.loadData();
  }

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

  decodeTotalCount = pipelines => {
    if (pipelines !== null) {
      const pipelinesLocal = pipelines.pipelinesList.pageInfo.endCursor;

      const decodeString = window.atob(pipelinesLocal);

      const totalCount = decodeString.split(':')[1];

      return totalCount;
    }
  };

  loadData = async () => {
    const { pageSize, after } = this.state;
    let { totalCount } = this.state;

    this.clearData();
    const pipelinesTotal = await Centaurus.getAllPipelinesTotalCount();
    totalCount = this.decodeTotalCount(pipelinesTotal);

    const pipelines = await Centaurus.getAllPipelines(pageSize, after);
    if (pipelines && pipelines.pipelinesList && pipelines.pipelinesList.edges) {
      const pipelinesLocal = pipelines.pipelinesList.edges.map(row => {
        return {
          displayName: row.node.displayName,
          name: row.node.name,
          versionDate: row.node.versionDate,
          owner: row.node.user ? row.node.user.displayName : null,
          group: row.node.group ? row.node.group.displayName : null,
          stage: row.node.pipelineStage
            ? row.node.pipelineStage.displayName
            : null,
          readme: row.node.readme,
        };
      });
      this.setState({
        data: pipelinesLocal,
        totalCount: parseInt(totalCount),
        cursor: pipelines.pipelinesList.pageInfo,
        loading: false,
      });
    } else {
      this.clearData();
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
    } = this.state;

    return (
      <Grid rows={data} columns={columns}>
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
        <TableHeaderRow />
        <TableColumnVisibility />
        <TableSelection
          selectByRowClick
          highlightRow
          showSelectionColumn={false}
        />
        <PagingPanel pageSizes={pageSizes} />
        <Toolbar />
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
    const { loading } = this.state;
    const { classes } = this.props;

    return (
      <Paper className={classes.wrapPaper}>
        {this.renderTable()}
        {loading && this.renderLoading()}
      </Paper>
    );
  }
}

export default withStyles(styles)(TablePipelines);

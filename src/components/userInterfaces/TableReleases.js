import * as React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
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
    cursor: 'pointer',
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
        { name: 'releaseDisplayName', title: 'Release Display Name' },
        { name: 'name', title: 'Name' },
        { name: 'version', title: 'Version' },
        { name: 'releaseDate', title: 'Release Date' },
        { name: 'description', title: 'Description' },
        { name: 'btnDocUrl', title: 'Doc Url' },
      ],
      defaultColumnWidths: [
        { columnName: 'releaseDisplayName', width: 200 },
        { columnName: 'name', width: 150 },
        { columnName: 'version', width: 80 },
        { columnName: 'releaseDate', width: 100 },
        { columnName: 'description', width: 200 },
        { columnName: 'btnDocUrl', width: 80 },
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

  decodeTotalCount = releases => {
    if (releases !== null) {
      const releasesLocal = releases.releaseTagList.pageInfo.endCursor;

      const decodeString = window.atob(releasesLocal);

      const totalCount = decodeString.split(':')[1];

      return totalCount;
    }
  };

  loadData = async () => {
    const { pageSize, after } = this.state;
    let { totalCount } = this.state;

    this.clearData();
    const releasesTotal = await Centaurus.getAllReleasesTotalCount();
    totalCount = this.decodeTotalCount(releasesTotal);

    const releases = await Centaurus.getAllReleases(pageSize, after);
    if (releases && releases.releaseTagList && releases.releaseTagList.edges) {
      const releasesLocal = releases.releaseTagList.edges.map(row => {
        return {
          releaseDisplayName: row.node.releaseDisplayName,
          name: row.node.name,
          version: row.node.version,
          releaseDate: row.node.releaseDate,
          description: row.node.description,
          docUrl: row.node.docUrl,
        };
      });
      this.setState({
        data: releasesLocal,
        totalCount: parseInt(totalCount),
        cursor: releases.releaseTagList.pageInfo,
        loading: false,
      });
    } else {
      this.clearData();
    }
  };

  renderRelease = rowData => {
    if (rowData.releaseDisplayName) {
      return (
        <span title={rowData.releaseDisplayName}>
          {rowData.releaseDisplayName}
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

  renderReleaseDate = rowData => {
    if (rowData.releaseDate) {
      return <span title={rowData.releaseDate}>{rowData.releaseDate}</span>;
    } else {
      return '-';
    }
  };

  renderDescription = rowData => {
    if (rowData.description) {
      return <span title={rowData.description}>{rowData.description}</span>;
    } else {
      return '-';
    }
  };

  handleClickDocUrl = URL => {
    window.open(URL);
  };

  renderDocUrl = rowData => {
    const { classes } = this.props;
    if (rowData.docUrl !== null) {
      return (
        <span
          className={classes.itemLink}
          title={rowData.docUrl}
          onClick={() => this.handleClickDocUrl(rowData.docUrl)}
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
    const { loading, data } = this.state;
    const { classes } = this.props;

    data.map(row => {
      row.releaseDisplayName = this.renderRelease(row);
      row.name = this.renderName(row);
      row.version = this.renderVersion(row);
      row.releaseDate = this.renderReleaseDate(row);
      row.description = this.renderDescription(row);
      row.btnDocUrl = this.renderDocUrl(row);
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

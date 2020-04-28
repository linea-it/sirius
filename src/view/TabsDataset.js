import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import TableReleases from '../components/datasets/TableReleases';
// import TablePackages from './userInterfaces/TablePackages';

function TabContainer(props) {
  return (
    <Typography
      component="div"
      style={{ paddingTop: 8 * 2, paddingBottom: 2 * 40, marginTop: 2 * 50 }}
    >
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  tabs: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.light,
    marginTop: '53px',
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: '9',
  },

  tab: {
    margin: 0,
    padding: 0,
  },
});

class SimpleTabs extends React.Component {
  state = {
    value: 0,
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <Tabs
          value={value}
          className={classes.tabs}
          indicatorColor="primary"
          onChange={this.handleChange}
        >
          <Tab label="Datasets" />
          <Tab label="External Dataset" disabled />
          <Tab label="Simulations" disabled />
        </Tabs>
        {value === 0 && (
          <TabContainer className={classes.tab}>
            <TableReleases />
          </TabContainer>
        )}
        {value === 1 && (
          <TabContainer className={classes.tab}>
            {/* <TableRelease /> */}
          </TabContainer>
        )}
        {value === 2 && (
          <TabContainer className={classes.tab}>
            {/* <TableSimulations /> */}
          </TabContainer>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(SimpleTabs);

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
// import TablePipelines from '../components/userIntefaces/TablePipelines';
// import TableComponents from '../components/userIntefaces/TableComponents';
import TableClasses from './userInterfaces/TableClasses';

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
          <Tab label="Pipelines" />
          <Tab label="Components" />
          <Tab label="Classes" />
          <Tab label="Packages" disabled />
        </Tabs>
        {value === 0 && (
          <TabContainer className={classes.tab}>
            Teste
            {/* <TablePipelines /> */}
          </TabContainer>
        )}
        {value === 1 && (
          <TabContainer className={classes.tab}>
            Teste
            {/* <TableComponents /> */}
          </TabContainer>
        )}
        {value === 2 && (
          <TabContainer className={classes.tab}>
            {/* Teste */}
            <TableClasses />
          </TabContainer>
        )}
        {value === 3 && (
          <TabContainer className={classes.tab}>
            {/* <UserData /> */}
          </TabContainer>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(SimpleTabs);

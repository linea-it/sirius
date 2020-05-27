import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme/MaterialTheme';
import Header from './components/Header';
import Footer from './components/Footer';
import TabsUserInterface from './view/TabsUserInterface';

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Header />
      <TabsUserInterface />
      <Footer />
    </MuiThemeProvider>
  );
}

export default App;

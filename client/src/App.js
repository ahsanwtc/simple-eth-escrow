import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { blue, green, amber, lime } from '@mui/material/colors';

import { getWeb3, getContract } from './utils';
import Loading from './Loading';

const theme = createTheme({
  palette: {
    primary: {
      main: green[500]
    },
    secondary: {
      main: blue[500]
    }
  },
  typography: {
    allVariants: {
      color: amber[50]
    }
  }
});

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [escrow, setEscrow] = useState(undefined);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const escrow = await getContract(web3);

      setWeb3(web3);
      setAccounts(accounts);
      setEscrow(escrow);
    };

    init();
  }, []);

  const isLoading = () => {
    if (web3 === undefined || escrow === undefined || accounts.length === 0) { return true; }
    return false;
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        {isLoading() && <Loading />}
        <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center">
          <Grid item xs={12}>
            <Typography variant='h3' style={{ color: lime['A700'] }}>ETH Escrow</Typography>
            <Typography variant='subtitle1'>An escrow project implemented over ethereum blockchain.</Typography>
          </Grid>

        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;

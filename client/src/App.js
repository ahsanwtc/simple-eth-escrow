import React, { useEffect, useState } from 'react';
import { Container, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { blue, green, deepOrange } from '@mui/material/colors';

import { getWeb3, getContract, whichAccount } from './utils';
import Loading from './Loading';
import Title from './Title';
import ContentCard from './ContentCard';

const theme = createTheme({
  palette: {
    primary: {
      main: green[500]
    },
    secondary: {
      main: blue[500]
    },
    mode: 'dark',
  },
  typography: {
    allVariants: {
      // color: amber[50]
    }
  }
});

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [escrow, setEscrow] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [unit, setUnit] = useState('wei');
  const [agreedAmount, setAgreedAmount] = useState(10);
  const [amount, setAmount] = useState(10);
  const [registeredLawyer, setRegisteredLawyer] = useState(undefined);
  const [registeredPayer, setRegisteredPayer] = useState(undefined);
  const [registeredPayee, setRegisteredPayee] = useState(undefined);
  const [activeAccount, setActiveAccount] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const escrow = await getContract(web3);

      const registeredLawyer = await escrow.methods.lawyer().call();
      const registeredPayer = await escrow.methods.payer().call();
      const registeredPayee = await escrow.methods.payee().call();
      const agreedAmount = await escrow.methods.amount().call();
      const amount = await escrow.methods.getBalance().call();

      setWeb3(web3);
      setAccounts(accounts);
      setEscrow(escrow);
      setAmount(amount);
      setActiveAccount(accounts[0]);
      setRegisteredLawyer(registeredLawyer);
      setRegisteredPayer(registeredPayer);
      setRegisteredPayee(registeredPayee);
      setAgreedAmount(agreedAmount);
    };

    init();
    
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, []);

  const handleAccountsChanged = accounts => {
    setActiveAccount(accounts[0]);
  };

  const handleSubmitButtonOnClick = async (type, amount) => {
    amount = amount ? amount : 0;
    switch (type) {
      case 'release': {
        try {
          await escrow.methods.release().send({ from: activeAccount });
        } catch (e) {
          console.log(e);
        }
        break;
      }
      case 'escrow': {
        try {
          await escrow.methods.deposit().send({ from: activeAccount, value: amount });
        } catch (e) {
          console.log(e);
        }
        break;
      }
      default:
    }
  };

  if (web3 === undefined || escrow === undefined || accounts.length === 0 || 
    registeredLawyer === undefined || registeredPayer === undefined || registeredPayee === undefined || activeAccount === undefined) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="md">
          <Loading />
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">        
        <Title />
        
        <Grid container mt={0}>
          <Grid item xs={2}>
            <FormControl fullWidth>
              <InputLabel id="unit-select-label">Unit</InputLabel>
              <Select labelId="unit-select-label" id="unit-select" value={unit} label="Unit" onChange={e => setUnit(e.target.value)}>
                <MenuItem value={'wei'}>wei</MenuItem>
                <MenuItem value={'kwei'}>Kewi</MenuItem>
                <MenuItem value={'mwei'}>Mwei</MenuItem>
                <MenuItem value={'gwei'}>Gwei</MenuItem>
                <MenuItem value={'micro'}>micro ether</MenuItem>
                <MenuItem value={'milli'}>milli ether</MenuItem>
                <MenuItem value={'ether'}>ether</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Grid container spacing={2} mt={2}>
          <ContentCard amount={agreedAmount} title='Agreed amount' unit={unit} web3={web3}/>
          <ContentCard amount={amount} title='Escrowed amount' unit={unit} web3={web3}/>
          <ContentCard background={deepOrange[300]}
            accountLabel={whichAccount({ account: activeAccount, lawyer: registeredLawyer, payer: registeredPayer, payee: registeredPayee })}
            account={activeAccount} type='transaction' unit={unit} onClickSubmitButton={handleSubmitButtonOnClick}
          />
        </Grid>

        <Grid container spacing={2} mt={2}>
          <ContentCard title='Account' sm={12} 
            accountLabel={whichAccount({ account: activeAccount, lawyer: registeredLawyer, payer: registeredPayer, payee: registeredPayee })}
            account={activeAccount} type='acount-info'
          />
        </Grid>

      </Container>
    </ThemeProvider>
  );
};



export default App;

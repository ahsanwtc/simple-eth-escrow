import React, { useState } from 'react';
import { Typography, Grid, Paper, Stack, TextField, Button } from '@mui/material';
import { cyan } from '@mui/material/colors';


const ContentCard = ({ amount: a, title, unit, web3, xs, sm, account, accountLabel, background, type, onClickSubmitButton }) => {
  const amount = a ? web3.utils.fromWei(`${a}`, `${unit}`) : 0;
  const [amountField, setAmountField] = useState('');
  xs = xs ? xs : 12;
  sm = sm ? sm : 4;
  background = background ? background : cyan[900];

  const actionType = accountLabel === 'Lawyer account' ? 'release' : accountLabel === 'Payer account' ? 'escrow' : null;
  
  return (
    <Grid item xs={xs} sm={sm}>
      <Paper elevation={12} style={{ background: background, padding: 10, minHeight: 250, minWidth: 250 }}>
        <Typography variant='h6'>{title}</Typography>
        {amount !== 0 &&
          <Stack direction="row" justifyContent="flex-start" alignItems="baseline" spacing={0.5}>
            <Typography variant={calculateVarient(amount)}>{amount}</Typography>
            <Typography variant='overline' style={{ fontSize: '1rem' }}>{unit}</Typography>
          </Stack>
        }
        {account && accountLabel && type === 'acount-info' &&
          <Stack>
            <Typography variant='h2'>{accountLabel}</Typography>
            <Typography variant='h5'>{account}</Typography>
          </Stack>
        }
        {account && (actionType === 'release' || actionType === 'escrow') && type === 'transaction' &&
          <Stack  direction="column" justifyContent="space-arounds" alignItems="center" spacing={2}>
            {accountLabel === 'Payer account' && <TextField label="Outlined" variant="outlined" onChange={e => setAmountField(e.target.value)} value={amountField} />}
            <Button variant="contained" onClick={() => onClickSubmitButton(actionType, amountField)}>{actionType}</Button>
          </Stack>
        }
      </Paper>
    </Grid>
  );
};

const calculateVarient = amount => {
  const length = `${amount}`.length;

  if (length <= 6) {
    return 'h2';
  }

  if (length > 6 && length <= 9) {
    return 'h3';
  }

  if (length > 9 && length <= 12) {
    return 'h4';
  }

  if (length > 12 && length <= 15) {
    return 'h5';
  }

  return 'subtitle1';


};


export default ContentCard;
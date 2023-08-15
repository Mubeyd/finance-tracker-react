import { ICurrency } from '@/db/types';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function AutocompleteSelect({
  currency,
  setCurrency
}: {
  currency: ICurrency | undefined;
  setCurrency: (currency: ICurrency | undefined) => void;
}) {
  return (
    <Autocomplete
      disablePortal
      id='combo-box-demo'
      options={currencies}
      getOptionLabel={option => option.code}
      sx={{ width: 160, margin: 1 }}
      renderInput={params => (
        <TextField {...params} label='Select Currency' variant='outlined' sx={{ width: '100%', margin: '0px 0' }} />
      )}
      value={currency}
      onChange={(event, newValue) => {
        if (newValue === null) {
          return;
        }

        setCurrency(newValue);
      }}

      size='small'
    />
  );
}

const currencies: ICurrency[] = [
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    valueInUSD: 1
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    valueInUSD: 1.17
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    valueInUSD: 1.37
  },
  {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    valueInUSD: 0.014
  },
  {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    valueInUSD: 0.74
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'C$',
    valueInUSD: 0.79
  },
  {
    code: 'SGD',
    name: 'Singapore Dollar',
    symbol: 'S$',
    valueInUSD: 0.74
  },
  {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF',
    valueInUSD: 1.09
  },
  {
    code: 'MYR',
    name: 'Malaysian Ringgit',
    symbol: 'RM',
    valueInUSD: 0.24
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    valueInUSD: 0.0091
  },
  {
    code: 'CNY',
    name: 'Chinese Yuan Renminbi',
    symbol: '¥',
    valueInUSD: 0.15
  },
  {
    code: 'NZD',
    name: 'New Zealand Dollar',
    symbol: 'NZ$',
    valueInUSD: 0.71
  },
  {
    code: 'TL',
    name: 'Turkish Lira',
    symbol: '₺',
    valueInUSD: 0.037
  }
];

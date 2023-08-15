import { ICurrency, IItem } from '@/db/types';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { SxProps } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { sortBy } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AutocompleteSelect from './AutocompleteSelect';
import BasicSelect from './BasicSelect';
import { Header } from './Header';
import ManageDialog from './ManageDialog';
import { RecordRow } from './RecordRow';

const drawerWidth = 380;

export default function MainPage() {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [currency, setCurrency] = useState<ICurrency | undefined>({
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    valueInUSD: 1
  });
  const [totalCurrency, setTotalCurrency] = useState<ICurrency>({
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    valueInUSD: 1
  });

  const [filterCurrency, setFilterCurrency] = useState<ICurrency | undefined>(undefined);

  const [filterType, setFilterType] = useState('');

  const [currentFinanceRecordId, setCurrentFinanceRecordId] = useState<number>(-1);
  const [financeRecords, setFinanceRecords] = useState<IItem[]>([]);

  const filteredFinanceRecords = useMemo(() => {
    if (filterType === '' && !filterCurrency) {
      return financeRecords;
    }

    if (filterType === '' && filterCurrency) {
      return financeRecords.filter(item => item.currency.code === filterCurrency.code);
    }

    if (filterType !== '' && !filterCurrency) {
      return financeRecords.filter(item => item.type === filterType);
    }

    return financeRecords.filter(item => item.type === filterType && item.currency.code === filterCurrency?.code);
  }, [filterCurrency, filterType, financeRecords]);

  const sortedFinanceRecords = useMemo(
    () => sortBy(filteredFinanceRecords, x => x.createdAt).reverse(),
    [filteredFinanceRecords]
  );

  const totalIncomeInUSDCurrency = financeRecords.reduce((acc, item) => {
    if (item.type === 'income') {
      return acc + item.amount;
    }

    return acc;
  }, 0);

  const totalIncomeInGeneralCurrency = useMemo(
    () => totalIncomeInUSDCurrency / totalCurrency.valueInUSD,
    [totalCurrency.valueInUSD, totalIncomeInUSDCurrency]
  );

  const totalExpenseInUSDCurrency = useMemo(
    () =>
      financeRecords.reduce((acc, item) => {
        if (item.type === 'expense') {
          return acc + item.amountInUSD;
        }

        return acc;
      }, 0),
    [financeRecords]
  );

  const totalExpenseInGeneralCurrency = useMemo(
    () => totalExpenseInUSDCurrency / totalCurrency.valueInUSD,
    [totalCurrency.valueInUSD, totalExpenseInUSDCurrency]
  );

  const totalBalanceInGeneralCurrency = useMemo(
    () => totalIncomeInGeneralCurrency - totalExpenseInGeneralCurrency,
    [totalExpenseInGeneralCurrency, totalIncomeInGeneralCurrency]
  );

  const onOpenAddIncome = useCallback(() => {
    setOpenAddDialog(!openAddDialog);
    setType('income');
  }, [openAddDialog]);

  const onOpenAddExpense = useCallback(() => {
    setOpenAddDialog(!openAddDialog);
    setType('expense');
  }, [openAddDialog]);

  const onClearFilters = useCallback(() => {
    setFilterCurrency(undefined);
    setFilterType('');
  }, []);

  const onAddFinanceRecord = useCallback(() => {
    if (!currency || !description || !amount) {
      return;
    }

    const newFinanceRecord: IItem = {
      id: financeRecords.length,
      amount,
      description,
      type,
      createdAt: new Date(),
      currency: currency!,
      amountInUSD: amount * currency!.valueInUSD
    };

    setFinanceRecords([...financeRecords, newFinanceRecord]);
    setOpenAddDialog(false);

    localStorage.setItem('financeRecords', JSON.stringify([...financeRecords, newFinanceRecord]));

    setAmount(0);
    setDescription('');
    setCurrency({
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      valueInUSD: 1
    });
  }, [amount, currency, description, financeRecords, type]);

  const onOpenEditFinanceRecord = useCallback(
    (id: number) => {
      const instantFinanceRecord = financeRecords.find(x => x.id === id)!;

      setCurrentFinanceRecordId(instantFinanceRecord?.id);

      setDescription(instantFinanceRecord.description);
      setAmount(instantFinanceRecord.amount);
      setCurrency(instantFinanceRecord.currency);

      setOpenEditDialog(true);
    },
    [financeRecords]
  );

  const onEditFinanceRecord = useCallback(() => {
    const copyFinanceRecord = financeRecords.find(x => x.id === currentFinanceRecordId);

    const newFinanceRecord: IItem = {
      id: copyFinanceRecord!.id,
      amount,
      description,
      type: copyFinanceRecord!.type,
      createdAt: new Date(),
      currency: currency!,
      amountInUSD: amount * currency!.valueInUSD
    };

    const newArray = financeRecords.filter(x => x.id !== currentFinanceRecordId);

    setFinanceRecords([...newArray, newFinanceRecord]);
    localStorage.setItem('financeRecords', JSON.stringify([...newArray, newFinanceRecord]));

    setDescription('');
    setAmount(0);
    setCurrency({
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      valueInUSD: 1
    });

    setOpenEditDialog(false);
  }, [amount, currency, currentFinanceRecordId, description, financeRecords]);

  const onDeleteFinanceRecord = useCallback(
    (id: number) => {
      const newArray = financeRecords.filter(x => x.id !== id);

      setFinanceRecords(newArray);
      localStorage.setItem('financeRecords', JSON.stringify(newArray));
    },
    [financeRecords]
  );

  useEffect(() => {
    const financeRecordsString = localStorage.getItem('financeRecords');
    if (financeRecordsString) {
      setFinanceRecords(JSON.parse(financeRecordsString) as IItem[]);
    }
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Add Dialog */}
      <ManageDialog
        amount={amount}
        currency={currency}
        description={description}
        onManageFinanceRecord={onAddFinanceRecord}
        openDialog={openAddDialog}
        setOpenDialog={setOpenAddDialog}
        setAmount={setAmount}
        setCurrency={setCurrency}
        setDescription={setDescription}
        type={type}
      />

      {/* Edit Dialog */}

      <ManageDialog
        amount={amount}
        currency={currency}
        description={description}
        onManageFinanceRecord={onEditFinanceRecord}
        openDialog={openEditDialog}
        setOpenDialog={setOpenEditDialog}
        setAmount={setAmount}
        setCurrency={setCurrency}
        setDescription={setDescription}
        type={type}
      />

      <Header totalBalance={totalBalanceInGeneralCurrency.toFixed(3)} currency={totalCurrency.code} />
      <Drawer variant='permanent' sx={styles.drawerStyle}>
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <Box sx={styles.sideBarButtonsBox}>
            <Button variant='outlined' color='success' startIcon={<AddIcon />} onClick={onOpenAddIncome}>
              Income
            </Button>
            <Button variant='outlined' color='error' startIcon={<RemoveIcon />} onClick={onOpenAddExpense}>
              Expense
            </Button>
          </Box>

          <Box sx={styles.sideBarTextsBox}>
            <Typography
              variant='h6'
              noWrap
              component='div'
              style={{
                margin: '0 1rem'
              }}
            >
              Base currency:
            </Typography>

            <AutocompleteSelect currency={totalCurrency} setCurrency={setTotalCurrency} />
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              marginTop: 4
            }}
          >
            <Typography
              variant='h6'
              noWrap
              component='div'
              style={{
                margin: '0 1rem'
              }}
            >
              Total Income:
            </Typography>
            <Typography
              variant='h6'
              noWrap
              component='div'
              style={{
                margin: '0 1rem'
              }}
            >
              {totalIncomeInGeneralCurrency.toFixed(3)} {totalCurrency.symbol}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row'
            }}
          >
            <Typography
              variant='h6'
              noWrap
              component='div'
              style={{
                margin: '0 1rem'
              }}
            >
              Total Expenses:
            </Typography>
            <Typography
              variant='h6'
              noWrap
              component='div'
              style={{
                margin: '0 1rem'
              }}
            >
              {totalExpenseInGeneralCurrency.toFixed(3)} {totalCurrency.symbol}
            </Typography>
          </Box>
        </Box>

        <Typography variant='h6' noWrap component='div' sx={styles.financeTrackerTypography}>
          Finance Tracker
        </Typography>
      </Drawer>
      <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />

        <Box sx={styles.textBox}>
          <Typography
            variant='h6'
            noWrap
            component='div'
            style={{
              margin: 1
            }}
          >
            Filters:
          </Typography>

          <BasicSelect filterType={filterType} setFilterType={setFilterType} />
          <AutocompleteSelect currency={filterCurrency} setCurrency={setFilterCurrency} />

          <Button
            sx={{ margin: 1 }}
            variant='outlined'
            color='error'
            startIcon={<DeleteIcon />}
            onClick={onClearFilters}
            size='medium'
          >
            Clear
          </Button>
        </Box>

        {sortedFinanceRecords.map(item => {
          return (
            <RecordRow
              key={item.id}
              item={item}
              onDeleteFinanceRecord={onDeleteFinanceRecord}
              onOpenEditFinanceRecord={onOpenEditFinanceRecord}
            />
          );
        })}
      </Box>
    </Box>
  );
}

const styles = {
  textBox: {
    display: 'flex',
    justifySelf: 'flex-start',
    justifyContent: 'space-around',
    p: 1,
    marginTop: 4,
    alignItems: 'center',
    width: '50%',
    flexWrap: 'wrap'
  } as SxProps,

  financeTrackerTypography: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    padding: '1rem'
  } as SxProps,

  sideBarButtonsBox: {
    display: 'flex',
    justifyContent: 'space-around',
    p: 1,
    marginTop: 4
  } as SxProps,

  sideBarTextsBox: {
    display: 'flex',
    justifyContent: 'space-around',
    p: 1,
    marginTop: 4,
    alignItems: 'center'
  } as SxProps,

  drawerStyle: {
    width: drawerWidth,
    flexShrink: 0,
    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
  } as SxProps
};

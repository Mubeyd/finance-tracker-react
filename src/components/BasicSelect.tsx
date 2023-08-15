import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function BasicSelect({
  filterType,
  setFilterType
}: {
  filterType: string;
  setFilterType: (type: string) => void;
}) {
  const handleChange = (event: SelectChangeEvent) => {
    setFilterType(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 120, margin: 0 }}>
      <FormControl fullWidth>
        <InputLabel size='small' id='demo-simple-select-label'>Type</InputLabel>
        <Select
          labelId='demo-simple-select-label'
          id='demo-simple-select'
          value={filterType}
          label='Type'
          onChange={handleChange}
          size='small'
        >
          <MenuItem value={''}>None</MenuItem>
          <MenuItem value={'income'}>Income</MenuItem>
          <MenuItem value={'expense'}>Expenses</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

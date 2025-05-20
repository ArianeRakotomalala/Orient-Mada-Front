import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
  Input
} from '@mui/material';
function Try({ label, icone }) {
    return (
<FormControl variant="standard">
        <InputLabel htmlFor="input-with-icon-adornment">
          {label}
        </InputLabel>
        <Input
          id="input-with-icon-adornment"
          startAdornment={
            <InputAdornment position="start">
              {icone}
            </InputAdornment>
          }
        />
</FormControl>
    );
}

export default Try;

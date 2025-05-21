import TextField  from "@mui/material/TextField"
function Formulaire({ id ,label, name, autoComplete ,type, icone, value, onChange }) {
  return (
    <TextField
                margin="normal"
                required
                fullWidth
                id={id}
                label={label}
                name={ name }
                autoComplete={autoComplete}
                type={type}
                sx={{ width : { xs: '100%', sm: '100%', md:'90%' } }}
                icone={icone} 
                value={value}
                onChange={onChange}
    />
  );
}
export default Formulaire;



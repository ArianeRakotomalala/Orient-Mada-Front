import  {Button } from '@mui/material';
function Bouton({label, backgroundColor, color, borderColor,hoverbackground, hoverColor ,startIcon, ...props}) {
    return(
    <Button
        type="submit"
        fullWidth
        variant="outlined"
        sx={{
            color: color,
            borderColor: 'black',
            fontWeight: 'bold',
            mb: 2,
            backgroundColor: backgroundColor,
            width: { xs: '100%', sm: '100%', md: '90%' },
            '&:hover': { backgroundColor: hoverbackground , color: hoverColor, borderColor:borderColor  },
        }}
        startIcon ={startIcon}
        {...props}
    >
    
    {label}
    </Button> 
    )}
export default Bouton;
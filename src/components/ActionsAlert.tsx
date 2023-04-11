import { Alert, AlertColor, AlertTitle } from "@mui/material";

interface AlertProps {
    severity: AlertColor,
    title: string,
    message: string;
}

const ActionAlert = ({ severity, title, message }: AlertProps) => {
    return (
        <Alert
            variant='outlined'
            severity={severity}
            sx={{
                marginTop: '2vh',
                width: '80vw',
                minWidth: '350px',
                maxWidth: '40rem'
            }}
        >
            <AlertTitle>{title}</AlertTitle>
            {message}
        </Alert>
    );
};

export default ActionAlert;
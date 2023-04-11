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
                position: 'absolute',
                left: '50%',
                transform: 'translate(-50%, 0)',
                marginTop: '2vh',
                width: '80vw',
                maxWidth: '60rem'
            }}
        >
            <AlertTitle>{title}</AlertTitle>
            {message}
        </Alert>
    );
};

export default ActionAlert;
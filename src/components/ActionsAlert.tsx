import { Alert, AlertColor, AlertTitle } from "@mui/material"

interface AlertProps {
    severity: AlertColor,
    title: string,
    message: string
}

const ActionAlert = ({ severity, title, message }: AlertProps) => {
    return (
        <Alert variant='outlined' severity={severity} style={{position: 'absolute', margin: '20px 10%', width: '80vw'}}>
            <AlertTitle>{title}</AlertTitle>
            {message}
        </Alert>
    )
}

export default ActionAlert
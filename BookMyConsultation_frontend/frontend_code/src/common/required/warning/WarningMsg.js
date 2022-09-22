import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useContext } from "react";
import AppContext from "../../../screens/context/context";


const AlertMessage = () => {

	const { notification } = useContext(AppContext);

	const closeHandler = () => {
		notification.request(false);
	}

	return (
		<Snackbar
			open={notification.isRequested}
			autoHideDuration={3000}
			anchorOrigin={{vertical: "bottom", horizontal: "right"}}
			onClose={closeHandler}
		>
			<Alert variant="filled" severity={notification.severity}>
				{notification.message}
			</Alert>
		</Snackbar>
	);
};

export default AlertMessage;

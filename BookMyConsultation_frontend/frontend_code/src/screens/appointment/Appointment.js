import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import AppointmentCard from "../../common/required/Tab/appointmentTab/AppointmentTab";
import Context from "../context/context";
import { getRequest } from "../../util/fetch";
import { internalServerError, ok, unauthorizedOrForbidden,} from "../api/response";
import APP_URL from "../api/urls";
import RateAppoinment from "./RateAppointment";
import { Typography } from "@material-ui/core";


const Appointment = () => {

	// useState
	const [appointmentList, setAppointmentList] = useState([]);
	const [rateAppoinmentIsOpen, setRateAppoinmentOpen] = useState(false);
	const [appointmentDetails, setAppointmentDetails] = useState({});

	const { auth, notification } = useContext(Context);


	// get email id using access token

	const fetchUserEmailId = useCallback(async () => {
		const rawResponse = await getRequest(APP_URL.USER_BY_TOKEN);

		if (ok(rawResponse)) {
			const response = await rawResponse.json();
			return response.emailId;
		} else {
			if (unauthorizedOrForbidden(rawResponse)) {                     // unauthorized or forbidden
				const response = await rawResponse.json();
				notification.setDetails("error", response.message);
			} else if (internalServerError(rawResponse)) {                  // internal server error
				notification.setDetails(
					"error",
					"Invalid user details provided, please login again!"
				);
			}
			return null;
		}
	}, [notification]);


	// get all user appointments

	const fetchUserAppointments = useCallback(
		async (userId) => {
			const rawResponse = await getRequest(
				APP_URL.APPOINTMENTS_BY_USER_ID(userId)
			);

			if (ok(rawResponse)) {
				const response = await rawResponse.json();
				setAppointmentList(response);
			} else {
				if (unauthorizedOrForbidden(rawResponse)) {             // unauthorized / forbidden
					const response = await rawResponse.json();
					notification.setDetails("error", response.message);
				}
			}
		},
		[notification]
	);

	// to show rating modal

	const showRateAppointmentModal = (appointment) => {
		setAppointmentDetails(appointment);
		setRateAppoinmentOpen(true);
	}


	useEffect(() => {
		const fillAppointmentsList = async () => {
			if (auth.isLoggedIn) {
				const emailId = await fetchUserEmailId();
				if (emailId !== null) {
					fetchUserAppointments(emailId);
				}
			}
		};

		fillAppointmentsList();
	}, [auth.isLoggedIn, fetchUserEmailId, fetchUserAppointments]);



	return (
		<Fragment>

			{!auth.isLoggedIn && (<Typography variant="h6" align="center">Login to see appointments</Typography>)}
			{auth.isLoggedIn && appointmentList.map((appointment) => {
					return (
						<AppointmentCard key={appointment.appointmentId} appointment={appointment} onRateAppoinment={showRateAppointmentModal}/>
					);
				})}

			{rateAppoinmentIsOpen && (
				<RateAppoinment modalIsOpen={rateAppoinmentIsOpen} onModalClose={() => {setRateAppoinmentOpen(false);}} appointmentDetails={appointmentDetails}/>
			)}


		</Fragment>
	);
};

export default Appointment;

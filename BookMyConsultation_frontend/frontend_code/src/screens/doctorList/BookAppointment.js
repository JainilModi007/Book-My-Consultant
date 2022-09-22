import {Button,FormControl,FormHelperText,InputLabel,MenuItem,Select,TextField,} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {MuiPickersUtilsProvider,KeyboardDatePicker,} from "@material-ui/pickers";
import { useContext, useState } from "react";
import AppModal from "../../common/required/ApplicationModal/ApplicationModal";
import FormCard from "../../common/required/Tab/formTab/FormTab";
import { badRequest, internalServerError, ok, unauthorizedOrForbidden } from "../api/response";
import Context from "../context/context";
import { getRequest, postRequest } from "../../util/fetch";
import APP_URL from "../api/urls";


const BookAppointment = (props) => {

    // state

	const initialState = {
		appointmentDate: new Date(),
		timeSlot: "",
		symptoms: "",
		medicalHistory: "",
	};

	// useState

	const [appointmentDetails, setAppointmentDetails] = useState(initialState);
	const [timeSlotList, setTimeSlotList] = useState([]);
	const [timeSlotError, setTimeSlotError] = useState(false);
	const { doctorDetails } = props;
	const { notification } = useContext(Context);



	// for reset state

	const resetStateToInitialState = () => {
		setAppointmentDetails(initialState);
		setTimeSlotError(false);
		setTimeSlotList([]);
	};

    // get date

	const getISODate = (date) => {
		return date.toISOString().split("T")[0];
	};

    // get doctor name

	const getDoctorFullName = () => {
		return `${doctorDetails.firstName} ${doctorDetails.lastName}`;
	};

    // handler for appointmentDate

	const appointmentDateChangeHandler = (newValue) => {
		setAppointmentDetails((prevState) => {
			return {
				...prevState,
				appointmentDate: newValue,
			};
		});

		fetchDoctorTimeSlots(doctorDetails.id, getISODate(newValue));
	};


    // handler for timeSlot

	const timeSlotChangeHandler = (event) => {
		setAppointmentDetails((prevState) => {
			return {
				...prevState,
				timeSlot: event.target.value,
			};
		});
		if(timeSlotError) {
			setTimeSlotError(false);
		}
	};

    // handler for medicalHistory

	const medicalHistoryChangeHandler = (event) => {
		setAppointmentDetails((prevState) => {
			return {
				...prevState,
				medicalHistory: event.target.value,
			};
		});
	};

    // handler for symptoms

	const symptomsChangeHandler = (event) => {
		setAppointmentDetails((prevState) => {
			return {
				...prevState,
				symptoms: event.target.value,
			};
		});
	};


	// fetching user details (access token)

	const fetchUserDetails = async () => {
		const rawResponse = await getRequest(APP_URL.USER_BY_TOKEN);

		if(ok(rawResponse)) {
			const response = await rawResponse.json();
			return response;
		} else {
			if(unauthorizedOrForbidden(rawResponse)) {              // unauthorized or forbidden
				const response = await rawResponse.json();
				notification.setDetails("error", response.message);
			} else if (internalServerError(rawResponse)) {          // internal server error
				notification.setDetails(
					"error",
					"Invalid user details provided, please login again!"
				);
			}
			return null;
		}
	};


	// fetch timeslots

	const fetchDoctorTimeSlots = async (doctorId, appointmentDate) => {
		const rawResponse = await getRequest(
			APP_URL.DOCTOR_TIMESLOT(doctorId, appointmentDate)
		);

		if(ok(rawResponse)) {
			const response = await rawResponse.json();
			setTimeSlotList(response.timeSlot);
		} else {
			notification.setDetails(
				"error",
				"Invalid parmeters provided, try again!"
			);
		}
	};

	// book appointment

	const bookAppointment = async (appointmentData) => {
		const rawResponse = await postRequest(
			APP_URL.BOOK_APPOINTMENT,
			appointmentData
		);

		if (ok(rawResponse)) {
			notification.setDetails(
				"success",
				"Appointment Booked Successfully"
			);
			return true;
		} else {
			if (unauthorizedOrForbidden(rawResponse)) {
				const response = await rawResponse.json();
				notification.setDetails("error", response.message);
			} else if(badRequest(rawResponse)) {
				alert("Either the slot is already booked or not available")
			}

			return false;
		}
	};


	// handler for submit

	const submitHandler = async (event) => {
		event.preventDefault();
		if (appointmentDetails.timeSlot === "") {               // validation
			setTimeSlotError(true);
			return;
		}

		const userDetails = await fetchUserDetails();
		if (userDetails === null) {
			return;
		}

		const appointmentData = {
			doctorId: doctorDetails.id,
			doctorName: getDoctorFullName(),
			userId: userDetails.emailId,
			userName: `${userDetails.firstName} ${userDetails.lastName}`,
			userEmailId: userDetails.emailId,
			timeSlot: appointmentDetails.timeSlot,
			appointmentDate: getISODate(appointmentDetails.appointmentDate),
			symptoms: appointmentDetails.symptoms,
			priorMedicalHistory: appointmentDetails.medicalHistory === "" ? "NA" : appointmentDetails.medicalHistory,
		};

		const bookingStatus = await bookAppointment(appointmentData);
		if (!bookingStatus) {
			return;
		}

		props.onModalClose();
	};

	return (

		<AppModal isOpen={props.modalIsOpen} onRequestClose={props.onModalClose} title="Book an Appointment" onAfterClose={resetStateToInitialState}>

			<FormCard onSubmit={submitHandler} padding>

				{/* Doctor name */}

				<TextField disabled required label="Doctor Name" margin="normal" value={getDoctorFullName()} className="form-input"/>


				{/* Appointment date */}

				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<KeyboardDatePicker disableToolbar variant="inline" format="MM/dd/yyyy" label="Apointment date" margin="normal" minDate={Date.now()} className="form-input" value={appointmentDetails.appointmentDate} onChange={appointmentDateChangeHandler} KeyboardButtonProps={{"aria-label": "change date",}}/>
				</MuiPickersUtilsProvider>


				{/* Time slot  */}

				<FormControl error={timeSlotError} margin="normal" className="form-input">

					<InputLabel>Timeslot</InputLabel>
					<Select	value={appointmentDetails.timeSlot} onChange={timeSlotChangeHandler}>
						{timeSlotList.map((timeslot) => {
							return (
								<MenuItem key={timeslot} value={timeslot}>
									{timeslot}
								</MenuItem>
							);
						})}
					</Select>

					<FormHelperText>{timeSlotError && "Select a time slot"}</FormHelperText>

				</FormControl>



				{/* Medical history  */}

				<FormControl margin="normal" className="form-input">
					<TextField label="Medical History" multiline rows={4} value={appointmentDetails.medicalHistory} onChange={medicalHistoryChangeHandler}/>
				</FormControl>

				{/* Symptoms */}

				<FormControl margin="normal" className="form-input">
					<TextField label="Symptoms" multiline rows={4} value={appointmentDetails.symptoms} onChange={symptomsChangeHandler}/>
				</FormControl>


				<br />


				{/* button for Book appointment  */}

				<Button type="submit" variant="contained" color="primary" className="form-btn2"> Book Appointment </Button>

			</FormCard>
		</AppModal>
	);
};

export default BookAppointment;

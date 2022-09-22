import { Fragment, useContext, useEffect, useState } from "react";
import { TextField, Typography } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import Context from "../context/context";
import { getRequest } from "../../util/fetch";
import { ok } from "../api/response";
import APP_URL from "../api/urls";
import classes from "./DoctorList.module.css";
import DoctorCard from "../../common/required/Tab/doctorTab/DoctorTab";
import BookAppointment from "../doctorList/BookAppointment";
import DoctorDetails from "./DoctorDetails";



const DoctorList = (props) => {


	// useState for each field

 	const [doctorList, setDoctorList] = useState([]);
	const [specialityList, setSpecialityList] = useState([]);
	const [bookAppointmentIsOpen, setBookAppointmentOpen] = useState(false);
	const [doctorDetailsIsOpen, setDoctorDetailsOpen] = useState(false);
	const [appointmentDoctor, setAppointmentDoctor] = useState({});
	const { notification, auth } = useContext(Context);



     // Get all the doctors

    	const fetchAllDoctors = async () => {
    		const rawResponse = await getRequest(APP_URL.ALL_DOCTORS);
    		if(ok(rawResponse)) {
    			const response = await rawResponse.json();
    			setDoctorList(response);
    		}
    	};



	// Get all specialities

	const fetchAllSpecialities = async () => {
		const rawResponse = await getRequest(APP_URL.DOCTOR_SPECIALITIES);
		if(ok(rawResponse)) {
			const response = await rawResponse.json();
			setSpecialityList(["", ...response]);
		}
	};



	// Get doctor for specific speciality

	const fetchDoctorsBySpeciality = async (speciality) => {
		const rawResponse = await getRequest(
			APP_URL.ALL_DOCTORS_BY_SPECIALITY + speciality
		);

		if(ok(rawResponse)) {
			const response = await rawResponse.json();
			setDoctorList(response);
		}
	};



	// for book appointment modal

	const showAppointmentModal = async (doctor) => {
		if (!auth.isLoggedIn) {
			notification.setDetails("error", "Login to book appointment");
			return;
		}

		setAppointmentDoctor(doctor);
		setBookAppointmentOpen(true);
	};


	// for doctor details modal

	const showDoctorDetailsModal = (doctor) => {
		setAppointmentDoctor(doctor);
		setDoctorDetailsOpen(true);
	};


     // event handler for speciality

    	const specialityChangeHandler = (event, newValue) => {
    		if (newValue !== null) {
    			fetchDoctorsBySpeciality(newValue);
    		} else {
    			fetchAllDoctors();
    		}
    	};


    // useEffect hook for get speciality and doctor
	useEffect(() => {
		fetchAllSpecialities();
		fetchAllDoctors();
	}, []);


	return (

		<Fragment>

			 {/* filter */}

			<div className={classes.filter}>
				<Typography variant="h6"> Select Speciality:</Typography>
				<Autocomplete options={specialityList} renderInput={(params) => (<TextField {...params} variant="filled" />)} onChange={specialityChangeHandler}/>
			</div>


			{/* Doctors list */}

			{doctorList.map((doctor) => {
				return (
					<DoctorCard key={doctor.id} doctor={doctor} onBookAppointment={showAppointmentModal} onDoctorDetails={showDoctorDetailsModal}/>
				);
			})}


			{/* Book appointment */}

			{bookAppointmentIsOpen && (
				<BookAppointment modalIsOpen={bookAppointmentIsOpen} onModalClose={() => {setBookAppointmentOpen(false)}} doctorDetails={appointmentDoctor}/>
			)}


			{/* Doctor details */}

			{doctorDetailsIsOpen && (
				<DoctorDetails modalIsOpen={doctorDetailsIsOpen} onModalClose={() => {setDoctorDetailsOpen(false);}} doctorDetails={appointmentDoctor}/>
			)}


		</Fragment>
	);
};

export default DoctorList;

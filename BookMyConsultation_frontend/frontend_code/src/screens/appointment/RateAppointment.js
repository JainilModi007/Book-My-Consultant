import { useState, useContext } from "react";
import { Rating } from "@material-ui/lab";
import { ok, unauthorizedOrForbidden } from "../api/response";
import Context from "../context/context";
import FormCard from "../../common/required/Tab/formTab/FormTab";
import AppModal from "../../common/required/ApplicationModal/ApplicationModal";
import {Button,FormControl,	FormHelperText,TextField,Typography,} from "@material-ui/core";
import { postRequest } from "../../util/fetch";
import APP_URL from "../api/urls";


const RateAppoinment = (props) => {

	// useState
	const [ratingDetails, setRatingDetails] = useState({comment: "",rating: 0,});
	const [ratingError, setRatingError] = useState(false);
	const { notification } = useContext(Context);
	const { appointmentDetails } = props;


    // handler for comment

	const commentChangeHandler = (event) => {
		setRatingDetails((prevState) => {
			return {
				...prevState,
				comment: event.target.value,
			};
		});
	};

	// handler for rating

	const ratingChangeHandler = (event, newValue) => {
		setRatingDetails((prevState) => {
			return {
				...prevState,
				rating: newValue,
			};
		});
		if (ratingError) {
			setRatingError(false);
		}
	};

    // method for rating

	const rateAppointment = async (ratingData) => {
		const rawResponse = await postRequest(
			APP_URL.RATE_APPOINTMENT,
			ratingData
		);

		if (ok(rawResponse)) {
			notification.setDetails("success", "Appointment Rating Successful");
			return true;
		} else {
			if(unauthorizedOrForbidden(rawResponse)) {
				const response = await rawResponse.json();
				notification.setDetails("error", response.message);
			}

			return false;
		}
	};


    //handler for submit rating

	const submitHandler = async (event) => {
		event.preventDefault();
		if (ratingDetails.rating === 0) {               // validation
			setRatingError(true);
			return;
		}

		const ratingData = {
			appointmentId: appointmentDetails.appointmentId,
			doctorId: appointmentDetails.doctorId,
			rating: ratingDetails.rating,
			comments: ratingDetails.comment,
		};

		const ratingStatus = await rateAppointment(ratingData);
		if (!ratingStatus) {
			return;
		}

		props.onModalClose();
	};


	return (
		<AppModal isOpen={props.modalIsOpen} onRequestClose={props.onModalClose} title="Rate an Appointment">
			<FormCard onSubmit={submitHandler} padding>

				{/* Comments */}

				<FormControl margin="normal" className="form-input">
					<TextField label="Comments" multiline rows={4} value={ratingDetails.comment} onChange={commentChangeHandler}/>
				</FormControl>


				{/*  Ratings  */}

				<FormControl margin="normal" className="form-input">
					<Typography>
						Rating:{" "}
						<Rating name="rate-appointment" size="small" value={ratingDetails.rating} onChange={ratingChangeHandler}/>
					</Typography>

					<FormHelperText style={{ color: "red" }}>
						{ratingError && "Submit a rating"}
					</FormHelperText>

				</FormControl>


				<br />

				{ /*submit button*/ }

				<Button type="submit" variant="contained" color="primary" className="form-btn2"> Rate Appointment</Button>

			</FormCard>
		</AppModal>
	);
};

export default RateAppoinment;

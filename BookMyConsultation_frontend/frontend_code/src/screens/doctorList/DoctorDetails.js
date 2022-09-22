import classes from "./DoctorDetails.module.css";
import { Typography } from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import AppModal from "../../common/required/ApplicationModal/ApplicationModal";



const DoctorDetails = (props) => {

	const { doctorDetails } = props;

	return (
		<AppModal isOpen={props.modalIsOpen} onRequestClose={props.onModalClose} title="Doctor Details">

			<div className={classes.card}>

			    { /*first name - last name  */}

				<Typography className={classes.name}>
					{`Dr : ${doctorDetails.firstName} ${doctorDetails.lastName}`}
				</Typography>

                { /* Total experience */}

				<Typography className={classes.details}>
					{`Total Experience : ${doctorDetails.totalYearsOfExp} years`}
				</Typography>

				{/* Speciality */}

				<Typography className={classes.details}>
					{`Speciality : ${doctorDetails.speciality}`}
				</Typography>

				{/* date of birth */}

				<Typography className={classes.details}>
					{`Date of Birth : ${doctorDetails.dob}`}
				</Typography>

				{ /* city */}

				<Typography className={classes.details}>
					{`City: ${doctorDetails.address.city}`}
				</Typography>

				{/* email */}

				<Typography className={classes.details}>
					{`Email : ${doctorDetails.emailId}`}
				</Typography>

				{ /* mobile number */}

				<Typography className={classes.details}>
					{`Mobile: ${doctorDetails.mobile}`}
				</Typography>

				{/* Rating */}

				<Typography className={classes.details}>
					Rating:{" "}
					<Rating value={doctorDetails.rating} size="small" readOnly/>
				</Typography>

			</div>
		</AppModal>
	);
};

export default DoctorDetails;

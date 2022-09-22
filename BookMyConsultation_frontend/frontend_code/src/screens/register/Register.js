import { useState } from "react";
import { useContext } from "react";
import { Button, FormControl, FormHelperText, Input,InputLabel} from "@material-ui/core";
import Context from "../context/context";
import { userRegistration } from "../../util/fetch";
import { badRequest, ok, unauthorizedOrForbidden, unprocessableEntity} from "../api/response";
import FormCard from "../../common/required/Tab/formTab/FormTab";

const Register = (props) => {

	// useState for each field

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [mobileNumber, setMobileNumber] = useState("");
	const [emailError, setEmailError] = useState(false);
	const [mobileError, setMobileError] = useState(false);
	const { notification } = useContext(Context);


    // event handler for firstName

	const firstNameChangeHandler = (event) => {
		setFirstName(event.target.value);
	};

    // event handler for lastName

	const lastNameChangeHandler = (event) => {
		setLastName(event.target.value);
	};

    // event handler for email

	const emailChangeHandler = (event) => {
		setEmail(event.target.value);
		if (emailError) {
			setEmailError(false);
		}
	};

    // event handler for password

	const passwordChangeHandler = (event) => {
		setPassword(event.target.value);
	};

    // event handler for mobile number

	const mobileNumberChangeHandler = (event) => {
		setMobileNumber(event.target.value);
		if (mobileError) {
			setMobileError(false);
		}
	};

	// event handler for register submit details request

    	const submitHandler = async (event) => {
    		event.preventDefault();

    		var sign = email.indexOf("@");                  // validation
    		var dot = email.indexOf(".");

    		if ((sign < 1) || (dot <= sign + 2) || (dot === sign.length - 1)) {
    			setEmailError(true);
    			return;
    		}else if (mobileNumber.length !== 10 || isNaN(+mobileNumber)) {
    			setMobileError(true);
    			return;
    		}

    		const userDetails = {
    			emailId: email,
    			password: password,
    			firstName: firstName,
    			lastName: lastName,
    			mobile: mobileNumber,
    		};

    		registerUser(userDetails);
    	};

	// method for register a user


	const registerUser = async (userDetails) => {
		const rawResponse = await userRegistration(userDetails);

		if (ok(rawResponse)) {                                       // for success
			notification.setDetails("success", "Registration Successful");
			props.onModalClose();
		} else {                                                    // for unauthorized  or forbidden
			if (unauthorizedOrForbidden(rawResponse)) {
				const response = await rawResponse.json();
				notification.setDetails("error", response.message);
			} else if (unprocessableEntity(rawResponse)) {          // for email already exists
				notification.setDetails(
					"error",
					`User with email ${email} already exists`
				);
			} else if (badRequest(rawResponse)) {               // if invalid details
				notification.setDetails("error", `Invalid details provided`);
			}
		}
	};




	return (
		<FormCard onSubmit={submitHandler} centerAligned>


			{/* for First name */}


			<FormControl margin="normal" required className="form-input">
				<InputLabel htmlFor="firstName">First Name</InputLabel>
				<Input id="firstName" type="text" value={firstName} onChange={firstNameChangeHandler} autoComplete="off"/>
			</FormControl>



			{/* for Last name */}


			<FormControl margin="normal" required className="form-input">
				<InputLabel htmlFor="lastName">Last Name</InputLabel>
				<Input id="lastName" type="text" value={lastName} onChange={lastNameChangeHandler} autoComplete="off"/>
			</FormControl>


			{/* for Email  */}


			<FormControl error={emailError} margin="normal" required className="form-input">
				<InputLabel htmlFor="email">Email</InputLabel>
				<Input id="email" type="text" value={email}	onChange={emailChangeHandler} autoComplete="off"/>
				<FormHelperText> {emailError ? "Enter valid Email" : ""}</FormHelperText>
			</FormControl>



			{/* for Password */}


			<FormControl margin="normal" required className="form-input">
				<InputLabel htmlFor="password">Password</InputLabel>
				<Input id="password" type="password" value={password} onChange={passwordChangeHandler} autoComplete="off"/>
			</FormControl>


			{/* for Mobile number*/}


			<FormControl error={mobileError} margin="normal" required className="form-input">
				<InputLabel htmlFor="mobile">Mobile no</InputLabel>
				<Input id="mobile" type="text" value={mobileNumber} onChange={mobileNumberChangeHandler} autoComplete="off"/>
				<FormHelperText> {mobileError ? "Enter valid mobile number" : ""}</FormHelperText>
			</FormControl>


			<br />


			{/* for Register button */}


			<Button	type="submit" variant="contained" color="primary" className="form-btn"> Register </Button>

		</FormCard>
	);
};

export default Register;

import { useState } from "react";
import { useContext } from "react";
import FormCard from "../../common/required/Tab/formTab/FormTab";
import Context from "../context/context";
import { Button,FormControl,FormHelperText,Input,InputLabel,} from "@material-ui/core";


const Login = (props) => {

	const [email, setEmail] = useState("");                 // use state for email , password
	const [password, setPassword] = useState("");

	const [emailError, setEmailError] = useState(false);
	const { auth } = useContext(Context);


    // event handler for submit login details

	const submitHandler = (event) => {
    		event.preventDefault();
    		var sign = email.indexOf("@");          // validation
    		var dot = email.indexOf(".");
    		if ((sign < 1) || (dot <= sign + 2) || (dot === email.length - 1)) {
    			setEmailError(true);
    			return;
    		}

    		auth.login(email, password, props.onModalClose);
    	};


    // event handler for email

	const emailChangeHandler = (event) => {
		setEmail(event.target.value);
		if(emailError) {
			setEmailError(false);
		}
	};


    // event handler for password

	const passwordChangeHandler = (event) => {
		setPassword(event.target.value);
	};




	return (
		<FormCard onSubmit={submitHandler} centerAligned>

			{ /* email */}

			<FormControl error={emailError} margin="normal" required className="form-input">
                <InputLabel htmlFor="email">Email</InputLabel>
                <Input id="email" type="text" value={email} onChange={emailChangeHandler} autoComplete="off"/>
                <FormHelperText> {emailError ? "Enter valid Email" : ""} </FormHelperText>
			</FormControl>


			{ /* password */}


			<FormControl margin="normal" required className="form-input">
				<InputLabel htmlFor="password">Password</InputLabel>
				<Input id="password" type="password" value={password} onChange={passwordChangeHandler} autoComplete="off"/>
			</FormControl>

			<br />

			{ /*  submit  */}

			<Button type="submit" variant="contained" color="primary" className="form-btn"> Login </Button>


		</FormCard>
	);
};

export default Login;

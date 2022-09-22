import { Fragment } from "react";
import LogoImg from "../../assets/logo.jpeg";
import { Button } from "@material-ui/core";
import classes from "./Header.module.css";
import Context from "../../screens/context/context";
import {useContext} from "react";


const Header = (props) => {

	const { auth } = useContext(Context);                // using context

	return (

		<Fragment>
			<div className={classes["header"]}>

				<div className={classes["logo"]}>
					<img src={LogoImg} alt="doctor logo" />
					<span>Doctor Finder</span>
				</div>

				<div className={classes["btn-container"]}>
					{!auth.isLoggedIn && (<Button className={classes.btn} variant="contained" color="primary" onClick={props.onLoginClick}> Login </Button>)}
					{auth.isLoggedIn && ( <Button className={classes.btn} variant="contained" color="secondary" onClick={auth.logout}>Logout	</Button>)}
				</div>

			</div>
		</Fragment>
	);
};

export default Header;

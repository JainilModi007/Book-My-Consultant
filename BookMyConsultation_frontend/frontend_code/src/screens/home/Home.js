import { Fragment} from "react";
import {useState} from "react";
import Appointment from "../appointment/Appointment";
import DoctorList from "../doctorList/DoctorList";
import TabContainer from "../../common/tabContainer/TabContainer";
import TabPanel from "../../common/tabPanel/TabPanel";


const Home = () => {

	const [indexValue, setIndexValue] = useState(0);

	const indexValueHandler = (event, newValue) => {
		setIndexValue(newValue);
	};

	return (
		<Fragment>

			<TabContainer value={indexValue} valueHandler={indexValueHandler} tabNames={["Doctors", "Appointments"]} variant="fullWidth"/>

			<TabPanel value={indexValue} index={0}>
				<DoctorList />
			</TabPanel>
			<TabPanel value={indexValue} index={1}>
				<Appointment />
			</TabPanel>


		</Fragment>
	);
};

export default Home;

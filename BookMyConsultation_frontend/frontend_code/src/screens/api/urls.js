// for all backend api


const APP_URL = {
    USER_REGISTER: "/users/register",
    USER_LOGIN: "/auth/login",
    USER_LOGOUT: "/auth/logout",
    USER_BY_ID: "/users/",
    USER_BY_TOKEN: "/users/user",
    ALL_DOCTORS: "/doctors",
    DOCTOR_SPECIALITIES: "/doctors/speciality",
    ALL_DOCTORS_BY_SPECIALITY: "/doctors?speciality=",
    DOCTOR_TIMESLOT: (doctorId, appointmentDate) => {
        return `/doctors/${doctorId}/timeSlots?date=${appointmentDate}`;
    },
    BOOK_APPOINTMENT: "/appointments",
    APPOINTMENTS_BY_USER_ID: (userId) => {
        return `/users/${userId}/appointments`;
    },
    RATE_APPOINTMENT: "/ratings"
}

export default APP_URL;
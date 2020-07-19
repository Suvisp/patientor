import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import { Patient } from "../types";
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";

const PatientPage: React.FC = () => {
  const [{ patients }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();
  const patientById = Object.values(patients).find((patient: Patient) => patient.id === id);

  React.useEffect(() => {
    //fetch patient details only if not yet in the app's state
    if (!patientById || !patientById.ssn) {
      const getPatientDetails = async () => {
        try {
          const { data: patientDetails } = await axios.get<Patient>(
            `${apiBaseUrl}/patients/${id}`
          );
          dispatch({ type: "UPDATE_PATIENT", payload: patientDetails });
        } catch (e) {
          console.error(e);
        }
      };
      //otherwise just show the patient details from app's state
      getPatientDetails();
    }
  }, [id, patientById, dispatch]);

  return (
    <div className="App">
      <h3>{patientById?.name}</h3>
      <div>
        gender: {patientById?.gender}
        <br />
                ssn: {patientById?.ssn}
        <br />
                occupation: {patientById?.occupation}
      </div>
    </div>
  );
};

export default PatientPage;

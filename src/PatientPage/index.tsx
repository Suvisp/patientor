import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Icon } from "semantic-ui-react";

import { Patient } from "../types";
import { apiBaseUrl } from "../constants";
import { useStateValue, updatePatient } from "../state";

const PatientPage: React.FC = () => {
  const [{ patients }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();
  const patientById = Object.values(patients).find((patient: Patient) => patient.id === id);

  React.useEffect(() => {
    //fetch patient details only if not yet in the app's state
    if (!patientById || !patientById.ssn) {
      const getPatientDetails = async () => {
        try {
          const { data: patientDetailsFromApi } = await axios.get<Patient>(
            `${apiBaseUrl}/patients/${id}`
          );
          dispatch(updatePatient(patientDetailsFromApi));
          // dispatch({ type: "UPDATE_PATIENT", payload: patientDetailsFromApi });
        } catch (e) {
          console.error(e);
        }
      };
      //otherwise just show the patient details from app's state
      getPatientDetails();
    }
  }, [id, patientById, dispatch]);

  const genderIcon = () => {
    switch (patientById?.gender) {
      case "female":
        return <Icon name="venus" />;
      case "male":
        return <Icon name="mars" />;
      default:
        return <Icon name="neuter" />;
    }
  };

  if (!patientById)
    return <div>no patient details</div>;

  return (
    <div className="App">
      <h3>{patientById.name} {genderIcon()}</h3>
      <div>
        ssn: {patientById.ssn}
        <br />
        occupation: {patientById.occupation}
      </div>
      <h5>entries</h5>
      {patientById.entries.length > 0 ? (
        patientById.entries.map((entry) => (
          <div key={entry.id}>
            <p key={entry.id}>
              {entry.date}
              {" "}
              <em>{entry.description}</em>
            </p>
            <ul>
              {entry.diagnosisCodes !== undefined &&
                entry.diagnosisCodes.map((code: string) => 
                <li key={code}>{code}</li>)}
            </ul>
          </div>))
      ) : (
          <p>no entries</p>
        )}
    </div>
  );
};

export default PatientPage;

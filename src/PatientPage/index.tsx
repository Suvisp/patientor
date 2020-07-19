import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Icon } from "semantic-ui-react";

import { Patient, Diagnosis } from "../types";
import { apiBaseUrl } from "../constants";
import { useStateValue, updatePatient } from "../state";

const PatientPage: React.FC = () => {
  const [{ diagnoses, patients }, dispatch] = useStateValue();
  // const [{ diagnoses }, dispatch] = useStateValue();
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

  const diagnosisName = (code: string): string => {
    const diagnosis = Object.values(diagnoses).find((d: Diagnosis) => d.code === code);
    if (diagnosis) {
      return diagnosis.name;
    } return " ";
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
      {patientById.entries &&
        patientById.entries.map((entry) => (
          <div key={entry.id}>
            <p key={entry.id}>
              {entry.date}
              {" "}
              <em>{entry.description}</em>
            </p>
            <ul>
              {entry.diagnosisCodes &&
                entry.diagnosisCodes.map((code) => (
                  <li key={code}>
                    {code}: {diagnosisName(code)}
                  </li>
                ))}
            </ul>
          </div>
          ))}
    </div>
  );
};

export default PatientPage;

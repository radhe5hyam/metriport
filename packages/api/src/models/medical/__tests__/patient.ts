import { makePatient } from "../../../domain/medical/__tests__/patient";
import { PatientModel } from "../patient";

export function makePatientModel(params?: Partial<PatientModel>): PatientModel {
  const patient = makePatient(params);
  const model = new PatientModel(patient);

  model.data = patient.data;

  return model;
}

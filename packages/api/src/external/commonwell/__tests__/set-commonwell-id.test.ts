import { Patient } from "@metriport/core/domain/patient";
import { setCommonwellIdsAndStatus, CWParams } from "../patient-external-data";
import { PatientModel } from "../../../models/medical/patient";
import { makePatient, makePatientData } from "../../../domain/medical/__tests__/patient";
import { mockStartTransaction } from "../../../models/__tests__/transaction";
import { PatientDataCommonwell } from "../patient-shared";

let patient: Patient;
let patientModel: PatientModel;

let patientModel_findOne: jest.SpyInstance;
let patientModel_update: jest.SpyInstance;

beforeEach(() => {
  mockStartTransaction();
  patientModel = patient as unknown as PatientModel;
  patientModel_findOne = jest.spyOn(PatientModel, "findOne").mockResolvedValue(patientModel);
  patientModel_update = jest.spyOn(PatientModel, "update").mockImplementation(async () => [1]);
});

afterEach(() => {
  jest.restoreAllMocks();
});

const checkPatientUpdateWith = (cwParams: Partial<CWParams>) => {
  expect(patientModel_update).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({
        externalData: expect.objectContaining({
          COMMONWELL: {
            ...(cwParams.commonwellPatientId && { patientId: cwParams.commonwellPatientId }),
            ...(cwParams.commonwellPersonId && { personId: cwParams.commonwellPersonId }),
            ...(cwParams.commonwellStatus && { status: cwParams.commonwellStatus }),
            ...(cwParams.cqLinkStatus && { cqLinkStatus: cwParams.cqLinkStatus }),
          },
        }),
      }),
    }),
    expect.anything()
  );
};

describe("setCommonwellIdsAndStatus", () => {
  it("has CW externalData set to newValues when CW externalData is empty and we set newValues", async () => {
    const patient = makePatient();

    patientModel_findOne.mockResolvedValueOnce(patient);

    const newValues: CWParams = {
      commonwellPatientId: "commonwellPatientId",
      commonwellPersonId: "commonwellPersonId",
      commonwellStatus: "processing",
      cqLinkStatus: "processing",
    };

    const result = await setCommonwellIdsAndStatus({
      patientId: patient.id,
      cxId: patient.cxId,
      ...newValues,
    });

    expect(result).toBeTruthy();
    checkPatientUpdateWith(newValues);
  });

  it("has CW externalData set to newValues when CW externalData has oldValues and we set newValues", async () => {
    const oldValues: PatientDataCommonwell = {
      patientId: "oldCommonwellPatientId",
      personId: "oldCommonwellPersonId",
      status: "processing",
      cqLinkStatus: "processing",
    };

    const patient = makePatient({
      data: makePatientData({
        externalData: {
          COMMONWELL: {
            ...oldValues,
          },
        },
      }),
    });

    patientModel_findOne.mockResolvedValueOnce(patient);

    const newValues: CWParams = {
      commonwellPatientId: "newCommonwellPatientId",
      commonwellPersonId: "newCommonwellPersonId",
      commonwellStatus: "completed",
      cqLinkStatus: "linked",
    };

    const result = await setCommonwellIdsAndStatus({
      patientId: patient.id,
      cxId: patient.cxId,
      ...newValues,
    });

    expect(result).toBeTruthy();
    checkPatientUpdateWith(newValues);
  });

  it("has CW externalData set to newStatus + oldValues when CW externalData has oldValues and we set newStatus", async () => {
    const oldValues: PatientDataCommonwell = {
      patientId: "oldCommonwellPatientId",
      personId: "oldCommonwellPersonId",
      status: "processing",
      cqLinkStatus: "processing",
    };

    const patient = makePatient({
      data: makePatientData({
        externalData: {
          COMMONWELL: {
            ...oldValues,
          },
        },
      }),
    });

    patientModel_findOne.mockResolvedValueOnce(patient);

    const newStatus: CWParams = {
      commonwellPatientId: "newCommonwellPatientId",
      commonwellPersonId: undefined,
      commonwellStatus: "completed",
      cqLinkStatus: undefined,
    };

    const result = await setCommonwellIdsAndStatus({
      patientId: patient.id,
      cxId: patient.cxId,
      ...newStatus,
    });

    expect(result).toBeTruthy();
    checkPatientUpdateWith({
      commonwellPatientId: newStatus.commonwellPatientId,
      commonwellPersonId: oldValues.personId,
      commonwellStatus: newStatus.commonwellStatus,
      cqLinkStatus: oldValues.cqLinkStatus,
    });
  });

  it("has CW externalData set to onlyPatientId & cqLinkStatus = unlinked when CW externalData is empty and we set onlyPatientId", async () => {
    const patient = makePatient();

    patientModel_findOne.mockResolvedValueOnce(patient);

    const onlyPatientId: CWParams = {
      commonwellPatientId: "newCommonwellPatientId",
      commonwellPersonId: undefined,
      commonwellStatus: undefined,
      cqLinkStatus: undefined,
    };

    const result = await setCommonwellIdsAndStatus({
      patientId: patient.id,
      cxId: patient.cxId,
      ...onlyPatientId,
    });

    expect(result).toBeTruthy();
    checkPatientUpdateWith({
      commonwellPatientId: onlyPatientId.commonwellPatientId,
      cqLinkStatus: "unlinked",
    });
  });
});

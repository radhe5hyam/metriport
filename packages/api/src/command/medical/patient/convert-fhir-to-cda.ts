import { out } from "@metriport/core/util/log";
import { capture } from "@metriport/core/util/notifications";
import { makeFhirToCdaConverter } from "../../../external/fhir-to-cda-converter/converter-factory";
import { toFHIR as toFHIROrganization } from "../../../external/fhir/organization";
import { Bundle } from "../../../routes/medical/schemas/fhir";
import { getOrganizationOrFail } from "../organization/get-organization";

export async function convertFhirToCda({
  cxId,
  patientId,
  docId,
  validatedBundle,
}: {
  cxId: string;
  patientId: string;
  docId: string;
  validatedBundle: Bundle;
}): Promise<void> {
  const { log } = out(`convertFhirToCda - cxId: ${cxId}, patientId: ${patientId}`);
  const cdaConverter = makeFhirToCdaConverter();
  const organization = await getOrganizationOrFail({ cxId });

  try {
    const fhirOrganization = toFHIROrganization(organization);
    await cdaConverter.requestConvert({
      cxId,
      patientId,
      docId,
      bundle: validatedBundle,
      organization: fhirOrganization,
    });
  } catch (error) {
    const msg = `Error converting FHIR to CDA`;
    log(`${msg} - error: ${error}`);
    capture.error(msg, { extra: { error, cxId, patientId } });
    throw error;
  }
}

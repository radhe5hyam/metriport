import { z } from "zod";
import { periodSchema } from "./period";

// Identifies the use for an identifier, if known. This value set defines its own
// terms in the system http://hl7.org/fhir/identifier-use
// See: https://specification.commonwellalliance.org/appendix/terminology-bindings#c8-identifier-use-codes
export enum IdentifierUseCodes {
  usual = "usual",
  official = "official",
  temp = "temp",
  unspecified = "unspecified",
}
export const identifierUseCodesSchema = z.enum(
  Object.keys(IdentifierUseCodes) as [string, ...string[]]
);

// An identifier intended for use external to the FHIR protocol. As an external identifier,
// it may be changed or retired due to human or system process and errors.
// See: https://specification.commonwellalliance.org/services/rest-api-reference (8.4.11 Identifier)
export const identifierSchema = z.object({
  use: identifierUseCodesSchema.optional().nullable(),
  label: z.string().optional().nullable(),
  system: z.string().optional().nullable(), // uri
  key: z.string(),
  period: periodSchema.optional().nullable(),
  assigner: z.string().optional().nullable(),
});

export type Identifier = z.infer<typeof identifierSchema>;
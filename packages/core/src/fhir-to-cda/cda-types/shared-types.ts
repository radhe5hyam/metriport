import {
  _assigningAuthorityNameAttribute,
  _codeAttribute,
  _codeSystemAttribute,
  _codeSystemNameAttribute,
  _displayNameAttribute,
  _extensionAttribute,
  _inlineTextAttribute,
  _namespaceAttribute,
  _rootAttribute,
  _xmlnsXsiAttribute,
  _xsiTypeAttribute,
} from "../cda-templates/constants";

export type ClinicalDocument = {
  ClinicalDocument: {
    [_namespaceAttribute]: string;
    realmCode?: CdaCodeCe;
    typeId?: CdaInstanceIdentifier;
    templateId?: CdaInstanceIdentifier[];
    id: CdaInstanceIdentifier;
    code: CdaCodeCe;
    title?: string;
    effectiveTime: Entry;
    confidentialityCode: CdaCodeCe;
    languageCode?: CdaCodeCe;
    setId?: CdaInstanceIdentifier;
    versionNumber?: Entry;
    recordTarget: CdaRecordTarget;
    author: CdaAuthor;
    custodian: CdaCustodian;
    component: unknown;
  };
};

export type Entry = { [key: string]: string } | string;
export type EntryObject = { [key: string]: string };

export type CdaTelecom = {
  use?: EntryObject;
  value?: EntryObject;
};

export type CdaPeriod = {
  low?: Entry;
  high?: Entry;
};

export type CdaAddress = {
  streetAddressLine?: Entry | undefined;
  city?: string | undefined;
  state?: string | undefined;
  postalCode?: string | undefined;
  country?: string | undefined;
  useablePeriod?: CdaPeriod | undefined;
};

export type CdaOrganization = {
  id?: CdaInstanceIdentifier[] | Entry;
  name?: Entry | undefined;
  telecom?: CdaTelecom[] | undefined;
  addr?: CdaAddress[] | undefined;
};

export type CdaAssignedAuthor = {
  id: Entry;
  addr?: CdaAddress[] | undefined;
  telecom?: CdaTelecom[] | undefined;
  representedOrganization?: CdaOrganization | undefined;
};

export type CdaPatientRole = {
  name?: CdaName[] | undefined;
  administrativeGenderCode?: EntryObject;
  birthTime?: EntryObject;
  deceasedInd?: EntryObject;
  maritalStatusCode?: EntryObject;
  languageCommunication?: {
    languageCode: EntryObject;
  };
};

export type CdaName = {
  use?: EntryObject;
  given?: Entry;
  family?: string | undefined;
  validTime: CdaPeriod;
};

// Ce (CE) stands for Coded with Equivalents
export type CdaCodeCe = {
  [_codeAttribute]?: string;
  [_codeSystemAttribute]?: string;
  [_codeSystemNameAttribute]?: string;
  [_displayNameAttribute]?: string;
};

// St (ST) stands for Simple Text
export type CdaValueSt = {
  [_xsiTypeAttribute]?: string;
  [_xmlnsXsiAttribute]?: string;
  [_inlineTextAttribute]?: string;
};

// Cv (CV) stands for Coded Value
export interface CdaCodeCv extends CdaCodeCe {
  originalText?: string | undefined;
  translation?: CdaCodeCe[] | undefined;
}

export interface CdaCodeCv extends CdaCodeCe {
  originalText?: string | undefined;
  translation?: CdaCodeCe[] | undefined;
}

// see https://build.fhir.org/ig/HL7/CDA-core-sd/StructureDefinition-II.html
export type CdaInstanceIdentifier = {
  [_rootAttribute]?: string;
  [_extensionAttribute]?: string;
  [_assigningAuthorityNameAttribute]?: string;
};

// TOP Level CDA Section Types
export type CdaAuthor = {
  time: Entry;
  assignedAuthor: CdaAssignedAuthor;
};

export type CdaCustodian = {
  assignedCustodian: {
    representedCustodianOrganization: CdaOrganization | undefined;
  };
};

export type CdaRecordTarget = {
  patientRole: {
    id?: CdaInstanceIdentifier[] | Entry;
    addr?: CdaAddress[] | undefined;
    telecom?: CdaTelecom[] | undefined;
    patient: CdaPatientRole;
  };
};

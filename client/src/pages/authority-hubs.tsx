import ProfessionAuthorityHub from "./profession-authority-hub";
import { PROFESSION_AUTHORITY_DATA } from "@shared/profession-authority-data";

export function NursingAuthorityHub() {
  return <ProfessionAuthorityHub data={PROFESSION_AUTHORITY_DATA.nursing} />;
}

export function ParamedicAuthorityHub() {
  return <ProfessionAuthorityHub data={PROFESSION_AUTHORITY_DATA.paramedic} />;
}

export function RespiratoryTherapyAuthorityHub() {
  return <ProfessionAuthorityHub data={PROFESSION_AUTHORITY_DATA["respiratory-therapy"]} />;
}

export function MltAuthorityHub() {
  return <ProfessionAuthorityHub data={PROFESSION_AUTHORITY_DATA.mlt} />;
}

export function ImagingAuthorityHub() {
  return <ProfessionAuthorityHub data={PROFESSION_AUTHORITY_DATA.imaging} />;
}

export function SocialWorkAuthorityHub() {
  return <ProfessionAuthorityHub data={PROFESSION_AUTHORITY_DATA["social-work"]} />;
}

export function PsychotherapyAuthorityHub() {
  return <ProfessionAuthorityHub data={PROFESSION_AUTHORITY_DATA.psychotherapy} />;
}

export function AddictionsAuthorityHub() {
  return <ProfessionAuthorityHub data={PROFESSION_AUTHORITY_DATA.addictions} />;
}

export function OccupationalTherapyAuthorityHub() {
  return <ProfessionAuthorityHub data={PROFESSION_AUTHORITY_DATA["occupational-therapy"]} />;
}

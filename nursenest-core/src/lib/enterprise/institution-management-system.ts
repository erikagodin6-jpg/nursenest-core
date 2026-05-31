import { HIDDEN_ENTERPRISE_VISIBILITY, type HiddenEnterpriseVisibility } from "@/lib/enterprise/enterprise-visibility";

export type EnterpriseInstitutionType =
  | "school"
  | "college"
  | "university"
  | "hospital"
  | "organization"
  | "residency_program"
  | "health_authority"
  | "clinical_placement_program";

export type EnterpriseAccountRole =
  | "institution_admin"
  | "program_admin"
  | "faculty"
  | "educator"
  | "manager"
  | "learner";

export type EnterpriseProgramType =
  | "rn_program"
  | "rpn_program"
  | "np_program"
  | "new_graduate_program"
  | "critical_care_orientation"
  | "clinical_placement";

export type EnterpriseInstitutionAccount = Readonly<{
  id: string;
  name: string;
  type: EnterpriseInstitutionType;
  programs: readonly EnterpriseProgramAccount[];
  visibility: HiddenEnterpriseVisibility;
}>;

export type EnterpriseProgramAccount = Readonly<{
  id: string;
  institutionId: string;
  name: string;
  type: EnterpriseProgramType;
  cohortIds: readonly string[];
  facultyUserIds: readonly string[];
  managerUserIds: readonly string[];
}>;

export type EnterpriseMember = Readonly<{
  userId: string;
  role: EnterpriseAccountRole;
  programId: string | null;
  cohortId: string | null;
}>;

export function createEnterpriseInstitutionAccount(args: {
  id: string;
  name: string;
  type: EnterpriseInstitutionType;
  programs?: readonly EnterpriseProgramAccount[];
}): EnterpriseInstitutionAccount {
  return {
    id: args.id,
    name: args.name,
    type: args.type,
    programs: args.programs ?? [],
    visibility: HIDDEN_ENTERPRISE_VISIBILITY,
  };
}

export function canManageEnterpriseMember(role: EnterpriseAccountRole): boolean {
  return role === "institution_admin" || role === "program_admin" || role === "manager";
}

export function calculateEnterpriseSeatUtilization(seatCap: number, assignedSeats: number) {
  const cap = Math.max(0, Math.floor(seatCap));
  const assigned = Math.max(0, Math.floor(assignedSeats));
  return {
    seatCap: cap,
    assignedSeats: assigned,
    availableSeats: Math.max(0, cap - assigned),
    utilizationPct: cap > 0 ? Math.round((assigned / cap) * 1000) / 10 : null,
  };
}

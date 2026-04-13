export function getNursingRoleLabel({
  country,
  role,
}: {
  country: "US" | "CA";
  role: "PN" | "RN" | "NP";
}) {
  if (role === "PN") {
    if (country === "US") return "LPN / LVN";
    if (country === "CA") return "RPN";
    return "Practical Nurse";
  }

  if (role === "RN") return "Registered Nurse";
  if (role === "NP") return "Nurse Practitioner";

  return role;
}

export function getExamLabel({
  country,
  role,
}: {
  country: "US" | "CA";
  role: "PN" | "RN" | "NP";
}) {
  if (role === "PN") {
    if (country === "US") return "NCLEX-PN";
    if (country === "CA") return "REX-PN";
  }

  if (role === "RN") return "NCLEX-RN";
  if (role === "NP") return "NP Certification Exam";

  return "";
}

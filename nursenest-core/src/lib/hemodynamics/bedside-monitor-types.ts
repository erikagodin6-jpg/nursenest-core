export type BedsideMonitorWaveformKind = "ecg" | "arterial" | "spo2" | "etco2" | "resp";

export type BedsideMonitorStatus = "normal" | "watch" | "critical";

export type BedsideMonitorWaveformQuality =
  | "clean"
  | "damped"
  | "underdamped"
  | "artifact"
  | "low-perfusion"
  | "sharkfin"
  | "apnea";

export type BedsideMonitorChannel = {
  kind: BedsideMonitorWaveformKind;
  label: string;
  value: string;
  unit: string;
  status: BedsideMonitorStatus;
  waveformQuality?: BedsideMonitorWaveformQuality;
  teachingPoint: string;
};

export type BedsideMonitorScenario = {
  id: string;
  title: string;
  patientContext: string;
  phaseLabel: string;
  clinicalQuestion: string;
  channels: BedsideMonitorChannel[];
  vitals: {
    heartRate: number;
    systolic: number;
    diastolic: number;
    map: number;
    spo2: number;
    respiratoryRate: number;
    etco2: number;
  };
  interpretation: string;
  nursingPriority: string;
};

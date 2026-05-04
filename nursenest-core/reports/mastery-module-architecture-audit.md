# Mastery Module Architecture Audit

PASS/FAIL: PASS

## Summary

- Modules registered: 22
- Shared Prisma models present: true
- Hidden modules: 22
- Public modules: 0
- Exposure issues: 0
- CAT/practice MasteryQuestion leakage: false
- Media import issues: false
- Admin pagination present: true

## Modules

### ECG Mastery
- id: ecg-mastery
- moduleType: ecg
- route: /modules/ecg
- hidden/adminPreviewOnly: true/true
- issues: None

### Lab Values Basics
- id: lab-values-basics
- moduleType: lab-values
- route: /modules/lab-values/basics
- hidden/adminPreviewOnly: true/true
- issues: None

### Lab Values Basic Mastery
- id: lab-values-basic
- moduleType: lab-values
- route: /modules/lab-values/basic
- hidden/adminPreviewOnly: true/true
- issues: None

### Lab Values Advanced Mastery
- id: lab-values-advanced
- moduleType: lab-values
- route: /modules/lab-values/advanced
- hidden/adminPreviewOnly: true/true
- issues: None

### ABG Interpretation Mastery
- id: respiratory-abg-mastery
- moduleType: abg
- route: /allied/respiratory-therapy/modules/abg
- hidden/adminPreviewOnly: true/true
- issues: None

### Ventilator Basics
- id: respiratory-ventilator-basics
- moduleType: ventilator-management
- route: /allied/respiratory-therapy/modules/ventilator-basics
- hidden/adminPreviewOnly: true/true
- issues: None

### Ventilator Management
- id: respiratory-ventilator-management
- moduleType: ventilator-management
- route: /allied/respiratory-therapy/modules/ventilator-management
- hidden/adminPreviewOnly: true/true
- issues: None

### Oxygen Delivery Systems
- id: respiratory-paramedic-oxygen-delivery
- moduleType: oxygen-delivery
- route: /allied/respiratory-therapy/modules/oxygen-delivery
- hidden/adminPreviewOnly: true/true
- issues: None

### Oxygen Delivery Systems
- id: paramedic-oxygen-delivery
- moduleType: oxygen-delivery
- route: /allied/paramedic/modules/oxygen-delivery
- hidden/adminPreviewOnly: true/true
- issues: None

### Respiratory Distress Recognition
- id: respiratory-paramedic-respiratory-distress
- moduleType: respiratory-distress
- route: /allied/respiratory-therapy/modules/respiratory-distress
- hidden/adminPreviewOnly: true/true
- issues: None

### Respiratory Distress Recognition
- id: paramedic-respiratory-distress
- moduleType: respiratory-distress
- route: /allied/paramedic/modules/respiratory-distress
- hidden/adminPreviewOnly: true/true
- issues: None

### Trauma & Triage
- id: paramedic-trauma-triage
- moduleType: trauma-triage
- route: /allied/paramedic/modules/trauma-triage
- hidden/adminPreviewOnly: true/true
- issues: None

### IV Therapy + Infusion Safety
- id: pharmacy-tech-iv-infusion-safety
- moduleType: iv-infusion-safety
- route: /allied/pharmacy-tech/modules/iv-infusion-safety
- hidden/adminPreviewOnly: true/true
- issues: None

### IV Therapy + Infusion Safety
- id: paramedic-iv-infusion-safety
- moduleType: iv-infusion-safety
- route: /allied/paramedic/modules/iv-infusion-safety
- hidden/adminPreviewOnly: true/true
- issues: None

### Advanced Lab Interpretation
- id: mlt-advanced-lab-interpretation
- moduleType: advanced-lab-interpretation
- route: /allied/medical-lab-technology/modules/advanced-lab-interpretation
- hidden/adminPreviewOnly: true/true
- issues: None

### Pharmacology Pattern Recognition
- id: pharmacy-tech-pharmacology-patterns
- moduleType: pharmacy
- route: /allied/pharmacy-tech/modules/pharmacology-patterns
- hidden/adminPreviewOnly: true/true
- issues: None

### Dosage Calculations
- id: pharmacy-tech-dosage-calculations
- moduleType: pharmacy
- route: /allied/pharmacy-tech/modules/dosage-calculations
- hidden/adminPreviewOnly: true/true
- issues: None

### ADL + Functional Assessment Mastery
- id: ota-adl-functional-assessment
- moduleType: functional-assessment
- route: /allied/ota/modules/adl-functional-assessment
- hidden/adminPreviewOnly: true/true
- issues: None

### Musculoskeletal Rehab + Movement Assessment
- id: pta-msk-rehab-assessment
- moduleType: msk-rehab
- route: /allied/pta/modules/msk-rehab-assessment
- hidden/adminPreviewOnly: true/true
- issues: None

### Image Recognition Basics
- id: imaging-image-recognition
- moduleType: image-recognition
- route: /allied/imaging/modules/image-recognition
- hidden/adminPreviewOnly: true/true
- issues: None

### ECG + Cardiac Pattern Recognition
- id: sonography-ecg-cardiac-patterns
- moduleType: cardiac-pattern-recognition
- route: /allied/sonography/modules/ecg-cardiac-patterns
- hidden/adminPreviewOnly: true/true
- issues: None

### Emergency Pattern Recognition
- id: paramedic-emergency-pattern-recognition
- moduleType: emergency-pattern-recognition
- route: /allied/paramedic/modules/emergency-pattern-recognition
- hidden/adminPreviewOnly: true/true
- issues: None


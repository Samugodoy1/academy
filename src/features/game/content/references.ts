import type { StudyKey } from '../../../utils/studyTopics';
import type { ScientificReference } from '../types';

/**
 * Primary sources shown with the correction. Content files stay focused on
 * teaching while every exercise remains traceable to a guideline or consensus.
 */
export const REFERENCES_BY_TOPIC: Record<StudyKey, ScientificReference[]> = {
  'exame-clinico': [
    {
      label: 'AAE — Endodontic Diagnosis',
      url: 'https://www.aae.org/specialty/wp-content/uploads/sites/2/2017/07/endodonticdiagnosisfall2013.pdf',
    },
  ],
  radiologia: [
    {
      label: 'ADA — X-Rays and Radiographs',
      url: 'https://www.ada.org/resources/ada-library/oral-health-topics/x-rays-radiographs',
    },
  ],
  anestesia: [
    {
      label: 'AAPD — Use of Local Anesthesia',
      url: 'https://www.aapd.org/globalassets/media/policies_guidelines/bp_localanesthesia.pdf',
    },
  ],
  isolamento: [
    {
      label: 'AAE — Dental Dam Position Statement',
      url: 'https://www.aae.org/specialty/wp-content/uploads/sites/2/2017/06/dentaldamstatement.pdf',
    },
  ],
  preventiva: [
    {
      label: 'ADA — Nonrestorative Treatments for Caries Lesions',
      url: 'https://www.ada.org/resources/research/science/evidence-based-dental-research/caries-management-clinical-practice-guidelines/evidence-based-clinical-practice-guideline-on-nonrestorative-treatments-for-caries-lesions',
    },
  ],
  periodontia: [
    {
      label: 'EFP — Classification of Periodontal Diseases',
      url: 'https://www.efp.org/education/continuing-education/clinical-guidelines/',
    },
  ],
  dentistica: [
    {
      label: 'ADA — Restorative Treatments for Caries Lesions',
      url: 'https://www.ada.org/resources/research/science/evidence-based-dental-research/caries-management-clinical-practice-guidelines/evidence-based-clinical-practice-guideline-on-restorative-treatments-for-caries-lesions',
    },
  ],
  endodontia: [
    {
      label: 'ESE — S3-level Clinical Practice Guideline',
      url: 'https://onlinelibrary.wiley.com/doi/10.1111/iej.13974',
    },
  ],
  cirurgia: [
    {
      label: 'SDCEP — Anticoagulants and Antiplatelet Drugs',
      url: 'https://www.sdcep.org.uk/published-guidance/anticoagulants-and-antiplatelets/',
    },
  ],
  protese: [
    {
      label: 'Academy of Prosthodontics — Glossary of Prosthodontic Terms',
      url: 'https://www.academyofprosthodontics.org/lib_docs/GPT9.pdf',
    },
  ],
  odontopediatria: [
    {
      label: 'AAPD — Reference Manual',
      url: 'https://www.aapd.org/research/oral-health-policies--recommendations/',
    },
  ],
  'anatomia-aplicada': [
    {
      label: 'StatPearls — Anatomy, Head and Neck',
      url: 'https://www.ncbi.nlm.nih.gov/books/NBK532292/',
    },
  ],
  farmacologia: [
    {
      label: 'ADA — Oral Analgesics for Acute Dental Pain',
      url: 'https://www.ada.org/resources/ada-library/oral-health-topics/oral-analgesics-for-acute-dental-pain',
    },
  ],
  'patologia-oral': [
    {
      label: 'NICE NG12 — Suspected Cancer Recognition and Referral',
      url: 'https://www.nice.org.uk/guidance/ng12/chapter/recommendations-organised-by-site-of-cancer',
    },
  ],
  'urgencias-medicas': [
    {
      label: 'World Allergy Organization — Anaphylaxis Guidance 2020',
      url: 'https://doi.org/10.1016/j.waojou.2020.100472',
    },
  ],
  biosseguranca: [
    {
      label: 'CDC — Standard Precautions in Dental Settings',
      url: 'https://www.cdc.gov/dental-infection-control/hcp/summary/standard-precautions.html',
    },
  ],
  'materiais-dentarios': [
    {
      label: 'ISO 4049 — Polymer-based Restorative Materials',
      url: 'https://www.iso.org/standard/67596.html',
    },
  ],
  oclusao: [
    {
      label: 'International Consensus on the Assessment of Bruxism',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6287494/',
    },
  ],
  implantodontia: [
    {
      label: 'AAOMR — Radiology in Dental Implantology',
      url: 'https://aaomr.org/common/Uploaded%20files/Position%20Papers/aaomr_implants_position_paper.pdf',
    },
  ],
  ortodontia: [
    {
      label: 'Cochrane — Retention Procedures after Orthodontic Treatment',
      url: 'https://www.cochrane.org/evidence/CD002283_retention-procedures-stabilising-tooth-position-after-treatment-orthodontic-braces',
    },
  ],
  odontogeriatria: [
    {
      label: 'FDI — Oral Health for an Ageing Population',
      url: 'https://www.fdiworlddental.org/sites/default/files/2020-11/2019-fdi_ohap-chairside_guide-en.pdf',
    },
  ],
};

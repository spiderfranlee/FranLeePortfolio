export interface InquiryBrief {
  source: 'configurator' | 'pricing';
  recommendedTier: string;
  priceLabel: string;
  summaryText: string;
  verticalLabel?: string;
  modules?: string[];
  estimatedAnnualValue?: string;
  estimatedHoursReclaimed?: string;
  timeline?: string;
}

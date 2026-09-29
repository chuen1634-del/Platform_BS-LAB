export function calculateRoi({ investment = 0, annualSavings = 0, annualRevenueGain = 0 }) {
  const cost = Number(investment) || 0;
  const annualBenefit = (Number(annualSavings) || 0) + (Number(annualRevenueGain) || 0);
  const roiPercent = cost > 0 ? Math.round(((annualBenefit - cost) / cost) * 100) : 0;
  const paybackMonths = annualBenefit > 0 && cost > 0 ? Math.round((cost / annualBenefit) * 12 * 10) / 10 : null;
  return { investment: cost, annualSavings: Number(annualSavings) || 0, annualRevenueGain: Number(annualRevenueGain) || 0, annualBenefit, roiPercent, paybackMonths };
}

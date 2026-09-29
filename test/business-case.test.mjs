import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRoi } from '../src/business-case.mjs';

test('calculates annual benefit, ROI, and payback period from business assumptions', () => {
  const result = calculateRoi({ investment: 12000000, annualSavings: 18000000, annualRevenueGain: 6000000 });

  assert.equal(result.annualBenefit, 24000000);
  assert.equal(result.roiPercent, 100);
  assert.equal(result.paybackMonths, 6);
});

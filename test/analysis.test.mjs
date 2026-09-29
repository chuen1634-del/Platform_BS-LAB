import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeFieldVisit, analyzeMeeting, analyzePreContact } from '../src/analysis.mjs';

test('classifies facts, hypotheses, and follow-up questions separately', () => {
  const results = analyzePreContact({
    companyName: '한빛전자',
    industry: '전자부품 제조',
    materials: [{
      sourceType: '회사소개서',
      content: '전자부품을 제조하며 생산 거점을 운영한다.',
    }],
  });

  assert.ok(results.some((item) => item.status === '확인됨'));
  assert.ok(results.some((item) => item.status === '추정'));
  assert.ok(results.some((item) => item.status === '확인 필요'));
  assert.ok(results.every((item) => item.sourceType));
});

test('turns meeting notes into confirmed customer problems and follow-up questions', () => {
  const results = analyzeMeeting({
    companyName: '한빛전자',
    industry: '전자부품 제조',
    material: {
      sourceType: '미팅 기록',
      content: '담당자는 엑셀로 재고를 관리하고 월말 실사에 이틀이 걸린다고 말했다. 생산팀과 구매팀의 수량이 자주 다르다.',
    },
  });

  assert.ok(results.some((item) => item.category === '고객 발언' && item.status === '확인됨'));
  assert.ok(results.some((item) => item.category === '현재 업무' && item.status === '확인됨'));
  assert.ok(results.some((item) => item.category === '문제 영향'));
  assert.ok(results.some((item) => item.status === '확인 필요' && item.followUpQuestion));
  assert.ok(results.every((item) => item.sourceType === '미팅 기록'));
});

test('structures field notes into As-Is and To-Be work cards', () => {
  const results = analyzeFieldVisit({
    companyName: '한빛전자',
    industry: '전자부품 제조',
    material: {
      sourceType: '현장 메모',
      content: '입고 담당자가 종이에 수량을 적고 오후에 엑셀에 다시 입력한다. 창고와 생산팀이 서로 다른 재고표를 사용한다.',
    },
  });

  assert.ok(results.some((item) => item.category === 'As-Is 업무' && item.status === '확인됨'));
  assert.ok(results.some((item) => item.category === 'As-Is 문제점' && item.status === '확인됨'));
  assert.ok(results.some((item) => item.category === 'To-Be 업무' && item.status === '제안'));
  assert.ok(results.some((item) => item.category === '기대 변화' && item.followUpQuestion));
  assert.ok(results.every((item) => item.sourceType === '현장 메모'));
});

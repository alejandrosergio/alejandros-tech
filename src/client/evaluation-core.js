import { extractAnswer, prepareLocalContext, validateLocalAnswer } from './assistant-core.js';

const normalise = value => value.normalize('NFC').replace(/\s+/g, ' ').trim();

export async function evaluateCase(index, item, lang, corpusVersion, generate) {
  const question = item[lang].question, matches = index.retrieve(question, lang).slice(0, 3);
  const light = extractAnswer(index, question, lang, corpusVersion);
  const result = {
    id: item.id, lang, question, expectedIds: item.expected, reference: item[lang].reference,
    retrievedIds: matches.map(source => source.id),
    first: item.expected.length ? item.expected.includes(matches[0]?.id) : null,
    topThree: item.expected.length ? matches.some(source => item.expected.includes(source.id)) : null,
    abstention: item.expected.length ? null : matches.length === 0,
    literal: light.sources.every(source => normalise(matches.find(match => match.id === source.id).text).includes(normalise(source.quote))),
    modelInvoked: Boolean(generate && matches.length), modelState: 'notInvoked', modelText: '',
    displayed: light
  };
  if (generate && matches.length) {
    try {
      const sources = prepareLocalContext(index, question, lang), output = await generate(question, lang, sources);
      const checked = validateLocalAnswer(output, sources, corpusVersion);
      result.modelState = checked.kind === 'answer' ? 'generated' : 'abstained';
      result.modelText = checked.paragraphs.map(paragraph => paragraph.text).join('\n\n');
      if (checked.kind === 'answer') result.displayed = checked;
    } catch (failure) {
      if (failure.message === 'cancelled') throw failure;
      result.modelState = 'rejected'; result.error = failure.message;
    }
  }
  return result;
}

export function summarizeEvaluation(records) {
  const supported = records.filter(record => record.expectedIds.length), unsupported = records.filter(record => !record.expectedIds.length);
  return {
    total: records.length,
    first: { passed: supported.filter(record => record.first).length, total: supported.length },
    topThree: { passed: supported.filter(record => record.topThree).length, total: supported.length },
    abstention: { passed: unsupported.filter(record => record.abstention).length, total: unsupported.length },
    literal: { passed: records.filter(record => record.literal).length, total: records.length },
    modelInvoked: records.filter(record => record.modelInvoked).length,
    generated: records.filter(record => record.modelState === 'generated').length,
    rejected: records.filter(record => record.modelState === 'rejected').length
  };
}

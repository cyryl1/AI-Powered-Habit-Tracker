export const getPrimaryAction = (insight: string): string => {
  const lower = insight.toLowerCase();

  const tomorrowToday = insight.match(/(?:tomorrow|today)[^.!?]*[.!?]/i);
  if (tomorrowToday) return 'Schedule: ' + tomorrowToday[0].trim();

  const pair = insight.match(/(?:pair|with)[^.!?]*[.!?]/i);
  if (pair) return 'Stack it: ' + pair[0].replace(/pair|with/gi, '').trim();

  const log = insight.match(/log[^.!?]*[.!?]/i);
  if (log) return 'Log now: ' + log[0].replace(/log/gi, '').trim();

  const first = insight.split(/[.!?]/)[0].trim();
  return first.endsWith('you') ? first : 'Do: ' + first;
};
import { projects, projectPath } from './projects.mjs';
import { notes, notePath } from './notes.mjs';
import { assistantPaths } from './document-assistant.mjs';

export const routeGroups = [
  { type: 'home', paths: { es: '/', en: '/en/' } },
  { type: 'assistant', paths: assistantPaths },
  ...projects.map(entity => ({ type: 'project', entity, paths: { es: projectPath(entity, 'es'), en: projectPath(entity, 'en') } })),
  ...notes.map(entity => ({ type: 'note', entity, paths: { es: notePath(entity, 'es'), en: notePath(entity, 'en') } }))
];

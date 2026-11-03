import { projects, projectPath } from './projects.mjs';
import { notes, notePath } from './notes.mjs';

export const routeGroups = [
  { type: 'home', paths: { es: '/', en: '/en/' } },
  ...projects.map(entity => ({ type: 'project', entity, paths: { es: projectPath(entity, 'es'), en: projectPath(entity, 'en') } })),
  ...notes.map(entity => ({ type: 'note', entity, paths: { es: notePath(entity, 'es'), en: notePath(entity, 'en') } }))
];

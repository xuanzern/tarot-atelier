import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const base = isGithubActions && repository ? `/${repository}/` : '/';

export default defineConfig({
  plugins: [react()],
  base,
});
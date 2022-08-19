import { Role } from './pages/api/lib/data/models/_authz'

enum Env {
  LOCAL,
  DEV,
  PROD,
}

export const { BASE_URI } = [
  { BASE_URI: 'http://localhost:3000' },
  { BASE_URI: 'https://hazel-git-dev-crsayen.vercel.app' },
  { BASE_URI: 'https://hazel-jade.vercel.app' },
][Env.LOCAL]

export const DEFAULT_ROLE: Role = {
  name: 'DEFAULT',
  permissions: ['read:public'],
}

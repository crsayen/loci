import { Role } from './pages/api/lib/data/models/_authz'

const environment = (
  process.env.NEXT_PUBLIC_ENVIRONMENT ?? 'local'
).toUpperCase()
if (!['LOCAL', 'DEV', 'PROD'].includes(environment)) {
  console.log('invalid ENVIRONMENT:', environment)
  process.exit(-1)
}

export const { BASE_URI } = {
  LOCAL: { BASE_URI: 'http://localhost:3000' },
  DEV: { BASE_URI: 'https://hazel-git-dev-crsayen.vercel.app' },
  PROD: { BASE_URI: 'https://hazel-jade.vercel.app' },
}[environment as 'LOCAL' | 'DEV' | 'PROD']

export const DEFAULT_ROLE: Role = {
  name: 'DEFAULT',
  permissions: ['read:public'],
}

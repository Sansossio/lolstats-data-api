export function getEntitiesPath () {
  let entitiesExtension = '.js'
  let entitiesPath = 'dist'

  if (process.env.NODE_ENV !== 'pro') {
    entitiesExtension = '.ts'
    entitiesPath = 'src'
  }
  return `${entitiesPath}/**/**.entity${entitiesExtension}`
}

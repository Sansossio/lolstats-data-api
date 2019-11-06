import { ConfigService } from '../config/config.service'

export const OriginAcceptedEnum = {
  LOCALHOST: ['localhost', '127.0.0.1'],
  ACCEPTANCE_HOST: new ConfigService().get<string>('app.acceptanceHost'),
  MESSAGE: 'You aren\'t permissions to use this endpoint'
}

import type { SetupState } from '@opendatacapture/schemas/setup';
import { http, HttpResponse } from 'msw';

export const setupHandlers = [
  http.get('/v1/setup', () => {
    return HttpResponse.json<SetupState>({
      isDemo: false,
      isGatewayEnabled: false,
      isSetup: true
    });
  })
];

import { ExtensionPageConnection } from '@fuels-wallet/sdk';
import { useEffect } from 'react';

import type { SignMachineService } from '../machines';

import { IS_CRX_POPUP } from '~/config';
import { waitForState } from '~/systems/Core';

export class SignRequestMethods extends ExtensionPageConnection {
  constructor(readonly service: SignMachineService) {
    super();
    super.externalMethods([this.signMessage]);
  }

  static start(service: SignMachineService) {
    return new SignRequestMethods(service);
  }

  async signMessage({ origin, message }: { origin: string; message: string }) {
    this.service.send('START_SIGN', {
      input: { origin, message },
    });
    const state = await waitForState(this.service);
    return state.signedMessage;
  }
}

export function useSignRequestMethods(service: SignMachineService) {
  useEffect(() => {
    if (IS_CRX_POPUP) {
      SignRequestMethods.start(service);
    }
  }, [service]);
}

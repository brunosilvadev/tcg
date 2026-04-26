import { Injectable, signal } from '@angular/core';
import * as LDClient from 'launchdarkly-js-client-sdk';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class LdService {
  private client!: LDClient.LDClient;

  private readonly _firstRelease = signal(false);
  readonly firstRelease = this._firstRelease.asReadonly();

  async initialize(): Promise<void> {
    this.client = LDClient.initialize(
      environment.ldClientId,
      { kind: 'user', anonymous: true },
    );
    await this.client.waitForInitialization(5);
    this._firstRelease.set(this.client.variation('first-release', false));
    this.client.on('change:first-release', (value: boolean) => {
      this._firstRelease.set(value);
    });
  }
}

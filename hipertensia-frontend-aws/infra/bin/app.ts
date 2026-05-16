#!/usr/bin/env node
import 'source-map-support/register.js';
import { App } from 'aws-cdk-lib';
import { HipertensiaWebStack } from '../lib/hipertensia-web-stack.js';

const app = new App();

new HipertensiaWebStack(app, 'HipertensiaWebStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? 'us-east-1'
  }
});

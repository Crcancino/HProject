#!/usr/bin/env bash
set -euo pipefail
DOMAIN_NAME=${DOMAIN_NAME:-crcancinosandbox.click}
HOSTED_ZONE_NAME=${HOSTED_ZONE_NAME:-crcancinosandbox.click}
npm install
npm run build
npm --workspace infra run deploy -- -c domainName="$DOMAIN_NAME" -c hostedZoneName="$HOSTED_ZONE_NAME"

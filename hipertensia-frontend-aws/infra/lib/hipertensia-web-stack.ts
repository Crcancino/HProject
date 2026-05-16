import { CfnOutput, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export class HipertensiaWebStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const domainName = this.node.tryGetContext('domainName') as string | undefined ?? process.env.DOMAIN_NAME;
    const hostedZoneId = this.node.tryGetContext('hostedZoneId') as string | undefined ?? process.env.HOSTED_ZONE_ID;
    const hostedZoneName = this.node.tryGetContext('hostedZoneName') as string | undefined ?? process.env.HOSTED_ZONE_NAME;
    const certificateArn = this.node.tryGetContext('certificateArn') as string | undefined ?? process.env.CERTIFICATE_ARN;

    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true
    });

    let hostedZone: route53.IHostedZone | undefined;
    if (domainName && hostedZoneId) {
      hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
        hostedZoneId,
        zoneName: hostedZoneName ?? domainName
      });
    } else if (domainName && hostedZoneName) {
      hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
        domainName: hostedZoneName
      });
    }

    let certificate: acm.ICertificate | undefined;
    if (domainName && certificateArn) {
      certificate = acm.Certificate.fromCertificateArn(this, 'ImportedCertificate', certificateArn);
    } else if (domainName && hostedZone) {
      certificate = new acm.Certificate(this, 'SiteCertificate', {
        domainName,
        validation: acm.CertificateValidation.fromDns(hostedZone)
      });
    }

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'OriginAccessIdentity', {
      comment: `Access identity for ${id}`
    });
    siteBucket.grantRead(originAccessIdentity);

    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultRootObject: 'index.html',
      domainNames: domainName && certificate ? [domainName] : undefined,
      certificate,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      defaultBehavior: {
        origin: new origins.S3Origin(siteBucket, { originAccessIdentity }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        compress: true
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: Duration.minutes(5)
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: Duration.minutes(5)
        }
      ]
    });

    if (domainName && hostedZone && certificate) {
      new route53.ARecord(this, 'AliasRecordA', {
        zone: hostedZone,
        recordName: domainName,
        target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution))
      });
      new route53.AaaaRecord(this, 'AliasRecordAAAA', {
        zone: hostedZone,
        recordName: domainName,
        target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution))
      });
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const frontendDist = path.resolve(__dirname, '..', '..', '..', 'frontend', 'dist');

    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset(frontendDist)],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*']
    });

    new CfnOutput(this, 'CloudFrontUrl', {
      value: `https://${distribution.distributionDomainName}`
    });

    new CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId
    });

    if (domainName && certificate) {
      new CfnOutput(this, 'CustomDomainUrl', {
        value: `https://${domainName}`
      });
    } else if (domainName && !certificate) {
      new CfnOutput(this, 'DomainSetupPending', {
        value: `Domain ${domainName} not attached. Provide CERTIFICATE_ARN or Route 53 hosted zone context.`
      });
    }
  }
}

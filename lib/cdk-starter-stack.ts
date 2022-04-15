import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';

export class CdkStarterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const s3Bucket = new s3.Bucket(this, 's3-bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      // 👇 set up lifecycle rules
      lifecycleRules: [
        {
          // 👇 optionally only apply rules to objects where the prefix matches
          // prefix: 'data/',
          abortIncompleteMultipartUploadAfter: cdk.Duration.days(90),
          expiration: cdk.Duration.days(365),
          transitions: [
            {
              storageClass: s3.StorageClass.INFREQUENT_ACCESS,
              transitionAfter: cdk.Duration.days(30),
            },
            {
              storageClass: s3.StorageClass.INTELLIGENT_TIERING,
              transitionAfter: cdk.Duration.days(60),
            },
            {
              storageClass: s3.StorageClass.GLACIER,
              transitionAfter: cdk.Duration.days(90),
            },
            {
              storageClass: s3.StorageClass.DEEP_ARCHIVE,
              transitionAfter: cdk.Duration.days(180),
            },
          ],
        },
      ],
    });

    // 👇 add a life cycle rule after bucket creation
    s3Bucket.addLifecycleRule({
      prefix: 'logs/',
      expiration: cdk.Duration.days(90),
      transitions: [
        {
          storageClass: s3.StorageClass.ONE_ZONE_INFREQUENT_ACCESS,
          transitionAfter: cdk.Duration.days(60),
        },
      ],
    });
  }
}

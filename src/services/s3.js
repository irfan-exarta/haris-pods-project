import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: 'us-east-1', // or "default", or your required region
  credentials: {
    accessKeyId: import.meta.env.VITE_ACESS_KEY,
    secretAccessKey: import.meta.env.VITE_SECRET_KEY,
  },
  endpoint: import.meta.env.VITE_ENDPOINT_URL,
  forcePathStyle: true,
});

/**
 * Upload a file to S3 in a "{folder}/{filename}" key.
 * If the same file name exists, it overwrites by default.
 *
 * Returns an object containing:
 *   - publicUrl: Useful if your bucket is publicly accessible.
 *   - presignedUrl: Short-lived GET URL (expires in X seconds).
 *
 * @param {File} file      The file from an <input type="file">.
 * @param {string} folder  The subfolder or "frameId" in S3.
 * @returns {Promise<{ publicUrl: string, presignedUrl: string }>}
 */
// export async function UploadFileToS3(file, folder) {
//   if (!file) throw new Error('No file provided.');

//   const bucketName = import.meta.env.VITE_BUCKET;
//   if (!bucketName) throw new Error('S3 bucket name missing in env');

//   // Key => "frameId/yourfilename.png" or "frameId/yourvideo.mp4"
//   const key = `${folder}/${file.name}`;

//   const putParams = {
//     Bucket: bucketName,
//     Key: key,
//     Body: file,
//     ContentType: file.type,
//     // If your bucket policy requires objects to be publicly readable,
//     // you can try: ACL: 'public-read' (some providers ignore this).
//     // ACL: 'public-read'
//   };

//   // 1) Upload (overwrites if same key already exists)
//   await s3.send(new PutObjectCommand(putParams));
//   console.log(`File uploaded successfully to ${folder}/${file.name}`);

//   // 2) Construct a direct public URL (depends on your S3 provider’s URL structure)
//   //    This ONLY works if the object is indeed publicly readable.
//   const publicUrl = [
//     import.meta.env.VITE_ENDPOINT_URL.replace(/\/+$/, ''), // strip trailing slash
//     bucketName,
//     key,
//   ].join('/');

//   // 3) Also generate a short-lived presigned GET URL (60 seconds by default)
//   //    If you want it to expire "immediately" after usage, that’s not a native
//   //    S3 feature. But you can at least set a short expiry:
//   const presignedUrl = await getSignedUrl(
//     s3,
//     new GetObjectCommand({ Bucket: bucketName, Key: key }),
//     { expiresIn: 60 }, // 60s
//   );

//   return { publicUrl, presignedUrl };
// }
export async function UploadFileToS3(file, folder) {
  if (!file) throw new Error('No file provided.');

  const bucketName = import.meta.env.VITE_BUCKET;
  if (!bucketName) throw new Error('S3 bucket name missing in env');

  // Construct the key using the folder and file name.
  const key = `${folder}/${file.name}`;

  // Instead of passing the file directly, convert it to an ArrayBuffer.
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  const putParams = {
    Bucket: bucketName,
    Key: key,
    Body: uint8Array, // use Uint8Array instead of file
    ContentType: file.type,
  };

  await s3.send(new PutObjectCommand(putParams));
  console.log(`File uploaded successfully to ${folder}/${file.name}`);

  const publicUrl = [import.meta.env.VITE_ENDPOINT_URL.replace(/\/+$/, ''), bucketName, key].join(
    '/',
  );

  const presignedUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: bucketName, Key: key }),
    { expiresIn: 60 },
  );

  return { publicUrl, presignedUrl };
}

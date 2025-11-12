import { BlobServiceClient } from '@azure/storage-blob';
import logger from './logger';

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING || 
  "AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;DefaultEndpointsProtocol=http;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;";
  
const CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME || 'categories';

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error('AZURE_STORAGE_CONNECTION_STRING is required');
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

async function ensureContainerExists() {
  try {
    await containerClient.createIfNotExists();
    console.log(`Container "${CONTAINER_NAME}" is ready`);
    logger.info(`Container "${CONTAINER_NAME}" is ready`)
  } catch (error) {
    console.error('Error ensuring container exists:', error);
    logger.error('Error ensuring container exists:', error)
    throw error;
  }
}

ensureContainerExists();

export async function uploadImageToAzure(buffer: Buffer, originalFilename: string): Promise<string> {
  try {
    const uniqueFilename = `${Date.now()}-${originalFilename}`;
    const blockBlobClient = containerClient.getBlockBlobClient(uniqueFilename);
    const uploadBlobResponse = await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: {
        blobContentType: getContentType(originalFilename),
      },
      metadata: {
        uploadedAt: new Date().toISOString(),
        originalName: originalFilename,
      },
    });
    
    console.log('Upload block blob successfully', uploadBlobResponse.requestId);
    logger.info('upload block blob successfully', uploadBlobResponse.requestId)
    return blockBlobClient.url;
  } catch (error) {
    logger.error('Error uploading to Azure:', error);
    console.error('Error uploading to Azure:', error);
    throw error;
  }
}
function getContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const mimeTypes: { [key: string]: string } = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'bmp': 'image/bmp',
    'tiff': 'image/tiff',
  };
  
  return mimeTypes[ext || ''] || 'application/octet-stream';
}
export { containerClient, blobServiceClient };
import { Router } from 'express';
import * as ctr from '../controllers/upload_controller';
import { imageUploader, videoUploader, pdfUploader, documentUploader } from "../middleware/upload_middleware";

const router = Router();

const Paths = {
    uploadSingleImage: '/image',
    uploadMultipleImages: '/images',
    uploadSingleVideo: '/video',
    uploadMultipleVideos: '/videos',
    uploadMultiplePDFs: '/pdfs',
    uploadMultipleDocuments: '/documents',
};

router.post(Paths.uploadSingleImage, imageUploader.single("image"), ctr.uploadSingleFile);
router.post(Paths.uploadMultipleImages, imageUploader.array("images", 10), ctr.uploadMultipleFiles);
router.post(Paths.uploadSingleVideo, videoUploader.single("video"), ctr.uploadSingleFile);
router.post(Paths.uploadMultipleVideos, videoUploader.array("videos", 5), ctr.uploadMultipleFiles);
router.post(Paths.uploadMultiplePDFs, pdfUploader.array("pdfs", 10), ctr.uploadMultipleFiles);
router.post(Paths.uploadMultipleDocuments, documentUploader.array("documents", 10), ctr.uploadMultipleFiles);

export default router;

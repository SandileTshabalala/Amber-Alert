import * as FaceDetector from 'expo-face-detector';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { FIREBASE_STORAGE } from './firebaseConfig';

class FaceRecognitionService {
    constructor() {
        this.initialized = false;
    }

    async initialize() {
        try {
            // Configure face detection options
            this.faceDetectionOptions = {
                mode: FaceDetector.FaceDetectorMode.fast,
                detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
                runClassifications: FaceDetector.FaceDetectorClassifications.all,
                minDetectionInterval: 100,
                tracking: true,
            };

            this.initialized = true;
        } catch (error) {
            console.error('Face recognition initialization failed:', error);
            throw error;
        }
    }

    async processCameraFeed(camera) {
        if (!this.initialized) {
            await this.initialize();
        }

        try {
            const options = {
                quality: 0.5,
                base64: true,
                skipProcessing: true,
            };

            const photo = await camera.takePictureAsync(options);
            return await this.processImage(photo.uri);
        } catch (error) {
            console.error('Camera feed processing failed:', error);
            throw error;
        }
    }

    async processImage(imageUri) {
        if (!this.initialized) {
            await this.initialize();
        }

        try {
            // Detect faces in the image
            const faces = await FaceDetector.detectFacesAsync(imageUri, this.faceDetectionOptions);
            
            if (faces.length === 0) {
                return { detected: false, message: 'No faces detected in the image' };
            }

            // Process each detected face
            const processedFaces = faces.map(face => ({
                bounds: face.bounds,
                landmarks: face.landmarks,
                leftEyeOpenProbability: face.leftEyeOpenProbability,
                rightEyeOpenProbability: face.rightEyeOpenProbability,
                smilingProbability: face.smilingProbability,
                rollAngle: face.rollAngle,
                yawAngle: face.yawAngle,
            }));

            // Store face data in Firebase if needed
            // await this.storeFaceData(processedFaces);

            return {
                detected: true,
                faces: processedFaces,
                count: faces.length
            };
        } catch (error) {
            console.error('Image processing failed:', error);
            throw error;
        }
    }

    async storeFaceData(faceData) {
        // TODO: Implement face data storage in Firebase
        // This would be used to store face data for missing persons
    }

    async searchForMatch(faceData) {
        // TODO: Implement face matching logic
        // This would search the database for potential matches
    }
}

export const faceRecognitionService = new FaceRecognitionService();

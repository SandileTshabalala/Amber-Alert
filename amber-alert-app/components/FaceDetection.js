import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { faceRecognitionService } from '../services/faceRecognitionService';

export default function FaceDetection() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [type, setType] = useState<CameraType>(CameraType.back);
    const [faces, setFaces] = useState<any>([]);
    const [image, setImage] = useState<string | null>(null);
    const cameraRef = useRef<Camera | null>(null);

    useEffect(() => {
        (async () => {
            const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
            const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasPermission(cameraStatus === 'granted' && mediaStatus === 'granted');
            await faceRecognitionService.initialize();
        })();
    }, []);

    const handleFaceDetection = async () => {
        if (cameraRef.current) {
            try {
                const result = await faceRecognitionService.processCameraFeed(cameraRef.current);
                if (result.detected) {
                    setFaces(result.faces);
                    console.log(`Detected ${result.count} faces`);
                } else {
                    setFaces([]);
                    console.log(result.message);
                }
            } catch (error) {
                console.error('Face detection failed:', error);
                setFaces([]);
            }
        }
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                const imageUri = result.assets[0].uri;
                setImage(imageUri);
                const faceResult = await faceRecognitionService.processImage(imageUri);
                if (faceResult.detected) {
                    setFaces(faceResult.faces);
                } else {
                    setFaces([]);
                }
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    if (hasPermission === null) {
        return <View style={styles.container}><Text>Requesting permissions...</Text></View>;
    }
    if (hasPermission === false) {
        return <View style={styles.container}><Text>No access to camera or media library</Text></View>;
    }

    return (
        <View style={styles.container}>
            {image ? (
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: image }}
                        style={styles.camera}
                        resizeMode="contain"
                    />
                    {faces.map((face, index) => (
                        <View
                            key={index}
                            style={[
                                styles.faceBox,
                                {
                                    left: face.bounds.origin.x,
                                    top: face.bounds.origin.y,
                                    width: face.bounds.size.width,
                                    height: face.bounds.size.height,
                                },
                            ]}
                        />
                    ))}
                </View>
            ) : (
                <Camera
                    ref={cameraRef}
                    style={styles.camera}
                    type={type}
                >
                    <View style={styles.overlay}>
                        {faces.map((face, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.faceBox,
                                    {
                                        left: face.bounds.origin.x,
                                        top: face.bounds.origin.y,
                                        width: face.bounds.size.width,
                                        height: face.bounds.size.height,
                                    },
                                ]}
                            />
                        ))}
                    </View>
                </Camera>
            )}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        setType(type === CameraType.back ? CameraType.front : CameraType.back);
                        setFaces([]);
                    }}>
                    <Text style={styles.text}>Flip Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleFaceDetection}>
                    <Text style={styles.text}>Detect Faces</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={pickImage}>
                    <Text style={styles.text}>Pick Image</Text>
                </TouchableOpacity>
                {image && (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            setImage(null);
                            setFaces([]);
                        }}>
                        <Text style={styles.text}>Back to Camera</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    imageContainer: {
        flex: 1,
        position: 'relative',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    buttonContainer: {
        flexDirection: 'row',
        backgroundColor: 'transparent rgba(0,0,0,0.5)',
        padding: 20,
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        
    },
    button: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    text: {
        fontSize: 14,
        color: 'white',
    },
    faceBox: {
        position: 'absolute',
        borderWidth: 2,
        borderColor: '#FFD700',
        backgroundColor: 'transparent',
    },
});

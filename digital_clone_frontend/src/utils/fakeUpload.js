export const fakeUpload = async (file, onProgress) => {
    return new Promise((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => resolve(file), 500);
            }
            if (onProgress) onProgress(progress);
        }, 200);
    });
};

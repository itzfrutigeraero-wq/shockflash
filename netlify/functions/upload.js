const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { file, filename } = JSON.parse(event.body);
        
        // Validate file
        if (!filename.endsWith('.swf')) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Only .swf files allowed' })
            };
        }

        // Save file to games directory
        const gamesDir = path.join(process.cwd(), 'games');
        const filePath = path.join(gamesDir, filename);
        
        const buffer = Buffer.from(file, 'base64');
        await fs.writeFile(filePath, buffer);

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                success: true, 
                message: 'File uploaded successfully',
                filename: filename 
            })
        };

    } catch (error) {
        console.error('Upload error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Upload failed' })
        };
    }
};

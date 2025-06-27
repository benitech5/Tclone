const fs = require('fs');
const path = require('path');

// Get IP address from command line argument
const newIp = process.argv[2];

if (!newIp) {
    console.log('Usage: node update-ip.js <your-ip-address>');
    console.log('Example: node update-ip.js 192.168.1.100');
    console.log('\nTo find your IP address, run: ipconfig | findstr "IPv4"');
    process.exit(1);
}

const configPath = path.join(__dirname, 'src', 'Dev 2', 'config', 'apiConfig.ts');

try {
    let content = fs.readFileSync(configPath, 'utf8');
    
    // Update the BASE_URL with the new IP
    const updatedContent = content.replace(
        /BASE_URL:\s*'http:\/\/[^']+'/,
        `BASE_URL: 'http://${newIp}:8080'`
    );
    
    fs.writeFileSync(configPath, updatedContent);
    
    console.log(`✅ Successfully updated API configuration to use IP: ${newIp}`);
    console.log(`📁 Updated file: ${configPath}`);
    console.log('\n🔄 You may need to restart your Expo development server for changes to take effect.');
    
} catch (error) {
    console.error('❌ Error updating IP address:', error.message);
    process.exit(1);
} 
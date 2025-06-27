const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const net = require('net');

console.log('🔧 Setting up network configuration for Konvo...\n');

// Function to test connectivity to a given IP and port
function testConnection(ip, port) {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        
        const onError = () => {
            socket.destroy();
            resolve(false);
        };

        socket.setTimeout(1500); // 1.5 second timeout
        socket.on('timeout', onError);
        socket.on('error', onError);

        socket.connect(port, ip, () => {
            socket.end();
            resolve(true);
        });
    });
}

async function setup() {
    try {
        // Get all IP addresses
        console.log('📡 Detecting network interfaces...');
        const ipconfigOutput = execSync('ipconfig', { encoding: 'utf8' });
        const ipMatches = ipconfigOutput.match(/IPv4 Address[ .]*: ([\d.]+)/g) || [];
        
        const ips = ipMatches.map(match => match.split(':').pop().trim())
                           .filter(ip => ip !== '127.0.0.1' && !ip.startsWith('169.254.'));

        console.log('📍 Found potential IP addresses:', ips.join(', '));
        
        if (ips.length === 0) {
            console.log('❌ No valid IP addresses found. Please check your network connection.');
            process.exit(1);
        }
        
        // Test which IP works with the backend
        console.log('\n🔍 Testing backend connectivity on port 8080...');
        let workingIp = null;
        
        for (const ip of ips) {
            console.log(`  Testing ${ip}...`);
            const isAlive = await testConnection(ip, 8080);
            if (isAlive) {
                workingIp = ip;
                console.log(`  ✅ ${ip} is working!`);
                break;
            } else {
                console.log(`  ❌ ${ip} failed or timed out.`);
            }
        }
        
        if (!workingIp) {
            console.log('\n⚠️  Could not connect to backend. Please ensure:');
            console.log('   1. Backend is running (`mvnw spring-boot:run` in the `backend` directory)');
            console.log('   2. Your firewall allows inbound connections on port 8080.');
            console.log('   3. You are on the same network as the device you are testing with.');
            console.log('\n📝 Using the first IP as a fallback, but it may not work.');
            workingIp = ips[0];
        }
        
        // Update the API configuration
        const configPath = path.join(__dirname, 'src', 'Dev2', 'config', 'apiConfig.ts');
        let configContent = fs.readFileSync(configPath, 'utf8');
        
        // Update the placeholder
        configContent = configContent.replace(
            /'http:\/\/.*:8080'/,
            `'http://${workingIp}:8080'`
        );
        
        fs.writeFileSync(configPath, configContent);
        
        console.log('\n✅ Network configuration updated successfully!');
        console.log(`🌐 API URL set to: http://${workingIp}:8080`);
        console.log(`📁 Updated: ${configPath}`);
        
        console.log('\n🚀 Next steps:');
        console.log('   1. If your Expo server is running, restart it.');
        console.log('   2. Test the app. It should now connect successfully.');
        
    } catch (error) {
        console.error('\n❌ An unexpected error occurred during setup:', error.message);
        process.exit(1);
    }
}

setup(); 
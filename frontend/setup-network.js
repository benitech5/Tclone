const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Setting up network configuration for Konvo...\n');

try {
    // Get all IP addresses
    console.log('📡 Detecting network interfaces...');
    const ipconfigOutput = execSync('ipconfig', { encoding: 'utf8' });
    const ipMatches = ipconfigOutput.match(/IPv4 Address[^:]*:\s*([0-9.]+)/g);
    
    const ips = [];
    if (ipMatches) {
        ipMatches.forEach(match => {
            const ip = match.match(/([0-9.]+)/)[1];
            if (ip !== '127.0.0.1' && ip !== '169.254.') {
                ips.push(ip);
            }
        });
    }
    
    console.log('📍 Found IP addresses:', ips.join(', '));
    
    if (ips.length === 0) {
        console.log('❌ No valid IP addresses found. Please check your network connection.');
        process.exit(1);
    }
    
    // Test which IP works with the backend
    console.log('\n🔍 Testing backend connectivity...');
    let workingIp = null;
    
    for (const ip of ips) {
        try {
            console.log(`  Testing ${ip}...`);
            const response = execSync(`curl -s -o nul -w "%{http_code}" http://${ip}:8080/api/auth/request-otp`, { 
                encoding: 'utf8',
                timeout: 3000 
            });
            
            if (response.trim() !== '000') {
                workingIp = ip;
                console.log(`  ✅ ${ip} is working!`);
                break;
            }
        } catch (error) {
            console.log(`  ❌ ${ip} failed`);
        }
    }
    
    if (!workingIp) {
        console.log('\n⚠️  Could not connect to backend. Please ensure:');
        console.log('   1. Backend is running (mvn spring-boot:run)');
        console.log('   2. Firewall allows port 8080');
        console.log('   3. Backend is configured to accept connections from all interfaces');
        console.log('\n📝 Using first available IP as fallback...');
        workingIp = ips[0];
    }
    
    // Update the API configuration
    const configPath = path.join(__dirname, 'src', 'Dev 2', 'config', 'apiConfig.ts');
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    // Update the POSSIBLE_IPS array
    const ipList = ips.map(ip => `'${ip}'`).join(', ');
    configContent = configContent.replace(
        /const POSSIBLE_IPS = \[[\s\S]*?\];/,
        `const POSSIBLE_IPS = [\n    ${ipList},\n    '10.0.2.2',         // Android emulator default\n    'localhost',        // Local development\n    '127.0.0.1'         // Loopback\n];`
    );
    
    // Update the detectApiUrl function to use the working IP
    configContent = configContent.replace(
        /function detectApiUrl\(\): string \{[\s\S]*?\}/,
        `function detectApiUrl(): string {\n    // Use the working IP as primary\n    return 'http://${workingIp}:8080';\n}`
    );
    
    fs.writeFileSync(configPath, configContent);
    
    console.log('\n✅ Network configuration updated successfully!');
    console.log(`🌐 Primary API URL: http://${workingIp}:8080`);
    console.log(`📁 Updated: ${configPath}`);
    
    // Create a .env file for easy reference
    const envContent = `# Konvo API Configuration
# Generated automatically - do not edit manually
API_BASE_URL=http://${workingIp}:8080
WORKING_IP=${workingIp}
ALL_IPS=${ips.join(',')}
`;
    
    fs.writeFileSync(path.join(__dirname, '.env.local'), envContent);
    console.log('📄 Created .env.local for reference');
    
    console.log('\n🚀 Next steps:');
    console.log('   1. Restart your Expo development server');
    console.log('   2. Test the login functionality');
    console.log('   3. If issues persist, run this script again');
    
} catch (error) {
    console.error('❌ Error during setup:', error.message);
    process.exit(1);
} 
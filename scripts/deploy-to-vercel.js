const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing for Vercel deployment...');

// Check if all required CSV files exist
const dataDir = path.join(__dirname, '..', 'frontend', 'public', 'data');
const requiredFiles = [
    'qb-rankings.csv',
    'rb-rankings.csv',
    'wr-rankings.csv',
    'te-rankings.csv',
    'adp-data.csv'
];

console.log('📁 Checking CSV data files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
    const filePath = path.join(dataDir, file);
    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        console.log(`✅ ${file} (${stats.size} bytes)`);
    } else {
        console.log(`❌ ${file} - MISSING`);
        allFilesExist = false;
    }
});

if (!allFilesExist) {
    console.log('\n❌ Some CSV files are missing. Please run the data generation scripts first:');
    console.log('   node scripts/generate-csv-data.js');
    console.log('   node scripts/generate-adp-data.js');
    process.exit(1);
}

console.log('\n✅ All CSV files are present!');

// Check vercel.json configuration
const vercelConfigPath = path.join(__dirname, '..', 'vercel.json');
if (fs.existsSync(vercelConfigPath)) {
    console.log('✅ vercel.json found');
    const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
    console.log('📋 Vercel configuration:');
    console.log(`   - Builds: ${config.builds && config.builds.length || 0} build(s)`);
    console.log(`   - Routes: ${config.routes && config.routes.length || 0} route(s)`);
} else {
    console.log('❌ vercel.json not found');
}

console.log('\n🎯 Deployment Strategy:');
console.log('   - Frontend: React app with CSV data files');
console.log('   - Backend: None (using static CSV files)');
console.log('   - Data: All player rankings and ADP data in CSV format');
console.log('   - Features: Player rankings, custom rankings with drag-and-drop, PDF export');

console.log('\n📦 Next Steps:');
console.log('   1. Commit all changes to git');
console.log('   2. Push to GitHub');
console.log('   3. Deploy to Vercel using: vercel --prod');
console.log('   4. Or connect your GitHub repo to Vercel for automatic deployments');

console.log('\n✨ Benefits of this approach:');
console.log('   - No backend API complexity');
console.log('   - Faster loading (static files)');
console.log('   - Works perfectly with Vercel static hosting');
console.log('   - Easy to update data (just regenerate CSV files)');
console.log('   - No serverless function issues');

console.log('\n🚀 Ready for deployment!'); 
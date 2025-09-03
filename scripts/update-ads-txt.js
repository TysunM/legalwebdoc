#!/usr/bin/env node

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function updateAdsTxt() {
  try {
    console.log('Fetching updated ads.txt from adstxtmanager...');
    
    // Try to fetch from the automated service for legalwebdoc.com
    const response = await fetch('https://srv.adstxtmanager.com/19390/legalwebdoc.com');
    
    let adsTxtContent;
    
    if (response.ok) {
      const content = await response.text();
      if (content.trim()) {
        adsTxtContent = content;
        console.log('✅ Fetched automated ads.txt content');
      } else {
        throw new Error('Empty response from automated service');
      }
    } else {
      throw new Error(`Service returned ${response.status}`);
    }
    
    // Fallback to enhanced manual ads.txt
    if (!adsTxtContent) {
      console.log('📝 Using enhanced manual ads.txt...');
      adsTxtContent = `# Enhanced ads.txt for better ad revenue
google.com, pub-8305971032153246, DIRECT, f08c47fec0942fa0

# Additional ad networks for better monetization
facebook.com, , RESELLER, c3e20eee3f780d68
rubiconproject.com, , RESELLER, 0bfd66d529a55807
pubmatic.com, , RESELLER, 5d62403b186f2ace
openx.com, , RESELLER, 6a698e2ec38604c6
indexexchange.com, , RESELLER, 50b1c356f2c5c8fc

# Last updated: ${new Date().toISOString().split('T')[0]}`;
    }
    
    // Write to the public directory
    const filePath = join(__dirname, '../client/public/ads.txt');
    writeFileSync(filePath, adsTxtContent);
    
    console.log('✅ ads.txt updated successfully!');
    console.log(`📍 File location: ${filePath}`);
    
  } catch (error) {
    console.error('❌ Failed to update ads.txt:', error.message);
    process.exit(1);
  }
}

updateAdsTxt();
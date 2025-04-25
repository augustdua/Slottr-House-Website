const fs = require('fs');
const path = require('path');
const { Pool } = require('pg'); // PostgreSQL client

// Database connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'slottr_db',
  password: 'AugustDua12345!',
  port: 5432,
});

// Path to image directories
const hacksawDir = path.join(__dirname, 'public', 'images', 'slots','hacksaw');
const pragmaticDir = path.join(__dirname, 'public', 'images', 'slots', 'pragmatic');

// Provider IDs
const HACKSAW_ID = '6631fd1c-fe09-4e08-a6ec-adda328b6fed';
const PRAGMATIC_ID = '6fb29c67-915f-47cd-8c67-22e8b6c949b4';

// Helper function to normalize text for comparison
function normalize(text) {
  // Convert to a string in case we get something unexpected
  let str = String(text).toLowerCase();
  
  // ONLY keep English letters and spaces, remove everything else
  str = str.replace(/[^a-z\s]/g, '');
  
  // Normalize spaces
  str = str.replace(/\s+/g, ' ').trim();
  
  return str;
}

// Helper function to clean up image filename
function cleanupImageName(filename) {
  // Remove file extension
  let name = path.basename(filename, path.extname(filename));
  
  // For Pragmatic Play files, remove the numbering prefix and the word "pragmatic"
  name = name.replace(/^pragmatic_\d+_/i, '');
  name = name.replace(/^pragmatic_/i, '');
  name = name.replace(/^pragmatic\s+/i, '');
  
  // Replace underscores with spaces
  name = name.replace(/_/g, ' ');
  
  // Remove numbers at the end (like _1000, _1201, etc.)
  name = name.replace(/\s*\d+$/g, '');
  
  return normalize(name);
}

// Debug function to log normalization results
function logNormalization(original, normalized) {
  console.log(`Original: "${original}" => Normalized: "${normalized}"`);
}

// Process images for a specific provider
async function processImagesForProvider(imageDir, providerId, extensions) {
  try {
    // Get all games for this provider
    const { rows: games } = await pool.query(
      'SELECT id, name FROM slots.games WHERE provider_id = $1',
      [providerId]
    );
    
    console.log(`Found ${games.length} games for provider ID ${providerId}`);
    
    // Prepare normalized game names for matching
    const normalizedGames = games.map(game => {
      const normalized = normalize(game.name);
      
      // Log a few examples to verify normalization is working
      if (game.name.includes("'") || game.name.includes("™")) {
        logNormalization(game.name, normalized);
      }
      
      return {
        id: game.id,
        name: game.name,
        normalized: normalized
      };
    });
    
    // Get all image files in the directory
    let files;
    try {
      files = fs.readdirSync(imageDir);
      console.log(`Found ${files.length} image files in ${imageDir}`);
    } catch (error) {
      console.error(`Error reading directory ${imageDir}:`, error);
      files = [];
    }
    
    const matchedGames = [];
    const unmatchedImages = [];
    
    // Process each image file
    for (const file of files) {
      // Check if file has any of the accepted extensions
      const hasValidExtension = extensions.some(ext => file.toLowerCase().endsWith(ext.toLowerCase()));
      
      if (hasValidExtension) {
        const normalizedFileName = cleanupImageName(file);
        
        // Log all filename normalizations when debugging
        logNormalization(file, normalizedFileName);
        
        // Find the best matching game
        let bestMatch = null;
        let highestScore = 0;
        
        for (const game of normalizedGames) {
          let score = 0;
          
          // Exact match (highest score)
          if (game.normalized === normalizedFileName) {
            score = 100;
          }
          // File name contains full game name
          else if (normalizedFileName.includes(game.normalized)) {
            score = 80;
          }
          // Game name contains full file name
          else if (game.normalized.includes(normalizedFileName)) {
            score = 70;
          }
          // Partial word matching
          else {
            const fileWords = normalizedFileName.split(' ').filter(w => w.length > 2);
            const gameWords = game.normalized.split(' ').filter(w => w.length > 2);
            
            // Count matching words
            const matchingWords = fileWords.filter(word => 
              gameWords.some(gameWord => gameWord.includes(word) || word.includes(gameWord))
            );
            
            if (matchingWords.length > 0) {
              score = 50 * (matchingWords.length / Math.max(fileWords.length, gameWords.length));
            }
          }
          
          if (score > highestScore) {
            highestScore = score;
            bestMatch = game;
          }
        }
        
        // If we found a match with sufficient confidence
        if (bestMatch && highestScore >= 30) {  // Lowered threshold to 40
          const relativePath = `/images/slots/${providerId === HACKSAW_ID ? 'hacksaw' : 'pragmatic'}/${file}`;
          
          // Update the database
          await pool.query(
            'UPDATE slots.games SET image_path = $1 WHERE id = $2',
            [relativePath, bestMatch.id]
          );
          
          matchedGames.push({
            gameId: bestMatch.id,
            gameName: bestMatch.name,
            fileName: file,
            cleanedName: normalizedFileName,
            normalizedGameName: bestMatch.normalized,
            score: highestScore,
            path: relativePath
          });
        } else {
          unmatchedImages.push({
            fileName: file,
            cleanedName: normalizedFileName,
            bestMatchName: bestMatch ? bestMatch.name : 'No match',
            bestMatchNormalized: bestMatch ? bestMatch.normalized : '',
            bestScore: highestScore
          });
        }
      }
    }
    
    console.log(`Processed ${files.length} images for provider ${providerId}`);
    console.log(`Successfully matched: ${matchedGames.length}`);
    console.log(`Unmatched images: ${unmatchedImages.length}`);
    
    // Return the results for review
    return { matchedGames, unmatchedImages };
  } catch (err) {
    console.error('Error processing images:', err);
    throw err;
  }
}

// Main function
async function matchImagesToGames() {
  try {
    // Process Hacksaw games (JPG files)
    console.log('Processing Hacksaw images...');
    const hacksawResults = await processImagesForProvider(hacksawDir, HACKSAW_ID, ['.jpg']);
    
    // Process Pragmatic Play games (now accepting both JPG and PNG)
    console.log('Processing Pragmatic Play images...');
    const pragmaticResults = await processImagesForProvider(pragmaticDir, PRAGMATIC_ID, ['.jpg', '.png']);
    
    // Create a log file with all unmatched games for manual review
    const unmatchedLog = [
      '# Unmatched Hacksaw Images',
      ...hacksawResults.unmatchedImages.map(img => 
        `${img.fileName} | cleaned: "${img.cleanedName}" | best match: "${img.bestMatchName}" (normalized: "${img.bestMatchNormalized}") | score: ${img.bestScore}`
      ),
      '',
      '# Unmatched Pragmatic Images',
      ...pragmaticResults.unmatchedImages.map(img => 
        `${img.fileName} | cleaned: "${img.cleanedName}" | best match: "${img.bestMatchName}" (normalized: "${img.bestMatchNormalized}") | score: ${img.bestScore}`
      )
    ].join('\n');
    
    fs.writeFileSync('unmatched_images.log', unmatchedLog);
    console.log('Unmatched images logged to unmatched_images.log');
    
    // Save matched games to a file as well for review
    const matchedLog = [
      '# Matched Hacksaw Images',
      ...hacksawResults.matchedGames.map(match => 
        `${match.fileName} => "${match.gameName}" | score: ${match.score}`
      ),
      '',
      '# Matched Pragmatic Images',
      ...pragmaticResults.matchedGames.map(match => 
        `${match.fileName} => "${match.gameName}" | score: ${match.score}`
      )
    ].join('\n');
    
    fs.writeFileSync('matched_images.log', matchedLog);
    console.log('Matched images logged to matched_images.log');
    
    console.log('\nProcess completed!');
  } catch (err) {
    console.error('Error in main process:', err);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the script
matchImagesToGames();
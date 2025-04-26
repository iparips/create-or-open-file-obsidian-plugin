import { readFileSync, writeFileSync } from 'fs'

// Get bump type from command line argument
const bumpType = process.argv[2]?.toLowerCase()
if (!bumpType || !['major', 'minor', 'patch'].includes(bumpType)) {
    console.error('Please specify version bump type: major, minor, or patch')
    process.exit(1)
}

// Read current version from package.json
const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
const [major, minor, patch] = packageJson.version.split('.').map(Number)

// Calculate new version based on bump type
let newVersion
switch (bumpType) {
    case 'major':
        newVersion = `${major + 1}.0.0`
        break
    case 'minor':
        newVersion = `${major}.${minor + 1}.0`
        break
    case 'patch':
        newVersion = `${major}.${minor}.${patch + 1}`
        break
}

// Update package.json with new version
packageJson.version = newVersion
writeFileSync('package.json', JSON.stringify(packageJson, null, '\t'))

// read minAppVersion from manifest.json and bump version to target version
let manifest = JSON.parse(readFileSync('manifest.json', 'utf8'))
const { minAppVersion } = manifest
manifest.version = newVersion
writeFileSync('manifest.json', JSON.stringify(manifest, null, '\t'))

// update versions.json with target version and minAppVersion from manifest.json
let versions = JSON.parse(readFileSync('versions.json', 'utf8'))
versions[newVersion] = minAppVersion
writeFileSync('versions.json', JSON.stringify(versions, null, '\t'))

console.log(`Version bumped to ${newVersion}`)

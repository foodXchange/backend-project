# FoodXchange Code Extraction for Review
$outputFile = "foodxchange-code-review.txt"
$rootPath = Get-Location

# Function to get file content with header
function Get-FileContent {
    param($filePath)
    
    $relativePath = $filePath.Replace($rootPath, "").TrimStart("\")
    $separator = "=" * 80
    $output = @"

$separator
FILE: $relativePath
$separator

"@
    
    try {
        $content = Get-Content $filePath -Raw
        $output += $content
    } catch {
        $output += "ERROR: Could not read file"
    }
    
    return $output
}

# Start extraction
"FOODXCHANGE BACKEND CODE REVIEW" | Out-File $outputFile
"Generated on: $(Get-Date)" | Out-File $outputFile -Append
"=" * 80 | Out-File $outputFile -Append

# Get all JavaScript files organized by folder
$folders = @(
    "src/config",
    "src/controllers", 
    "src/middleware",
    "src/models",
    "src/routes",
    "src/services/auth",
    "src/services/email",
    "src/services/notification",
    "src/services/search",
    "src/search/controllers",
    "src/search/indices",
    "src/search/services",
    "src/search/utils",
    "src/utils",
    "src/jobs"
)

# Also get root files
$rootFiles = @(
    "server.js",
    "package.json",
    ".env",
    ".gitignore"
)

# Extract root files first
"`n`nROOT FILES" | Out-File $outputFile -Append
"=" * 80 | Out-File $outputFile -Append

foreach ($file in $rootFiles) {
    if (Test-Path $file) {
        Get-FileContent $file | Out-File $outputFile -Append
    }
}

# Extract each folder
foreach ($folder in $folders) {
    if (Test-Path $folder) {
        "`n`nFOLDER: $folder" | Out-File $outputFile -Append
        "=" * 80 | Out-File $outputFile -Append
        
        $files = Get-ChildItem -Path $folder -Filter "*.js" -File
        foreach ($file in $files) {
            Get-FileContent $file.FullName | Out-File $outputFile -Append
        }
    }
}

Write-Host "Code extraction complete! Check $outputFile" -ForegroundColor Green

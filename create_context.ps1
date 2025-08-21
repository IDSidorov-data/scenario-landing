# --- НАСТРОЙКИ ---
$projectPath = $PSScriptRoot
$outputFile = Join-Path $projectPath "project_context.txt"

$excludeDirs = @(
    ".git", ".github", ".next", ".swc", "node_modules",
    ".vscode", "playwright-report", "test-results"
)
$excludeFiles = @(
    "*.env*", "yarn.lock", "package-lock.json", "pnpm-lock.yaml",
    "*.log", "tsconfig.tsbuildinfo", "project_context.txt",
    "*.svg", "*.png", "*.jpg", "*.jpeg", "*.gif", "*.ico",
    "*.woff", "*.woff2", "*.eot", "*.ttf", "*.mp4", "*.webm"
)

# --- БЫСТРАЯ РЕКУРСИВНАЯ ФУНКЦИЯ ---
function Get-FilteredChildItem-Fast {
    param(
        [string]$Path,
        [string[]]$ExcludeDirs
    )
    foreach ($item in Get-ChildItem -Path $Path -Force) {
        if ($item.PSIsContainer) {
            if ($ExcludeDirs -notcontains $item.Name) {
                $item
                Get-FilteredChildItem-Fast -Path $item.FullName -ExcludeDirs $ExcludeDirs
            }
        } else {
            $item
        }
    }
}

# --- НАЧАЛО СКРИПТА ---
Write-Host "Starting project context creation from: $projectPath" # ЗАМЕНЕНО НА АНГЛИЙСКИЙ ЯЗЫК
Clear-Content $outputFile -ErrorAction SilentlyContinue

$filteredItems = Get-FilteredChildItem-Fast -Path $projectPath -ExcludeDirs $excludeDirs

# 1. Добавляем структуру проекта
"Project: $($projectPath.Split('\')[-1])" | Add-Content -Path $outputFile
"--- PROJECT STRUCTURE ---" | Add-Content -Path $outputFile
$filteredItems | ForEach-Object {
    $relativePath = $_.FullName.Substring($projectPath.Length + 1)
    if ($excludeFiles | Where-Object { $relativePath -like $_ }) { return }

    $indent = "  " * ($relativePath.Split('\').Count - 1)
    if ($_.PSIsContainer) {
        "$indent[d] $($_.Name)" | Add-Content -Path $outputFile
    } else {
        "$indent[f] $($_.Name)" | Add-Content -Path $outputFile
    }
}
"`n`n--- FILE CONTENT ---`n`n" | Add-Content -Path $outputFile

# 2. Добавляем содержимое файлов
$filesToInclude = $filteredItems | Where-Object { -not $_.PSIsContainer } | Where-Object {
    $fileName = $_.Name
    $isExcluded = $false
    foreach ($pattern in $excludeFiles) {
        if ($fileName -like $pattern) { $isExcluded = $true; break }
    }
    -not $isExcluded
}

foreach ($file in $filesToInclude) {
    $relativePath = $file.FullName.Substring($projectPath.Length + 1)
    "--- START OF FILE: $relativePath ---" | Add-Content -Path $outputFile
    Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue | Add-Content -Path $outputFile
    "`n--- END OF FILE: $relativePath ---`n" | Add-Content -Path $outputFile
}

Write-Host "Done! Project context saved to file:" -ForegroundColor Green # ЗАМЕНЕНО НА АНГЛИЙСКИЙ ЯЗЫК
Write-Host $outputFile -ForegroundColor Yellow
$newSize = (Get-Item $outputFile).Length / 1KB
Write-Host "File size: $($newSize.ToString('F2')) KB" -ForegroundColor Cyan # ЗАМЕНЕНО НА АНГЛИЙСКИЙ ЯЗЫК
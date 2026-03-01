# Update package.json build script
$json = Get-Content "package.json" -Raw | ConvertFrom-Json
$json.scripts.build = "./build.sh"
$json | ConvertTo-Json -Depth 10 | Set-Content "package.json"

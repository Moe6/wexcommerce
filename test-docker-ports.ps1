# Test script to check Docker port accessibility

Write-Host "Testing Docker Port Accessibility" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$ports = @(
    @{Name="Frontend (Nginx)"; Port=8080; URL="http://localhost:8080"},
    @{Name="Admin (Nginx)"; Port=8001; URL="http://localhost:8001"},
    @{Name="Admin (Direct)"; Port=8005; URL="http://localhost:8005"},
    @{Name="Backend API"; Port=4005; URL="http://localhost:4005"},
    @{Name="Mongo Express"; Port=8084; URL="http://localhost:8084"}
)

foreach ($portInfo in $ports) {
    Write-Host "`nTesting $($portInfo.Name) on port $($portInfo.Port)..." -ForegroundColor Yellow
    
    $result = Test-NetConnection -ComputerName localhost -Port $portInfo.Port -InformationLevel Quiet -WarningAction SilentlyContinue
    
    if ($result) {
        Write-Host "✓ Port $($portInfo.Port) is accessible!" -ForegroundColor Green
        Write-Host "  Try accessing: $($portInfo.URL)" -ForegroundColor Cyan
        
        # Try HTTP request
        try {
            $response = Invoke-WebRequest -Uri $portInfo.URL -Method GET -TimeoutSec 3 -UseBasicParsing -ErrorAction Stop
            Write-Host "  HTTP Status: $($response.StatusCode)" -ForegroundColor Green
        } catch {
            Write-Host "  HTTP Request failed: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "✗ Port $($portInfo.Port) is NOT accessible" -ForegroundColor Red
    }
}

Write-Host "`n" -ForegroundColor Cyan
Write-Host "If ports are not accessible, this is a Docker Desktop port forwarding issue." -ForegroundColor Yellow
Write-Host "Solutions:" -ForegroundColor Cyan
Write-Host "1. Docker Desktop Settings > Resources > Network - Check port forwarding" -ForegroundColor White
Write-Host "2. Try restarting Docker Desktop" -ForegroundColor White
Write-Host "3. Check Windows Firewall rules" -ForegroundColor White
Write-Host "4. Try accessing via container IP (check docker inspect)" -ForegroundColor White


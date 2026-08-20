$files = Get-ChildItem -Path 'd:\gallery\public\*.jpeg' | Sort-Object Name
$i = 1
foreach ($file in $files) {
    $newName = "photo-$i.jpeg"
    Rename-Item $file.FullName -NewName $newName
    Write-Output "$($file.Name) -> $newName"
    $i++
}

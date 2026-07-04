import os

file_path = r'c:\Users\jthar\OneDrive\Documents\HackX\website\hackxjr9\src\components\TeamSection.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

phones = [
    'phone: "+94 77 220 3475",',
    'phone: "+94 76 991 0659",',
    'phone: "+94 76 609 8316",',
    'phone: "+94 70 513 5811",',
    'phone: "+94 77 171 9609",',
    'phone: "+94 74 046 0400",',
    'phone: "+94 70 423 6606",',
    'phone: "+94 76 116 8312",',
    'phone: "+94 77 512 3845",',
    'phone: "+94 766003262",'
]

for p in phones:
    content = content.replace(f'      {p}\r\n', '')
    content = content.replace(f'      {p}\n', '')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

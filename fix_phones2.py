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
    content = content.replace(f'      {p}\n', '')
    content = content.replace(f'      {p}', '')

# Handle phone button rendering conditionally
old_render = """<a
                href={`https://wa.me/${coord.phone.replace(/[+\s-]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-2.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md hover:bg-[#18A0C0]/20 hover:border-[#72E5F8]/30 transition-all duration-300 text-center flex items-center justify-center gap-1.5 text-xs text-white/80 hover:text-white"
                onClick={e => e.stopPropagation()}
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="truncate">WhatsApp</span>
              </a>"""

new_render = """{coord.phone && (
                <a
                  href={`https://wa.me/${coord.phone.replace(/[+\s-]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-2.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md hover:bg-[#18A0C0]/20 hover:border-[#72E5F8]/30 transition-all duration-300 text-center flex items-center justify-center gap-1.5 text-xs text-white/80 hover:text-white"
                  onClick={e => e.stopPropagation()}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span className="truncate">WhatsApp</span>
                </a>
              )}"""

content = content.replace(old_render, new_render)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

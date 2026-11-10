import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { LOGO_RATIO } from '@/components/ui/logo';

// The preview image shown when a PayPrimeTime link is shared (Open Graph and the Twitter large card).
// Drawn here rather than shipped as a file so it always matches the brand colours. The logo is the PNG
// copy of the same artwork the site uses (this renderer cannot read WebP).
export const alt = 'PayPrimeTime — secure payment pages for merchants';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const LOGO_HEIGHT = 92;

export default async function OpenGraphImage() {
  const logo = await readFile(path.join(process.cwd(), 'public', 'pay-primetime-logo.png'));
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #0a0a14 55%, #1e1b4b 130%)',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="" width={Math.round(LOGO_HEIGHT * LOGO_RATIO)} height={LOGO_HEIGHT} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', fontSize: 82, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            Secure payment pages
          </div>
          <div
            style={{ display: 'flex', fontSize: 82, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, color: '#818cf8' }}
          >
            for merchants.
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 28, color: '#9ca3af' }}>
          Every checkout names who you are paying before you pay.
        </div>
      </div>
    ),
    size,
  );
}

import { it, describe, expect } from 'vitest'

import { initFonts } from './utils.js'
import ogplay from '../src/index.js'

describe('Error', () => {
  let fonts
  initFonts((f) => (fonts = f))

  it('should throw if flex missing on div that has children', async () => {
    let error = new Error()
    try {
      await ogplay(
        <div>
          Test <span>ogplay</span> with space
        </div>,
        {
          width: 10,
          height: 10,
          fonts,
        }
      )
    } catch (err) {
      error = err
    }
    expect(error?.message).toBe(
      'Expected <div> to have explicit "display: flex" or "display: none" if it has more than one child node.'
    )
  })

  it('should throw if display inline-block on div that has children', async () => {
    const result = ogplay(
      <div style={{ display: 'inline-block' }}>
        Test <span>ogplay</span> with space
      </div>,
      {
        width: 10,
        height: 10,
        fonts,
      }
    )
    expect(result).rejects.toThrowError(
      `Invalid value for CSS property "display". Allowed values: "flex" | "block" | "none" | "-webkit-box". Received: "inline-block".`
    )
  })

  it('should throw if using invalid values', async () => {
    const result = ogplay(
      // @ts-expect-error
      <div style={{ position: 'fixed ' }}>Test</div>,
      {
        width: 10,
        height: 10,
        fonts,
      }
    )
    expect(result).rejects.toThrowError(
      `Invalid value for CSS property "position". Allowed values: "absolute" | "relative". Received: "fixed".`
    )
  })

  it('should not throw if display none on div that has children', async () => {
    const svg = await ogplay(
      <div style={{ display: 'none' }}>
        Test <span>ogplay</span> with space
      </div>,
      {
        width: 10,
        height: 10,
        fonts,
      }
    )
    expect(typeof svg).toBe('string')
  })

  it('should not throw if flex missing on span that has children', async () => {
    const svg = await ogplay(
      <span>
        Test <span>ogplay</span> with space
      </span>,
      {
        width: 10,
        height: 10,
        fonts,
      }
    )
    expect(typeof svg).toBe('string')
  })

  it('should not throw if flex missing on div without children', async () => {
    const svg = await ogplay(<div></div>, {
      width: 10,
      height: 10,
      fonts,
    })
    expect(typeof svg).toBe('string')
  })

  it('should not allowed to set negative value to rg-size', async () => {
    const result = ogplay(
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage:
            'radial-gradient(-20% 20% at top left, yellow, blue)',
          fontSize: 32,
          fontWeight: 600,
        }}
      ></div>,
      {
        width: 100,
        height: 100,
        fonts,
      }
    )

    expect(result).rejects.toThrowError(
      'disallow setting negative values to the size of the shape. Check https://w3c.github.io/csswg-drafts/css-images/#valdef-rg-size-length-0'
    )
  })
})

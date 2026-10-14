import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VasInput } from './VasInput'

function Harness({ initial, onChange }: { initial?: number; onChange?: (value: number) => void }) {
  const [value, setValue] = useState<number | undefined>(initial)
  return (
    <>
      <span id="label">How much is this like you?</span>
      <VasInput
        value={value}
        labelledBy="label"
        onChange={(next) => {
          setValue(next)
          onChange?.(next)
        }}
      />
    </>
  )
}

function mockTrackRect(slider: HTMLElement, left = 100, width = 200) {
  slider.getBoundingClientRect = () => ({ left, width, right: left + width, top: 0, bottom: 44, height: 44, x: left, y: 0, toJSON: () => ({}) })
}

describe('VasInput', () => {
  it('starts unanswered — no value, no marker', () => {
    render(<Harness />)
    const slider = screen.getByRole('slider', { name: 'How much is this like you?' })
    expect(slider).not.toHaveAttribute('aria-valuenow')
    expect(slider).toHaveAttribute('aria-valuetext', 'Not answered yet')
  })

  it('sets the value where the track is pressed', () => {
    const onChange = vi.fn()
    render(<Harness onChange={onChange} />)
    const slider = screen.getByRole('slider')
    mockTrackRect(slider)
    fireEvent.pointerDown(slider, { clientX: 250, button: 0, pointerId: 1 })
    expect(onChange).toHaveBeenLastCalledWith(75)
    expect(slider).toHaveAttribute('aria-valuenow', '75')
  })

  it('clamps presses outside the track to 0 and 100', () => {
    const onChange = vi.fn()
    render(<Harness onChange={onChange} />)
    const slider = screen.getByRole('slider')
    mockTrackRect(slider)
    fireEvent.pointerDown(slider, { clientX: 20, button: 0, pointerId: 1 })
    expect(onChange).toHaveBeenLastCalledWith(0)
    fireEvent.pointerDown(slider, { clientX: 999, button: 0, pointerId: 1 })
    expect(onChange).toHaveBeenLastCalledWith(100)
  })

  it('works with the keyboard: arrows ±1, Page keys ±10, Home/End', async () => {
    const user = userEvent.setup()
    render(<Harness initial={40} />)
    const slider = screen.getByRole('slider')
    slider.focus()
    await user.keyboard('{ArrowRight}')
    expect(slider).toHaveAttribute('aria-valuenow', '41')
    await user.keyboard('{PageDown}')
    expect(slider).toHaveAttribute('aria-valuenow', '31')
    await user.keyboard('{End}')
    expect(slider).toHaveAttribute('aria-valuenow', '100')
    await user.keyboard('{Home}')
    expect(slider).toHaveAttribute('aria-valuenow', '0')
  })

  it('first arrow press on an empty scale answers at the midpoint', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    const slider = screen.getByRole('slider')
    slider.focus()
    await user.keyboard('{ArrowLeft}')
    expect(slider).toHaveAttribute('aria-valuenow', '50')
  })

  it('is reachable with Tab', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.tab()
    expect(screen.getByRole('slider')).toHaveFocus()
  })
})

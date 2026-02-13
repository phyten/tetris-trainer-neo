import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import LegacyTrainer from './LegacyTrainer.vue'

describe('LegacyTrainer', () => {
  it('legacy iframe is rendered', () => {
    const wrapper = mount(LegacyTrainer)
    const iframe = wrapper.find('iframe')

    expect(iframe.exists()).toBe(true)
    expect(iframe.attributes('src')).toBe('/legacy/index.html')
  })
})

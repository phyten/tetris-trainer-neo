import { expect, within } from 'storybook/test'
import LegacyTrainer from './LegacyTrainer.vue'

export default {
  title: 'Trainer/LegacyTrainer',
  component: LegacyTrainer,
}

export const Default = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText(/TETRiS TRAiNER TRÈS-BiEN/)).toBeVisible()
  },
}
